import '../styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../contexts/auth';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Bootstrap JavaScriptの動的インポート
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return (
        <>
            <Head>

            </Head>
            <AuthProvider> {/* AuthProviderでアプリケーション全体をラップ */}
                <Component {...pageProps} />
                <ToastContainer />
            </AuthProvider>
        </>
    );
}

export default MyApp;
