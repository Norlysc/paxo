import { describe, expect, it } from "vitest";
import { quoteRequestSchema } from "./schemas";

describe("quoteRequestSchema", () => {
  it("accepts a valid quote request", () => {
    const result = quoteRequestSchema.safeParse({
      fullName: "María Pérez",
      phone: "+58 412 1234567",
      email: "maria@example.com",
      serviceSlug: "electricidad",
      description: "Necesito revisar el tablero eléctrico de mi local.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid service slug", () => {
    const result = quoteRequestSchema.safeParse({
      fullName: "María Pérez",
      phone: "+58 412 1234567",
      serviceSlug: "servicio-inexistente",
      description: "Necesito revisar el tablero eléctrico de mi local.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description that is too short", () => {
    const result = quoteRequestSchema.safeParse({
      fullName: "María Pérez",
      phone: "+58 412 1234567",
      serviceSlug: "electricidad",
      description: "corto",
    });
    expect(result.success).toBe(false);
  });
});
