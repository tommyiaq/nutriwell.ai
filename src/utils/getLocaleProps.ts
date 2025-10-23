import { GetStaticProps, GetServerSideProps } from 'next';

/**
 * Utility function to add locale to pageProps for _app.tsx
 * Use this with getStaticProps or getServerSideProps
 */
export function addLocaleToProps(locale: string) {
  return {
    props: {
      locale,
    },
  };
}

/**
 * Create a getStaticProps wrapper that includes locale
 * Usage: export const getStaticProps = createGetStaticProps()
 */
export function createGetStaticProps(
  customProps?: Record<string, any> | null
): GetStaticProps {
  return async (context) => {
    const locale = context.locale || 'en';
    return {
      props: {
        locale,
        ...customProps,
      },
      revalidate: 3600, // Revalidate every hour
    };
  };
}

/**
 * Create a getServerSideProps wrapper that includes locale
 * Usage: export const getServerSideProps = createGetServerSideProps()
 */
export function createGetServerSideProps(
  customProps?: Record<string, any> | null
): GetServerSideProps {
  return async (context) => {
    const locale = context.locale || 'en';
    return {
      props: {
        locale,
        ...customProps,
      },
    };
  };
}
