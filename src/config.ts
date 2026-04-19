import z from "zod";

export interface ServerConfig {
    port: number;
    secured: boolean;
    hostname: string;
    corsOrigins: string[];
}

const serverEnvSchema = z.object({
    PORT: z.coerce.number(),
    SECURED: z.string().default("false").transform(v => v === "true"),
    BIND_HOST: z.string().default("0.0.0.0"),
    CORS_ORIGINS: z.string().default('["http://localhost:3000"]').transform(s => JSON.parse(s))
});

export const createServerConfig = (): ServerConfig => {
    const env = serverEnvSchema.parse(process.env);
    return {
        port: env.PORT,
        secured: env.SECURED,
        hostname: env.BIND_HOST,
        corsOrigins: env.CORS_ORIGINS
    }
}

