import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("regresiones de acceso y precios en la UI", () => {
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("envía el precio del servicio seleccionado y muestra Acceder en la portada", () => {
    expect(home).toContain("servicePrice: requestedPrice");
    expect(home).toContain("Valor del servicio: {money(selected.price)}");
    expect(home).toContain("<ShieldCheck size={16} /> Acceder");
    expect(home).toContain("<ShieldCheck size={15} /> Acceder");
  });

  it("muestra una vista previa térmica después de crear la solicitud pública", () => {
    expect(home).toContain("setPreviewTicket(persistedTicket)");
    expect(home).toContain('className="receipt-dialog public-receipt-dialog"');
    expect(home).toContain("Tel. {previewTicket.phone}");
    expect(home).toContain("{money(previewTicket.total)}");
    expect(home).toContain("Revisa la tira térmica y decide si deseas imprimirla.");
  });

  it("sincroniza clientes persistidos en el panel administrativo", () => {
    expect(home).toContain("trpc.clients.list.useQuery");
    expect(home).toContain("clientsQuery.data");
    expect(home).toContain("id: result.clientId");
  });

  it("restaura la sesión mediante auth.me y la elimina solo al cerrar sesión", () => {
    expect(home).toContain("trpc.auth.me.useQuery");
    expect(home).toContain("authMe.data");
    expect(home).toContain('window.localStorage.getItem("lavanderia_admin_session") === "active"');
    expect(home).toContain('window.localStorage.removeItem("lavanderia_admin_session")');
    expect(home).toContain("trpc.auth.localLogin.useMutation");
    expect(home).toContain("trpc.auth.logout.useMutation");
  });

  it("mantiene el precio del ticket como fuente del recibo POS", () => {
    expect(home).toContain("servicePrice: requestedPrice");
    expect(home).toContain("Valor del servicio: {money(selected.price)}");
    expect(home).toContain("ticket.total");
    expect(home).toContain("window.print()");
    expect(home).toContain("receipt-dialog");
    expect(home).toContain("Vista previa de la tira térmica antes de imprimir");
    expect(home).toContain("onPrint={t => setPreviewTicket(t)}");
    expect(home).toContain("setPreviewTicket(null)");
  });

  it("mantiene el login sin credenciales demo y con navegación de marca", () => {
    expect(home).toContain('className="login-brand brand brand-light"');
    expect(home).toContain('aria-label="Volver a la página principal"');
    expect(home).not.toContain("Demo: admin / admin123");
    expect(home).toContain('className="login-button"');
  });

  it("expone Configuración como módulo navegable y editable", () => {
    expect(home).toContain('onClick={() => chooseModule("configuracion")}');
    expect(home).toContain('new URLSearchParams(window.location.search).get("module") === "configuracion"');
    expect(home).toContain('module === "configuracion"');
    expect(home).toContain("Información del negocio");
    expect(home).toContain("Horarios de recogida");
    expect(home).toContain("Configuración guardada en esta sesión");
  });

  it("deja Crear cliente únicamente dentro del selector de clientes", () => {
    expect(home).toContain('<option value="__new__">+ Crear cliente nuevo</option>');
    expect(home).not.toContain('className="inline-create-button"');
    expect(home).not.toContain('>+ Crear cliente</Button>');
  });

  it("permite seleccionar domiciliarios activos y conserva uno asignado al editar", () => {
    expect(home).toContain("couriers={couriers}");
    expect(home).toContain('value={form.courier}');
    expect(home).toContain('<option value="">Sin asignar</option>');
    expect(home).toContain("courier.active || courier.name === form.courier");
    expect(home).toContain('value={courier.name}');
    expect(home).toContain("courier.phone");
  });

  it("protege tickets con consecutivo visible, archivo lógico y módulo histórico", () => {
    expect(home).toContain('"TK-" + String(Math.max(0, ...tickets.map(ticket => ticket.id)) + 1).padStart(6, "0")');
    expect(home).toContain('trpc.tickets.archived.useQuery');
    expect(home).toContain('trpc.tickets.archive.useMutation');
    expect(home).toContain('module === "ticketsArchivados"');
    expect(home).toContain('title="Archivar ticket"');
    expect(home).not.toContain('title="Eliminar"');
  });

  it("protege clientes y valida teléfono y correo antes de crear duplicados", () => {
    expect(home).toContain('function normalizePhone');
    expect(home).toContain('function normalizeEmail');
    expect(home).toContain('Ya existe un cliente con ese teléfono o correo');
    expect(home).toContain('className="active-label">Protegido</span>');
    expect(home).not.toContain('setDeleteClient');
  });

  it("permite editar archivados y conserva el estado histórico visible", () => {
    expect(home).toContain('trpc.tickets.updateArchived.useMutation');
    expect(home).toContain('function ArchivedTickets({ tickets, onPrint, onSave');
    expect(home).toContain('title="Editar"');
    expect(home).toContain('status-badge status-archived');
    expect(home).toContain('Archivado</span>');
  });

  it("muestra marca de agua de archivado o cancelación en el recibo", () => {
    expect(home).toContain('receipt-watermark');
    expect(home).toContain('"CANCELADO" : "ARCHIVADO"');
    expect(home).toContain('previewTicket.archived');
  });
});
