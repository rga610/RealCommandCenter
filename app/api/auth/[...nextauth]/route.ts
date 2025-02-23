import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// ✅ Define NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.readonly",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Ensure this page exists
    error: "/auth/error",   // Ensure this page exists
  },
  callbacks: {
    /**
     * 🔒 Restrict sign-in to users with @costaricaluxury.com domain
     */
    async signIn({ account, profile }) {
      if (!profile?.email) {
        console.error("❌ No email found during sign-in attempt");
        return false;
      }

      const emailDomain = profile.email.split("@")[1]; // Extract domain from email
      if (emailDomain !== "costaricaluxury.com") {
        console.error(`❌ Unauthorized login attempt: ${profile.email}`);
        return false; // Reject login if not from costaricaluxury.com
      }

      return true; // ✅ Allow sign-in if domain matches
    },

    /**
     * 🔍 Store access token & fetch Google profile picture
     */
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;

        // 🔍 Fetch Google User Info, including profile picture
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${account.access_token}` },
          });
          const data = await res.json();
          console.log("🔍 Google User Info:", data); // ✅ Debug log
          token.picture = data.picture || ""; // ✅ Store profile image
        } catch (error) {
          console.error("❌ Error fetching Google user profile:", error);
        }
      }
      return token;
    },

    /**
     * 🔗 Attach token data to session object
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.image = token.picture || session.user.image || "/default-profile.png"; // ✅ Fallback to default image
      }
      return session;
    },
  },
};

// ✅ Create the NextAuth handler
const handler = NextAuth(authOptions);

// ✅ Export as GET and POST for the App Router
export { handler as GET, handler as POST };
