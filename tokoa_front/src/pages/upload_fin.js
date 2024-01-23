import styles from '../styles/upload.module.css'; // アップロードページのスタイルシートを使用
import Head from 'next/head';
import Header from '../components/Header'; // Headerコンポーネントをインポート
import Footer from '../components/Footer'; // Footerコンポーネントをインポート
import Link from 'next/link';
import React, { useState } from 'react';

// UploadfinPageコンポーネント
function UploadfinPage() {
    return (

        // コンテナのスタイル適用（アップロードページと共通）
        <div className={styles.container_upload}>

            {/* ページのヘッド部分の設定 */}
            <Head>
                <title>Upload_fin Page</title>
            </Head>

            {/* アップロードページへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/upload"/>

            {/* メインコンテンツ */}
            <main className={styles.main}>

                {/* アップロード完了のタイトル */}
                <header className={styles.title_fin}>
                    <h1><b>アップロード完了</b></h1>
                </header>

                {/* 説明文 */}
                <p className={styles.setumei}>ポイントは～日以内に付与されます。</p>

                {/* アクションボタン */}
                <div className={styles.actionButtons}>
                    <Link href="/upload" className={styles.button}>もう一度アップロードする</Link>
                    <Link href="/profile" className={styles.button}>マイページ</Link>
                    <Link href="/" className={styles.button}>ホームに戻る</Link>             
                </div>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default UploadfinPage; // コンポーネントをエクスポート