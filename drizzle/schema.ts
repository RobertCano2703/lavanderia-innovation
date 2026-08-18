import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const localUsers = mysqlTable("local_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["Administrador", "Empleado"]).default("Empleado").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().unique(),
  email: varchar("email", { length: 180 }),
  address: varchar("address", { length: 240 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const deliveryPersonnel = mysqlTable("delivery_personnel", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().unique(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  ticketNumber: varchar("ticketNumber", { length: 40 }).notNull().unique(),
  clientId: int("clientId").notNull().references(() => clients.id),
  serviceId: int("serviceId").notNull().references(() => services.id),
  deliveryPersonnelId: int("deliveryPersonnelId").references(() => deliveryPersonnel.id),
  status: mysqlEnum("status", ["Pendiente", "EnProceso", "Enrutado", "Entregado", "Cancelado"]).default("Pendiente").notNull(),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  pickupTimeStart: varchar("pickupTimeStart", { length: 30 }),
  pickupTimeEnd: varchar("pickupTimeEnd", { length: 30 }),
  deliveryTimeStart: varchar("deliveryTimeStart", { length: 30 }),
  deliveryTimeEnd: varchar("deliveryTimeEnd", { length: 30 }),
  clothingDescription: text("clothingDescription"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type Service = typeof services.$inferSelect;
export type DeliveryPersonnel = typeof deliveryPersonnel.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
