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
    createPublicTicket.mockResolvedValue({ id: 37100, clientId: 44, ticketNumber: "TK-37100", total: 16000 });
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

    const result = await caller.tickets.createPublic({
      name: "Robert Cano",
      phone: "3172413300",
      email: "",
      address: "Cra 2B #48r-87 sur",
      service: "Chaqueta De Plumas",
      servicePrice: 16000,
      day: "Miércoles",
      pickup: "9:30 a. m. - 12:30 p. m.",
      delivery: "2:30 p. m. - 5:00 p. m.",
      clothes: "Ropa",
      notes: "",
    });

    expect(createPublicTicket).toHaveBeenCalledOnce();
    expect(createPublicTicket).toHaveBeenCalledWith(expect.objectContaining({ service: "Chaqueta De Plumas", servicePrice: 16000 }));
    expect(result).toEqual({ id: 37100, clientId: 44, ticketNumber: "TK-37100", total: 16000 });
  });

  it("rejects international prefixes and non-local phone formats", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    await expect(caller.tickets.createPublic({
      name: "Cliente Inválido",
      phone: "+573172413300",
      email: "invalido@email.com",
      address: "Carrera 1 # 2-3",
      service: "Camisa",
      servicePrice: 8000,
      day: "Lunes",
      pickup: "9:30 a. m. - 12:30 p. m.",
      delivery: "2:30 p. m. - 5:00 p. m.",
      clothes: "1 camisa",
      notes: "",
    })).rejects.toThrow(/exactamente 10 dígitos/);
    expect(createPublicTicket).not.toHaveBeenCalled();
  });

  it("returns persisted tickets to the administrative panel across browser sessions", async () => {
    const persisted = [{
      id: 37100,
      ticket: "TK-37100",
      client: "Robert Cano",
      phone: "3172413300",
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
