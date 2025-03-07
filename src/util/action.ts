'use server'
import { signIn } from "@/auth";

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            email: email,
            password: password,
            callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }
        }
        if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        }
        return {
            error: "Internal sever error",
            code: 0
        }
    }
}