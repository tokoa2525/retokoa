import styles from '../../styles/manager.module.css'; // 管理者ページのスタイルシートを使用
import Head from 'next/head';
import Header from '../../components/Header'; // Headerコンポーネントをインポート
import Footer from '../../components/Footer'; // Footerコンポーネントをインポート
import Link from 'next/link';

// 管理者用ホームページコンポーネント
export default function Home() {
  return (

    // 管理者ページのコンテナ
    <div className={styles.container}>

      {/* ページのヘッド部分の設定 */}
      <Head><title>管理者ページ</title></Head>

      {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
      <Header backLink="/"/>

      {/* メインコンテンツ 管理者ページのタイトル*/}
      <header className={styles.title}>
        <h1><b>管理者メニュー</b></h1>
      </header>

      {/* 管理者メニューのリンク */}
      <Link href="/manager/check" className={styles.button}>分別判定</Link>
      <Link href="/manager/area" className={styles.button}>地域別情報</Link>

      {/* フッターコンポーネント */}
      <Footer/>
    </div>
  );
}