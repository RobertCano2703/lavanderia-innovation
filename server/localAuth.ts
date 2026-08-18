import { createHash } from "node:crypto";

export const LOCAL_ADMIN = { username: "admin", password: "admin123", role: "Administrador" as const };

export function hashLocalPassword(password: string) {
  return createHash("sha256").update(password, "utf8").digest("hex");
}

export function verifyLocalPassword(password: string, passwordHash: string) {
  return hashLocalPassword(password) === passwordHash;
}

export const seedCatalog = {
  services: [
    { name: "Lavado + Secado", description: "Lavado completo y secado industrial", price: "22000.00" },
    { name: "Lavado en seco", description: "Cuidado especializado para prendas delicadas", price: "28500.00" },
    { name: "Planchado", description: "Planchado profesional por docena", price: "16000.00" },
  ],
  deliveryPersonnel: [
    { name: "Carlos Méndez", phone: "+57 318 900 2211" },
    { name: "Ana Torres", phone: "+57 301 442 8890" },
    { name: "Luis Pérez", phone: "+57 316 775 0432" },
  ],
};
