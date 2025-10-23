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
import en from '../../messages/en.json';
import it from '../../messages/it.json';

// importa QUI tutti i CSS globali
import '../styles/tokens.css';
import '../styles/landing.css';

const messages: Record<string, any> = { en, it };

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Get the correct locale, defaulting to 'en'
  const locale = router.locale || 'en';
  const currentMessages = messages[locale] || messages['en'];

  return (
    <NextIntlClientProvider locale={locale} messages={currentMessages}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </NextIntlClientProvider>
  );
}