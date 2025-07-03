const getEnv = (key: string, defaultValue?: string) => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw Error(`Missing String environment variable: ${key}`)
    }

    return value;
}

export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REDIS_CONNECTION_URL = getEnv("REDIS_CONNECTION_URL");
