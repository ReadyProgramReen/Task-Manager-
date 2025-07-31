// client/src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Or use '/dashboard' if user is logged in
  }, [router]);

  return null;
};

export default Home;
