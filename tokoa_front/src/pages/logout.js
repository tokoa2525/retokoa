import styles from '../styles/login.module.css'; // ログインページと共通のスタイルシートを使用
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../contexts/auth'; // AuthContextをインポート
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

// Logoutpage コンポーネント
function Logoutpage() {

    // AuthContextからlogout関数を取得
    const { logout } = useContext(AuthContext);
    const router = useRouter(); // useRouterフックを使用

    // ログアウト処理のハンドラー
    const handleLogout = () => {
        // ローカルストレージからアクセストークンを削除
        localStorage.removeItem('accessToken');

        // AuthContextのlogout関数を呼び出し（状態を更新）
        logout();

        // ログアウト完了ページにリダイレクト
        router.push('/logout_fin');
    };

    // JSXでのレンダリング
    return (

        // コンテナのスタイル適用（ログインページと共通）
        <div className={styles.container_login}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>ログアウト</title></Head>

            {/* マイページへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/profile"/>

            {/* メインコンテンツ */}
            <main>

                {/* ログアウトのタイトル */}
                <div className={styles.title_logout}>
                    <h1><b>ログアウト</b></h1>
                </div>

                {/* ログアウト確認メッセージ */}
                <h2 className={styles.logout}><b>ログアウトしますか？</b></h2>

                {/* ログアウト実行ボタン */}
                <button onClick={handleLogout} className={styles.log}>はい</button>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default Logoutpage;