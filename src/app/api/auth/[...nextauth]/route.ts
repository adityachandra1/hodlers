import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions, Session, Account } from "next-auth";
import { JWT } from "next-auth/jwt";

interface ExtendedSession extends Session {
    id_token?: string;
}


interface ExtendedJWT extends JWT {
    id_token?: string;
}

export const authOptions: AuthOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
            httpOptions: {
                timeout: 40000
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }: { token: ExtendedJWT; account: Account | null }) {
            if (account) {
                token.id_token = account.id_token;
            }
            return token;
        },
        async session({ session, token }: { session: ExtendedSession; token: ExtendedJWT }) {
            if (token) {
                session.id_token = token.id_token;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
