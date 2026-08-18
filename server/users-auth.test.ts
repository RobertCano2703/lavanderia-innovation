import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { hashLocalPassword, verifyLocalPassword } from "./localAuth";

describe("autenticación y CRUD persistente de usuarios locales", () => {
  it("genera y verifica contraseñas con el contrato usado por local_users", () => {
    const hash = hashLocalPassword("NuevaClave123");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(verifyLocalPassword("NuevaClave123", hash)).toBe(true);
    expect(verifyLocalPassword("OtraClave123", hash)).toBe(false);
  });

  it("conecta el login y el CRUD al repositorio persistente de usuarios", () => {
    const router = readFileSync(resolve(import.meta.dirname, "routers.ts"), "utf8");
    const db = readFileSync(resolve(import.meta.dirname, "db.ts"), "utf8");
    expect(router).toContain("verifyLocalUserCredentials(input.username, input.password)");
    expect(router).toContain("createLocalUser(input)");
    expect(router).toContain("updateLocalUser(input)");
    expect(router).toContain("deleteLocalUser(input.id)");
    expect(db).toContain("export async function updateLocalUser");
    expect(db).toContain("export async function deleteLocalUser");
    expect(db).toContain("hashLocalPassword(input.password)");
  });
});

describe("contrato de edición del módulo Usuarios", () => {
  it("envía usuario, rol y contraseña opcional al backend al editar", () => {
    const home = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain("updateUser.mutate({ id: editing.id, username: form.username, role: form.role");
    expect(home).toContain("form.password ? { password: form.password } : {}");
    expect(home).toContain("deleteUserMutation.mutate({ id: deleteUser.id }");
  });
});
