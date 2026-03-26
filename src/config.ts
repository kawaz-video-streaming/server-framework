import z from "zod";

export interface ServerConfig {
    port: number;
    secured: boolean;
    hostname: string;
}

const serverEnvSchema = z.object({
    PORT: z.coerce.number(),
    SECURED: z.boolean().default(false),
    HOSTNAME: z.string().default("0.0.0.0")
});

export const createServerConfig = (): ServerConfig => {
    const env = serverEnvSchema.parse(process.env);
    return {
        port: env.PORT,
        secured: env.SECURED,
        hostname: env.HOSTNAME
    }
}

