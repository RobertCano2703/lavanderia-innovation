import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SettingsModule } from "../client/src/pages/Home";

describe("SettingsModule", () => {
  it("renderiza la configuración operativa y sus controles principales", () => {
    const markup = renderToStaticMarkup(React.createElement(SettingsModule));
    expect(markup).toContain("Configuración");
    expect(markup).toContain("Información del negocio");
    expect(markup).toContain("Horarios de recogida");
    expect(markup).toContain("Nombre del negocio");
    expect(markup).toContain("Guardar cambios");
    expect(markup).toContain("Lavanderia Innovation");
    expect(markup).toContain("Sin servicio");
  });
});
