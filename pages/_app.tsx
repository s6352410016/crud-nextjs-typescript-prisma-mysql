import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}