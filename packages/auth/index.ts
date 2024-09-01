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
import axios from "axios";

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
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
          if (account) {
            token.account = account;
            console.log("JWT-account", account)
          }
          
          const tokenAccount = token.account as Account;
          const shouldRefreshTime = (tokenAccount.expires_at ?? 0) * 1000 - 5 * 60 * 1000; // 만료 5분 전
          if (token.account && tokenAccount.expires_at && Date.now() >= shouldRefreshTime) {
            console.log("Refreshing token")
            try {
              const response = await axios.post("https://oauth2.googleapis.com/token", {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: tokenAccount.refresh_token,
                grant_type: "refresh_token",
              });
    
              const refreshedTokens = response.data;
              console.log("Refreshed tokens", refreshedTokens);
              tokenAccount.id_token = refreshedTokens.id_token;
              tokenAccount.access_token = refreshedTokens.access_token;
              tokenAccount.expires_at = Date.now() + refreshedTokens.expires_in * 1000;
              tokenAccount.refresh_token = refreshedTokens.refresh_token ?? tokenAccount.refresh_token;

              token.account = tokenAccount;
            } catch (error) {
              console.error("Error refreshing token", error);
              // 토큰 갱신 실패 시 기존 토큰을 무효화
              token.error = "RefreshAccessTokenError";
            }
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
