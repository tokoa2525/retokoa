import styles from '../styles/Home.module.css';
import Head from 'next/head';
import Header from '../components/Header_Home';
import Footer from '../components/Footer';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/auth'; // AuthContextからuseAuthをインポート
import { useRouter } from 'next/router'; // useRouterフックをインポート

// Home コンポーネント
export default function Home() {
  const { user } = useAuth(); // ユーザー情報をコンテキストから取得
  const router = useRouter(); // useRouterフックを使用

  // マイページへの遷移処理
  const handleMyPageClick = () => {
    if (user) {
      // ユーザーがログインしていればプロフィールページに遷移
      router.push('/profile');
    } else {
      // ログインしていなければログインページに遷移
      router.push('/login');
    }
  };

  // JSXでのレンダリング
  return (

    <div className={styles.container}>
      {/* ページのヘッド部分の設定 */}
      <Head>
        <title>Home</title>
      </Head>

      {/* ヘッダーコンポーネントの表示 */}
      <Header />

      {/* メインコンテンツ */}
      <div className={styles.main}>

        {/* キャッチフレーズ */}
        <div className={styles.catchphrase}>
          <b>Sort Score<br />~分別をしてポイントを貰おう~</b>
        </div>

        {/* アップロードページへのリンク */}
        <Link href="/upload" className={styles.oval}>アップロード</Link>

        {/* ショップとマイページへのリンク */}
        <div className={styles.circles}>

          {/* ショップへのリンク */}
          <Link href="/shop" className={styles.circle}>ショップ</Link>

          {/* マイページへのリンクまたはログインページへのリダイレクト */}
          <div className={styles.circle} onClick={handleMyPageClick}>マイページ</div>
        </div>
      </div>

      {/* フッターコンポーネント */}
      <Footer />
    </div>
  );
}