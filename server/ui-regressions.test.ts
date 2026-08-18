import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("regresiones de acceso y precios en la UI", () => {
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("envía el precio del servicio seleccionado y muestra Acceder en la portada", () => {
    expect(home).toContain("servicePrice: service?.price || 0");
    expect(home).toContain("<ShieldCheck size={16} /> Acceder");
    expect(home).toContain("<ShieldCheck size={15} /> Acceder");
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
    expect(home).toContain("servicePrice: service?.price || 0");
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
});
