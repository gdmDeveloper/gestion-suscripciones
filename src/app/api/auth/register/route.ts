import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, username } = await req.json();

  if (!email || !password || !username) {
    return new Response(
      JSON.stringify({ message: 'Email, password y username son requeridos' }),
      { status: 400 }
    );
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'El usuario ya existe' }),
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username
         // Asegúrate de que el campo 'username' esté en el modelo de Prisma
      },
    });

    // Retornar una respuesta exitosa
    return new Response(
      JSON.stringify({ message: 'Usuario registrado exitosamente', user }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return new Response(
      JSON.stringify({ message: 'Error al registrar el usuario' }),
      { status: 500 }
    );
  }
}
