import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { sdk } from "./_core/sdk";
import { publicProcedure, router } from "./_core/trpc";
import { createPublicTicket, listTickets, upsertUser } from "./db";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";

const publicTicketInput = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7),
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
    localLogin: publicProcedure.input(z.object({ username: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {
      if (input.username !== "admin" || input.password !== "admin123") throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales demo incorrectas" });
      const openId = "local-demo-admin";
      await upsertUser({ openId, name: "Administrador", email: "admin@lavanderia.local", loginMethod: "local", role: "admin" });
      const token = await sdk.createSessionToken(openId, { name: "Administrador", expiresInMs: ONE_YEAR_MS });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return { success: true } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  tickets: router({
    list: publicProcedure.query(() => listTickets()),
    createPublic: publicProcedure.input(publicTicketInput).mutation(({ input }) => createPublicTicket(input)),
  }),
});

export type AppRouter = typeof appRouter;
