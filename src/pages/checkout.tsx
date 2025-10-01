import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LandingHeader from '../components/landing-Header';

export default function Checkout() {
  const router = useRouter();
  const { success, session_id } = router.query;
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (success === 'true' && session_id) {
      setIsSuccess(true);
    }
  }, [success, session_id]);

  if (!isSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFF9F0' }}>
        <div style={{ textAlign: 'center', color: '#0A4435' }}>
          <p>Caricamento...</p>
        </div>
      </div>
    );
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
