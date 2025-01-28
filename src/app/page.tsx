'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // TODO --->  Comprobar si hay token para redigir a dashboard/login/register.

  useEffect(() => {
    // Redirigir automáticamente a la página de registro
    router.push('/auth/register');
  }, [router]);

  return null; // No se muestra nada mientras se redirige
}
