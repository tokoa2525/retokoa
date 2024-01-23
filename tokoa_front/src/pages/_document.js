import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document  {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          
        </Head>
        
        <body>
          <Main /> {/* アプリケーションのメインコンテンツをレンダリング*/}
          <NextScript /> {/* Next.jsが必要とするJavaScriptをレンダリング*/}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
