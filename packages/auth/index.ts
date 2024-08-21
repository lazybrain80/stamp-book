import { KyselyAdapter } from "@auth/kysely-adapter";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import { Account } from "@saasfly/db";
import { db } from "./db";
import { env } from "./env.mjs";

type UserId = string;
type IsAdmin = boolean;

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      isAdmin: IsAdmin;
      account: Account;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    isAdmin: IsAdmin;
    account: Account;
  }
}

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code'
  })

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  adapter: KyselyAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: GOOGLE_AUTHORIZATION_URL
    })
  ],
  callbacks: {
    session({ token, session }) {
      if (token) {
        if (session.user) {
          session.user.account = token.account as Account;
          session.user.id = token.id as string;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
          session.user.isAdmin = token.isAdmin as boolean;
          console.log("session.user", session.user);
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
          if (account) {
            token.account = account;
          }
          const tokenAccount = token.account as Account;
          if (token.account && tokenAccount.expires_at && Date.now() >= (tokenAccount.expires_at ?? 0) * 1000) {
            const response = await fetch("https://oauth2.googleapis.com/token", {
              method: "POST",
              body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: tokenAccount.refresh_token as string,
              }),
            })
    
            const tokensOrError = await response.json()
    
            if (!response.ok) throw tokensOrError
    
            const newTokens = tokensOrError as {
              access_token: string
              expires_in: number
              refresh_token?: string
            }
    
            tokenAccount.access_token = newTokens.access_token
            tokenAccount.expires_at = Math.floor(
              Date.now() / 1000 + newTokens.expires_in
            )
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            if (newTokens.refresh_token)
              tokenAccount.refresh_token = newTokens.refresh_token
          }
    
          const email = token?.email ?? "";
          const dbUser = await db
            .selectFrom("User")
            .where("email", "=", email)
            .selectAll()
            .executeTakeFirst();
          if (!dbUser) {
            if (user) {
              token.id = user?.id;
            }
            return token;
          }
          let isAdmin = false;
          if (env.ADMIN_EMAIL) {
            const adminEmails = env.ADMIN_EMAIL.split(",");
            if (email) {
              isAdmin = adminEmails.includes(email);
            }
          }
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
            isAdmin: isAdmin,
            account: token.account,
          };
        },
  },
  debug: env.IS_DEBUG === "true",
};

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
