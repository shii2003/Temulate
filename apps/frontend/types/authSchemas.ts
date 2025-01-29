import { z } from "zod";

export const signupSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must not exceed 30 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(30, "Password must not exceed 30 characters")
        .refine(
            (value) => /[A-Z]/.test(value),
            { message: "Password must contain at least one uppercase character" }
        )
        .refine(
            (value) => /[a-z]/.test(value),
            { message: "Password must contain at least one lowercase character" }
        )
        .refine(
            (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
            { message: "Password must contain at least one special character" }
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be atleast 6 characters long")
        .max(30, "Password must not exceed 30 characters")
})