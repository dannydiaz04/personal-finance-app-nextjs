import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log('Authorize function called with credentials:', credentials ? 'Credentials provided' : 'No credentials');
        
        if (!credentials) {
          console.error('No credentials provided');
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        if (!email || !password) {
          console.error('Missing email or password');
          throw new Error("Email and password are required");
        }

        try {
          await dbConnect();
          console.log('Connected to database');

          const user = await User.findOne({ email }).select('+password');
          console.log('User found:', user ? 'Yes' : 'No');

          if (!user) {
            console.error('No user found with this email');
            throw new Error("No user found with this email");
          }

          console.log('User password from DB:', user.password ? 'Password exists' : 'No password');
          console.log('Provided password:', password ? 'Password provided' : 'No password');

          if (!user.password) {
            console.error('User has no password set');
            throw new Error("Invalid user data");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.error('Invalid password');
            throw new Error("Invalid password");
          }

          console.log('Authorization successful');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
          };
        } catch (error) {
          console.error('Error in authorize function:', error);
          throw error;
        }
      }
    })
  ],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.first_name = user.first_name;
				token.last_name = user.last_name;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user) {
				session.user.first_name = token.first_name as string;
				session.user.last_name = token.last_name as string;
			}
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	session: {
		strategy: 'jwt',
	},
	debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };