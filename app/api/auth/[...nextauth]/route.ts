import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export const authOptions = {
    providers: [
        CredentialProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email })
                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password)
                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id
            }
            return session;
        },
    },
    pages : {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',

    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }