import z from "zod";

export interface ServerConfig {
    port: number;
    secured: boolean;
}

const serverEnvSchema = z.object({
    PORT: z.coerce.number(),
    SECURED: z.boolean().default(false)
});


export const createServerConfig = (): ServerConfig => {
    const env = serverEnvSchema.parse(process.env);
    return {
        port: env.PORT,
        secured: env.SECURED
    }
}

