import bcrypt from "bcryptjs";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "./prisma";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            company: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          companyId: user.companyId,
          mpConnected: !!user.company?.mpAccessToken,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.companyId = user.companyId;
        token.mpConnected = user.mpConnected;
      }

      if (trigger === "update") {
        if (session?.companyId) {
          token.companyId = session.companyId;
        }
        if (session?.mpConnected !== undefined) {
          token.mpConnected = session.mpConnected;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.name = token.name || null;
        session.user.email = token.email || null;
        session.user.companyId = (token.companyId as string | null) || null;
        session.user.mpConnected = (token.mpConnected as boolean) ?? false;
      }
      return session;
    },
  },
};
