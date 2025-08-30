import '../styles/globals.css';
// Shared component styles
import '@/styles/components/header.css'
import '@/styles/components/footer.css'
import '@/styles/components/buttons.css'
// Page-specific styles
import '@/styles/pages/index.css'
import '@/styles/pages/pricing.css'
import '@/styles/pages/chat.css'
import '@/styles/pages/auth.css'
import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Load messages based on locale
  let messages;
  try {
    messages = require(`../../messages/${router.locale || 'en'}.json`);
  } catch (error) {
    messages = require(`../../messages/en.json`);
  }

  return (
    <NextIntlClientProvider locale={router.locale || 'en'} messages={messages}>
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}
