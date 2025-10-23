import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import backgroundImg from '@/assets/BackgroundRegister.png';

export const Home = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null; // ou algo neutro enquanto redireciona
  }

  return (
    <Stack
      width="100%"
      height="100vh"
      padding={'1.5rem'}
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div>
        <h1>Bem-vindo, {user?.email}</h1>
        {/* Conteúdo da home */}
        Home
      </div>
    </Stack>
  );
};
