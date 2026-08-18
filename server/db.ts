import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  clients,
  deliveryPersonnel,
  InsertUser,
  services,
  tickets,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

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
};

function splitTimeRange(value: string) {
  const parts = value.split(" - ").map(part => part.trim());
  return { start: parts[0] || value, end: parts[1] || parts[0] || value };
}

function makeTicketNumber() {
  return `TK-${String(Date.now()).slice(-5)}${Math.floor(Math.random() * 10)}`;
}

export async function createPublicTicket(input: PublicTicketInput) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible");

  const existingClient = await db.select().from(clients).where(eq(clients.phone, input.phone)).limit(1);
  let clientId = existingClient[0]?.id;
  if (clientId) {
    await db.update(clients).set({ name: input.name, email: input.email || null, address: input.address }).where(eq(clients.id, clientId));
  } else {
    const inserted = await db.insert(clients).values({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      address: input.address,
    });
    clientId = Number(inserted[0].insertId);
  }

  const existingService = await db.select().from(services).where(eq(services.name, input.service)).limit(1);
  let service = existingService[0];
  if (!service) {
    const inserted = await db.insert(services).values({ name: input.service, description: input.service, price: "0", isActive: true });
    const created = await db.select().from(services).where(eq(services.id, Number(inserted[0].insertId))).limit(1);
    service = created[0];
  }
  if (!service) throw new Error("No fue posible resolver el servicio solicitado");

  const pickup = splitTimeRange(input.pickup);
  const delivery = splitTimeRange(input.delivery);
  const ticketNumber = makeTicketNumber();
  const insertedTicket = await db.insert(tickets).values({
    ticketNumber,
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

  return { id: Number(insertedTicket[0].insertId), ticketNumber, total: Number(service.price) };
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
    total: Number(ticket.totalAmount),
    pickup: [ticket.pickupTimeStart, ticket.pickupTimeEnd].filter(Boolean).join(" - "),
    delivery: [ticket.deliveryTimeStart, ticket.deliveryTimeEnd].filter(Boolean).join(" - "),
    clothes: ticket.clothingDescription || "",
    notes: ticket.notes || "",
  }));
}
