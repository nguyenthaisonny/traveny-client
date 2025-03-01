import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { sendRequest } from "@/util/api";
import { IUser } from "@/type/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const user = null

                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        username: credentials.email,
                        password: credentials.password
                    }
                })

                if (res.statusCode === 201) {
                    return {
                        _id: res.data?.user?._id,
                        email: res.data?.user?.email,
                        name: res.data?.user?.name,
                        access_token: res.data?.access_token
                    }
                }

                // return user object with their profile data
                return user
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.user = (user as IUser)

            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user
            return session
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
})