import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SessionStrategy } from 'next-auth';
import { AuthOptions } from 'next-auth';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<"email" | "password", string>) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('El usuario no existe o la contraseña no está configurada.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error('Email o contraseña incorrectos.');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Email o contraseña incorrectos.');
        }

        // Si todo está bien, retorna el objeto de usuario
        return {
          id: user.id.toString(), // Convierte el ID a string
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  pages: {
    error: '/auth/login', // Redirige a la página de login en caso de error
  },

  // Asegúrate de que se maneje correctamente la redirección
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirigir a la página principal o cualquier otra página en caso de éxito
      if (url === '/auth/login') {
        return baseUrl;
      }
      return url;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
