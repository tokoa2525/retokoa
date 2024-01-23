import styles from '../styles/login.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';
import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';

// Loginpage コンポーネント
function Loginpage() {

    // ステート変数の定義
    const [name, setName] = useState(''); // ユーザ名
    const [password, setPassword] = useState(''); // パスワード
    const { login } = useContext(AuthContext); // AuthContextからlogin関数を取得
    const [error, setError] = useState(''); // エラーメッセージ用の状態
    const router = useRouter(); // useRouterフックを使用

    // ログイン処理のハンドラー
    const handleLogin = async (event) => {
        event.preventDefault(); // デフォルトのフォーム送信を防止

        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                name,
                password,
            });

            const accessToken = response.data.access; // アクセストークン
            const isAdmin = response.data.isAdmin; // 管理者フラグ
            localStorage.setItem('accessToken', accessToken); // ローカルストレージに保存
            localStorage.setItem('isAdmin', isAdmin);
            login({ accessToken, isAdmin }); // AuthContextのlogin関数を呼び出し

            // リダイレクト処理
            if (isAdmin) {
                router.push('/manager/menu'); // 管理者の場合、管理者画面へ
            } else {
                router.push('/profile'); // 一般ユーザーの場合、プロフィールページへ
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error);
            setError('ユーザー名またはパスワードが間違っています。'); // エラーメッセージを設定
        }
    };

    // JSXでのレンダリング
    return (
        <div className={styles.container_login}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>ログイン/新規登録</title></Head>

            {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/"/>

            {/* メインコンテンツ */}
            <main>

                {/* ログインタイトル */}
                <div className={styles.title}>
                    <h1><b>ログイン</b></h1>
                </div>

                {/* ログインフォーム */}
                <form onSubmit={handleLogin}>
                    <div className={styles.label}>
                        <label>
                            ユーザ名:<br />
                            <input 
                                type="text" 
                                placeholder="ユーザ名" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <div className={styles.label}>
                        <label>
                            パスワード:<br />
                            <input 
                                type="password" 
                                placeholder="パスワード" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    {/* エラーメッセージの表示 */}
                    {error && <b><p className={styles.error}>{error}</p></b>}

                    {/* ログインボタン */}
                    <button type="submit" className={styles.log}>ログインする</button>
                </form>

                {/* 新規登録へのリンク */}
                <h6 className={styles.hiyoko}>🔰はじめての方はこちらから🔰</h6>
                <Link href="/signup" className={styles.new}>新規登録する</Link>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default Loginpage;