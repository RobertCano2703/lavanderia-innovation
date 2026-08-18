import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createPublicTicket, listTickets } from "./db";
import { COOKIE_NAME } from "../shared/const";

const publicTicketInput = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().min(4),
  service: z.string().trim().min(1),
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
