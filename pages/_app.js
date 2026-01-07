import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>ROI Calculator | Valid Agenda</title>
                <meta name="description" content="Calculate your automation potential and capital recovery." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/assets/va-logo-circle.png" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
