import { beforeEach, describe, expect, it, vi } from "vitest";

const createPublicTicket = vi.fn();
const listTickets = vi.fn();

vi.mock("./db", () => ({ createPublicTicket, listTickets }));

const { appRouter } = await import("./routers");

describe("public ticket persistence", () => {
  beforeEach(() => {
    createPublicTicket.mockReset();
    listTickets.mockReset();
  });

  it("accepts a mobile-compatible public request and returns its persisted ticket number", async () => {
    createPublicTicket.mockResolvedValue({ id: 37100, ticketNumber: "TK-37100", total: 16000 });
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

    const result = await caller.tickets.createPublic({
      name: "Robert Cano",
      phone: "+573172413300",
      email: "",
      address: "Cra 2B #48r-87 sur",
      service: "Chaqueta De Plumas",
      day: "Miércoles",
      pickup: "9:30 a. m. - 12:30 p. m.",
      delivery: "2:30 p. m. - 5:00 p. m.",
      clothes: "Ropa",
      notes: "",
    });

    expect(createPublicTicket).toHaveBeenCalledOnce();
    expect(result).toEqual({ id: 37100, ticketNumber: "TK-37100", total: 16000 });
  });

  it("returns persisted tickets to the administrative panel across browser sessions", async () => {
    const persisted = [{
      id: 37100,
      ticket: "TK-37100",
      client: "Robert Cano",
      phone: "+573172413300",
      email: "",
      address: "Cra 2B #48r-87 sur",
      service: "Chaqueta De Plumas",
      courier: "Sin asignar",
      status: "Pendiente" as const,
      total: 16000,
      pickup: "9:30 a. m. - 12:30 p. m.",
      delivery: "2:30 p. m. - 5:00 p. m.",
      clothes: "Ropa",
      notes: "Miércoles.",
    }];
    listTickets.mockResolvedValue(persisted);
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

    await expect(caller.tickets.list()).resolves.toEqual(persisted);
    expect(listTickets).toHaveBeenCalledOnce();
  });
});
