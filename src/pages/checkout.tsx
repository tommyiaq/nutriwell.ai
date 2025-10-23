import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LandingHeader from '../components/landing-Header';
import { getCheckoutSessionStatus, notifyServicePlanPurchased } from '../utils/stripe-api';

export default function Checkout() {
  const router = useRouter();
  const { success, session_id } = router.query;
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCheckout = async () => {
      console.log('URL params:', { success, session_id });
      
      if (success === 'true' && session_id && typeof session_id === 'string') {
        try {
          setIsProcessing(true);

          // Call Stripe status API to get subscription details
          const statusData = await getCheckoutSessionStatus(session_id);

          // Check if there was an error
          if ('error' in statusData) {
            setError(statusData.error);
            setIsProcessing(false);
            return;
          }

          console.log('Stripe status:', statusData);

          // Check if subscription is active and we have the necessary data
          if (statusData.status === 'active' && statusData.customer_id && statusData.plan_id) {
            // Notify backend about the purchase
            const notifyResponse = await notifyServicePlanPurchased(
              statusData.plan_id,
              statusData.customer_id
            );

            console.log('Backend notification response:', notifyResponse);

            if (notifyResponse.status === 'ok') {
              console.log('Setting success to true');
              setIsSuccess(true);
              setIsProcessing(false);
            } else {
              console.log('Backend notification failed');
              setError('Errore durante l\'attivazione del piano. Contatta il supporto.');
              setIsProcessing(false);
            }
          } else if (statusData.payment_status === 'paid') {
            // Payment succeeded but subscription might still be processing
            console.log('Payment paid, setting success');
            setIsSuccess(true);
            setIsProcessing(false);
          } else {
            console.log('Payment not completed', statusData);
            setError('Il pagamento non è stato completato correttamente.');
            setIsProcessing(false);
          }
        } catch (err) {
          console.error('Checkout processing error:', err);
          setError('Si è verificato un errore durante l\'elaborazione. Contatta il supporto.');
          setIsProcessing(false);
        }
      } else {
        console.log('Missing required params or success not true');
        setIsProcessing(false);
        if (success === 'false' || (success && success !== 'true')) {
          setError('Pagamento non completato o annullato.');
        }
        // If no params at all, just stay in loading state
      }
    };

    processCheckout();
  }, [success, session_id]);

  // Show loading while processing
  if (isProcessing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFF9F0' }}>
        <div style={{ textAlign: 'center', color: '#0A4435' }}>
          <p>Elaborazione pagamento...</p>
        </div>
      </div>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#EFF9F0' }}>
        <LandingHeader logoOnly={true} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '500px', textAlign: 'center', background: 'white', borderRadius: '16px', padding: '3rem 2rem', boxShadow: '0 4px 20px rgba(10, 68, 53, 0.1)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: '#dc2626', 
                margin: '0 auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: 'white'
              }}>
                ✕
              </div>
            </div>
            <h1 style={{ color: '#0A4435', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 600 }}>
              Errore
            </h1>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
              {error}
            </p>
            <Link 
              href="/" 
              style={{ 
                display: 'inline-block',
                background: '#0A4435', 
                color: 'white', 
                padding: '1rem 2rem', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: 600, 
                fontSize: '1.1rem'
              }}
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show success if payment completed
  if (!isSuccess) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EFF9F0' }}>
      {/* Use the same simplified header as chat.tsx */}
      <LandingHeader logoOnly={true} />

      {/* Success Message */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '500px', textAlign: 'center', background: 'white', borderRadius: '16px', padding: '3rem 2rem', boxShadow: '0 4px 20px rgba(10, 68, 53, 0.1)' }}>
          {/* Success Icon */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: '#2D6A4F', 
              margin: '0 auto', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              ✓
            </div>
          </div>

          {/* Success Message */}
          <h1 style={{ color: '#0A4435', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 600 }}>
            Pagamento Completato!
          </h1>
          
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Grazie per aver scelto NutriWell AI. Il tuo abbonamento è stato attivato con successo.
          </p>

          <p style={{ color: '#2D6A4F', marginBottom: '2.5rem', fontSize: '1rem', fontWeight: 500 }}>
            Ora puoi iniziare a chattare con il tuo assistente nutrizionale personalizzato!
          </p>

          {/* Chat Button */}
          <Link 
            href="/chat" 
            style={{ 
              display: 'inline-block',
              background: '#0A4435', 
              color: 'white', 
              padding: '1rem 2rem', 
              borderRadius: '12px', 
              textDecoration: 'none', 
              fontWeight: 600, 
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(10, 68, 53, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#2D6A4F';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#0A4435';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Inizia a Chattare →
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const locale = context.locale || 'en';
  return {
    props: {
      locale,
    },
  };
}
