import { desc, eq, isNotNull, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  clients,
  deliveryPersonnel,
  InsertUser,
  services,
  tickets,
  users,
  localUsers,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { hashLocalPassword, verifyLocalPassword } from "./localAuth";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function listLocalUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: localUsers.id, username: localUsers.username, role: localUsers.role, createdAt: localUsers.createdAt }).from(localUsers);
}

export async function getLocalUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(localUsers).where(eq(localUsers.username, username)).limit(1);
  return result[0];
}

export async function createLocalUser(input: { username: string; password: string; role: "Administrador" | "Empleado" }) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  const inserted = await db.insert(localUsers).values({ username: input.username, passwordHash: hashLocalPassword(input.password), role: input.role });
  const result = await db.select({ id: localUsers.id, username: localUsers.username, role: localUsers.role, createdAt: localUsers.createdAt }).from(localUsers).where(eq(localUsers.id, Number(inserted[0].insertId))).limit(1);
  return result[0];
}

export async function updateLocalUser(input: { id: number; username: string; password?: string; role: "Administrador" | "Empleado" }) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  await db.update(localUsers).set({ username: input.username, ...(input.password ? { passwordHash: hashLocalPassword(input.password) } : {}), role: input.role }).where(eq(localUsers.id, input.id));
  const result = await db.select({ id: localUsers.id, username: localUsers.username, role: localUsers.role, createdAt: localUsers.createdAt }).from(localUsers).where(eq(localUsers.id, input.id)).limit(1);
  return result[0];
}

export async function deleteLocalUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  await db.delete(localUsers).where(eq(localUsers.id, id));
  return { success: true } as const;
}

export async function verifyLocalUserCredentials(username: string, password: string) {
  const user = await getLocalUserByUsername(username);
  if (!user || !verifyLocalPassword(password, user.passwordHash)) return undefined;
  return user;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type PublicTicketInput = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  service: string;
  day: string;
  pickup: string;
  delivery: string;
  clothes: string;
  notes?: string;
  servicePrice?: number;
};

const fallbackServicePrices: Record<string, number> = {
  Camisa: 8000,
  Camiseta: 8000,
  Pantalón: 9000,
  Jeans: 9000,
  "Chaqueta De Plumas": 16000,
};

function splitTimeRange(value: string) {
  const parts = value.split(" - ").map(part => part.trim());
  return { start: parts[0] || value, end: parts[1] || parts[0] || value };
}

function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function makeProvisionalTicketNumber() {
  return `TK-TMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function makeTicketNumberFromId(id: number) {
  return `TK-${String(id).padStart(6, "0")}`;
}

export async function createPublicTicket(input: PublicTicketInput) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");

  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  const clientMatch = email
    ? or(eq(clients.phone, phone), eq(clients.email, email))
    : eq(clients.phone, phone);
  const existingClient = await db.select().from(clients).where(clientMatch).limit(1);
  let clientId = existingClient[0]?.id;
  if (clientId) {
    await db.update(clients).set({ name: input.name, phone, email: email || null, address: input.address, archivedAt: null }).where(eq(clients.id, clientId));
  } else {
    const inserted = await db.insert(clients).values({
      name: input.name,
      phone,
      email: email || null,
      address: input.address,
    });
    clientId = Number(inserted[0].insertId);
  }

  const existingService = await db.select().from(services).where(eq(services.name, input.service)).limit(1);
  let service = existingService[0];
  const requestedPrice = input.servicePrice ?? fallbackServicePrices[input.service] ?? 0;
  if (!service) {
    const inserted = await db.insert(services).values({ name: input.service, description: input.service, price: String(requestedPrice), isActive: true });
    const created = await db.select().from(services).where(eq(services.id, Number(inserted[0].insertId))).limit(1);
    service = created[0];
  } else if (Number(service.price) === 0 && requestedPrice > 0) {
    await db.update(services).set({ price: String(requestedPrice) }).where(eq(services.id, service.id));
    service = { ...service, price: String(requestedPrice) };
  }
  if (!service) throw new Error("No fue posible resolver el servicio solicitado");

  const pickup = splitTimeRange(input.pickup);
  const delivery = splitTimeRange(input.delivery);
  const insertedTicket = await db.insert(tickets).values({
    ticketNumber: makeProvisionalTicketNumber(),
    clientId,
    serviceId: service.id,
    status: "Pendiente",
    totalAmount: service.price,
    pickupTimeStart: pickup.start,
    pickupTimeEnd: pickup.end,
    deliveryTimeStart: delivery.start,
    deliveryTimeEnd: delivery.end,
    clothingDescription: input.clothes,
    notes: `${input.day}. ${input.notes || "Solicitud recibida desde la web"}`,
  });

  const ticketId = Number(insertedTicket[0].insertId);
  const ticketNumber = makeTicketNumberFromId(ticketId);
  await db.update(tickets).set({ ticketNumber }).where(eq(tickets.id, ticketId));

  return { id: ticketId, clientId, ticketNumber, total: Number(service.price) };
}

export async function listClients() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  const rows = await db.select().from(clients).where(isNull(clients.archivedAt)).orderBy(desc(clients.createdAt));
  return rows.map(client => ({ id: client.id, name: client.name, phone: client.phone, email: client.email || "—", address: client.address }));
}

export async function archiveTicket(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  await db.update(tickets).set({ archivedAt: new Date() }).where(eq(tickets.id, id));
  return { success: true } as const;
}

export async function listArchivedTickets() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  const rows = await db
    .select({ ticket: tickets, client: clients, service: services, courier: deliveryPersonnel })
    .from(tickets)
    .innerJoin(clients, eq(tickets.clientId, clients.id))
    .innerJoin(services, eq(tickets.serviceId, services.id))
    .leftJoin(deliveryPersonnel, eq(tickets.deliveryPersonnelId, deliveryPersonnel.id))
    .where(isNotNull(tickets.archivedAt))
    .orderBy(desc(tickets.createdAt));
  return rows.map(({ ticket, client, service, courier }) => ({
    id: ticket.id,
    ticket: ticket.ticketNumber,
    client: client.name,
    phone: client.phone,
    email: client.email || "",
    address: client.address,
    service: service.name,
    courier: courier?.name || "Sin asignar",
    status: ticket.status,
    total: Number(ticket.totalAmount) || Number(service.price) || fallbackServicePrices[service.name] || 0,
    pickup: [ticket.pickupTimeStart, ticket.pickupTimeEnd].filter(Boolean).join(" - "),
    delivery: [ticket.deliveryTimeStart, ticket.deliveryTimeEnd].filter(Boolean).join(" - "),
    clothes: ticket.clothingDescription || "",
    notes: ticket.notes || "",
  }));
}

export async function listTickets() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");
  const rows = await db
    .select({ ticket: tickets, client: clients, service: services, courier: deliveryPersonnel })
    .from(tickets)
    .innerJoin(clients, eq(tickets.clientId, clients.id))
    .innerJoin(services, eq(tickets.serviceId, services.id))
    .leftJoin(deliveryPersonnel, eq(tickets.deliveryPersonnelId, deliveryPersonnel.id))
    .where(isNull(tickets.archivedAt))
    .orderBy(desc(tickets.createdAt));

  return rows.map(({ ticket, client, service, courier }) => ({
    id: ticket.id,
    ticket: ticket.ticketNumber,
    client: client.name,
    phone: client.phone,
    email: client.email || "",
    address: client.address,
    service: service.name,
    courier: courier?.name || "Sin asignar",
    status: ticket.status,
    total: Number(ticket.totalAmount) || Number(service.price) || fallbackServicePrices[service.name] || 0,
    pickup: [ticket.pickupTimeStart, ticket.pickupTimeEnd].filter(Boolean).join(" - "),
    delivery: [ticket.deliveryTimeStart, ticket.deliveryTimeEnd].filter(Boolean).join(" - "),
    clothes: ticket.clothingDescription || "",
    notes: ticket.notes || "",
  }));
}
