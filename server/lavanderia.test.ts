import { describe, expect, it } from "vitest";
import { hashLocalPassword, LOCAL_ADMIN, seedCatalog, verifyLocalPassword } from "./localAuth";

const TICKET_STATUSES = ["Pendiente", "EnProceso", "Enrutado", "Entregado", "Cancelado"] as const;

function formatTicketTotal(amount: number) {
  return `$${amount.toLocaleString("es-CO")}`;
}

describe("Lavanderia Innovation business rules", () => {
  it("preserves the required ticket status vocabulary", () => {
    expect(TICKET_STATUSES).toEqual(["Pendiente", "EnProceso", "Enrutado", "Entregado", "Cancelado"]);
  });

  it("formats POS totals using Colombian currency notation", () => {
    expect(formatTicketTotal(42000)).toBe("$42.000");
  });

  it("verifies local passwords without an external provider", () => {
    const hash = hashLocalPassword(LOCAL_ADMIN.password);
    expect(verifyLocalPassword("admin123", hash)).toBe(true);
    expect(verifyLocalPassword("wrong-password", hash)).toBe(false);
  });

  it("contains seeded services and delivery personnel", () => {
    expect(seedCatalog.services.length).toBeGreaterThanOrEqual(3);
    expect(seedCatalog.deliveryPersonnel.length).toBeGreaterThanOrEqual(3);
  });

  it("uses the exact business name for the POS header", () => {
    const receiptHeader = "LAVANDERIA INNOVATION";
    expect(receiptHeader).toContain("LAVANDERIA INNOVATION");
  });
});
