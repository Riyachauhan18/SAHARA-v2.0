import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;

                // In a real app, use bcrypt.compare(credentials.password, user.encrypted_password)
                // For prototype, we use simple string check or the placeholder hash
                // We accept the "commonPassword" used in seed: "hashed_password_123"
                const isValid = credentials.password === "password123" || credentials.password === user.encrypted_password;

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.full_name,
                    role: user.role,
                    hospital_id: user.hospital_id,
                    blood_bank_id: user.blood_bank_id
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.hospital_id = user.hospital_id;
                token.blood_bank_id = user.blood_bank_id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id; // Extending session type in TS needs declaration merging, skipping for now by casting
                (session.user as any).role = token.role;
                (session.user as any).hospital_id = token.hospital_id;
                (session.user as any).blood_bank_id = token.blood_bank_id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', // Custom login page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecret"
};
