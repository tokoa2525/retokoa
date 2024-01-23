import styles from '../styles/shop.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

// exchangePage コンポーネント
function exchangePage() {
    return (

        // コンテナのスタイル適用
        <div className={styles.container_shop}>

            {/* ページのヘッド部分の設定 */}
            <Head>
                <title>exchangePage</title>
            </Head>

            {/* ショップへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/shop"/>

            {/* メインコンテンツ */}
            <main className={styles.main}>

                {/* タイトル表示 */}
                <header className={styles.title_ex}>
                    <h1><b>交換完了</b></h1>
                </header>

                {/* コメント */}
                <p className={styles.setumei}>ありがとうございました！</p>
                <div className={styles.msk}></div>

                {/* アクションボタン */}
                <div className={styles.actionButtons}>
                    <Link href="/coupon" className={styles.button}>クーポン一覧</Link>
                    <Link href="/shop" className={styles.button}>交換を続ける</Link>
                </div>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default exchangePage;