const getEnv = (key: string, defaultValue?: string) => {
    const value = process.env[key] || defaultValue;

    if (value === undefined) {
        throw Error(`Missing String environment variable for ${key}`);
    }
    return value;
}

export const NODE_ENV = getEnv("NODE_ENV")
export const PORT = getEnv("PORT", "5000");
export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const APP_ORIGIN = getEnv("APP_ORIGIN");