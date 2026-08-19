import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { sdk } from "./_core/sdk";
import { publicProcedure, router } from "./_core/trpc";
import { archiveTicket, createLocalUser, createPublicTicket, deleteArchivedTicket, deleteLocalUser, listArchivedTickets, listClients, listLocalUsers, listTickets, updateArchivedTicket, updateLocalUser, upsertUser, verifyLocalUserCredentials } from "./db";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";

const publicTicketInput = z.object({
  name: z.string().trim().min(2),
  phone: z.string().regex(/^\d{10}$/, "El teléfono debe contener exactamente 10 dígitos numéricos, sin indicativo."),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().min(4),
  service: z.string().trim().min(1),
  servicePrice: z.number().nonnegative().optional(),
  day: z.string().trim().min(1),
  pickup: z.string().trim().min(1),
  delivery: z.string().trim().min(1),
  clothes: z.string().trim().min(1),
  notes: z.string().trim().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    localLogin: publicProcedure.input(z.object({ username: z.string().trim().min(1), password: z.string().min(1) })).mutation(async ({ input, ctx }) => {
      const localUser = await verifyLocalUserCredentials(input.username, input.password);
      if (!localUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuario o contraseña incorrectos" });
      const openId = `local-user-${localUser.id}`;
      await upsertUser({ openId, name: localUser.username, email: `${localUser.username}@lavanderia.local`, loginMethod: "local", role: localUser.role === "Administrador" ? "admin" : "user" });
      const token = await sdk.createSessionToken(openId, { name: localUser.username, expiresInMs: ONE_YEAR_MS });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return { success: true } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  users: router({
    list: publicProcedure.query(() => listLocalUsers()),
    create: publicProcedure.input(z.object({ username: z.string().trim().min(1), password: z.string().min(6), role: z.enum(["Administrador", "Empleado"]) })).mutation(({ input }) => createLocalUser(input)),
    update: publicProcedure.input(z.object({ id: z.number().int().positive(), username: z.string().trim().min(1), password: z.string().min(6).optional(), role: z.enum(["Administrador", "Empleado"]) })).mutation(({ input }) => updateLocalUser(input)),
    delete: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteLocalUser(input.id)),
  }),
  clients: router({
    list: publicProcedure.query(() => listClients()),
  }),
  tickets: router({
    list: publicProcedure.query(() => listTickets()),
    archived: publicProcedure.query(() => listArchivedTickets()),
    archive: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => archiveTicket(input.id)),
    updateArchived: publicProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["Pendiente", "EnProceso", "Enrutado", "Entregado", "Cancelado"]), totalAmount: z.number().nonnegative(), notes: z.string().optional() })).mutation(({ input }) => updateArchivedTicket(input)),
    deleteArchived: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteArchivedTicket(input.id)),
    createPublic: publicProcedure.input(publicTicketInput).mutation(({ input }) => createPublicTicket(input)),
  }),
});

export type AppRouter = typeof appRouter;
