import styles from '../styles/login.module.css'; // ログインページと共通のスタイルシートを使用
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import React from 'react';

// Logoutpage コンポーネント
function Logoutpage() {
    return (

        // コンテナのスタイル適用（ログインページと共通）
        <div className={styles.container_login}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>ログアウト完了</title></Head>

            {/* ヘッダーコンポーネントの表示。ホームへのリンク付き */}
            <Header backLink="/"/>

            {/* メインコンテンツ */}
            <main>

                {/* ログアウト完了のタイトル */}
                <div className={styles.title_logout_fin}>
                    <h1><b>ログアウト完了</b></h1>
                </div>

                {/* ログアウト完了のメッセージ */}
                <h2 className={styles.logout}><b>ログアウトが完了しました</b></h2>

                {/* ホームページへのリンク */}
                <Link href="/" className={styles.log}>ホームに戻る</Link>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default Logoutpage;