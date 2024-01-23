import styles from '../styles/contact.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import React from 'react';

// Logoutpage コンポーネント定義
function Logoutpage() {
  return (
    <div className={styles.container_contact}>
        {/* ページのヘッド部分を設定 */}
        <Head>
          <title>お問い合わせ完了</title>
        </Head>

        {/* バックリンク付きヘッダーコンポーネント */}
        <Header backLink="/"/>

        {/* メインコンテンツ */}
        <main>
            {/* タイトル表示部分 */}
            <div className={styles.title_contact_fin}>
              <h1><b>送信完了</b></h1>
            </div>

            {/* 送信完了メッセージ */}
            <h2 className={styles.fin}><b>送信が完了しました</b></h2>

            {/* ホームに戻るボタン */}
            <Link href="/" className={styles.btn}>ホームに戻る</Link>
        </main>

        {/* フッターコンポーネント */}
        <Footer />
    </div>
  )
}

export default Logoutpage;