import { env } from "@/config/env";

describe('Environment Configuration', () => {
    it('should load all required environment variables', () => {
        expect(typeof env.time_zone).toBe("string");
        expect(typeof env.database.client).toBe("string");
        expect(typeof env.database.connection.host).toBe("string");
        expect(typeof env.database.connection.user).toBe("string");
        expect(typeof env.database.connection.password).toBe("string");
        expect(typeof env.database.connection.database).toBe("string");
        expect(typeof env.api_url).toBe("string");
        expect(typeof env.secret).toBe("string");
        expect(typeof env.database.connection.port).toBe("number");
        expect(Number.isNaN(env.database.connection.port)).toBe(false);
        expect(typeof env.api_port).toBe("number");
        expect(Number.isNaN(env.api_port)).toBe(false);
    });
});