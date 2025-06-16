import { env } from "@/config/env";

describe("Environment Configuration", () => {
  const isCI = process.env.CI === "true";
  (isCI ? it.skip : it)(
    "should load all required environment variables",
    () => {
      expect(typeof env.time_zone).toBe("string");
      expect(typeof env.database.client).toBe("string");
      expect(typeof env.database.connection.host).toBe("string");
      expect(typeof env.database.connection.user).toBe("string");
      expect(typeof env.database.connection.password).toBe("string");
      expect(typeof env.database.connection.database).toBe("string");
      expect(typeof env.secret).toBe("string");
      expect(typeof env.database.connection.port).toBe("number");
      expect(Number.isNaN(env.database.connection.port)).toBe(false);
      expect(typeof env.api_port).toBe("number");
      expect(Number.isNaN(env.api_port)).toBe(false);
      expect(env.smtp.host).toBeDefined();
      expect(env.smtp.port).toBeDefined();
      expect(env.smtp.user).toBeDefined();
      expect(env.smtp.password).toBeDefined();
      expect(env.stripe).toBeDefined();
      expect(typeof env.stripe.stripe_secret).toBe("string");
      expect(typeof env.stripe.price_ids.basic).toBe("string");
      expect(typeof env.stripe.price_ids.standard).toBe("string");
      expect(typeof env.stripe.price_ids.premium).toBe("string");
    },
  );
});
