'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect, useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>{children}</div>;
  }

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}