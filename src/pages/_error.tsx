import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const getErrorMessage = (code: number) => {
    switch (code) {
      case 404:
        return 'Pagina non trovata';
      case 500:
        return 'Errore del server';
      default:
        return 'Si è verificato un errore';
    }
  };

  return (
    <>
      <Head>
        <title>{statusCode} - NutriWell</title>
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>
          {statusCode || 'Error'}
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
          {getErrorMessage(statusCode)}
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#6366f1',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '16px'
        }}>
          Torna alla home
        </Link>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode: statusCode || 500 };
};

export default Error;
