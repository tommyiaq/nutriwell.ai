import '../styles/globals.css';
// Shared component styles
import '@/styles/components/header.css'
import '@/styles/components/footer.css'
import '@/styles/components/buttons.css'
// Page-specific styles
import '@/styles/pages/index.css'
import '@/styles/pages/chat.css'
import '@/styles/pages/auth.css'
import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { UserProvider } from '../contexts/UserContext';
import { useEffect, useState } from 'react';

// importa QUI tutti i CSS globali
import '../styles/tokens.css';
import '../styles/landing.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load messages based on locale only after router is ready
    if (!router.isReady) return;

    let loadedMessages;
    try {
      loadedMessages = require(`../../messages/${router.locale || 'en'}.json`);
    } catch (error) {
      loadedMessages = require(`../../messages/en.json`);
    }
    
    setMessages(loadedMessages);
    setIsReady(true);
  }, [router.isReady, router.locale]);

  // Show nothing while loading to avoid hydration mismatch
  if (!isReady || !messages) {
    return null;
  }

  return (
    <NextIntlClientProvider locale={router.locale || 'en'} messages={messages}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </NextIntlClientProvider>
  );
}
