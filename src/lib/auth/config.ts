import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
// Future: import Credentials from "next-auth/providers/credentials";

/**
 * Auth Configuration
 *
 * Currently enabled:
 * - Google OAuth
 *
 * Ready to add later:
 * - Credentials (Email + Password)
 * - Magic Link (Email)
 * - Apple, GitHub, etc.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    // ===== OAUTH PROVIDERS =====
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ===== CREDENTIALS (Email + Password) =====
    // Uncomment when ready to implement:
    //
    // Credentials({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) {
    //       return null;
    //     }
    //
    //     // TODO: Implement password verification
    //     // const user = await prisma.user.findUnique({
    //     //   where: { email: credentials.email as string },
    //     // });
    //     //
    //     // if (!user || !user.passwordHash) return null;
    //     //
    //     // const isValid = await bcrypt.compare(
    //     //   credentials.password as string,
    //     //   user.passwordHash
    //     // );
    //     //
    //     // if (!isValid) return null;
    //     //
    //     // return { id: user.id, email: user.email, name: user.name };
    //
    //     return null;
    //   },
    // }),
  ],
};

/**
 * To add Email + Password later:
 *
 * 1. Add to Prisma schema:
 *    model User {
 *      ...
 *      passwordHash  String?
 *    }
 *
 * 2. Install bcrypt:
 *    yarn add bcryptjs
 *    yarn add -D @types/bcryptjs
 *
 * 3. Uncomment Credentials provider above
 *
 * 4. Create registration API route:
 *    POST /api/auth/register
 */
