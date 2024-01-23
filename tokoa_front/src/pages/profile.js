import styles from '../styles/profile.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import axios from 'axios'; 
import React, { useState, useEffect } from 'react';

// Profile コンポーネント
function Profile() {

    // ステート変数の定義
    const [userName, setUserName] = useState(''); // ユーザ名
    const [userPoints, setUserPoints] = useState(0); // ユーザのポイント

    // コンポーネントのマウント時にユーザ情報を取得
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios.get('http://localhost:8000/api/user-details/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUserName(response.data.name);
            setUserPoints(response.data.points);
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
    }, []);

    // JSXでのレンダリング
    return (

        // マイページのメインコンテナ
        <div className={styles.container_pro}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>ユーザープロフィール</title></Head>

            {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/"/>

            {/* メインコンテンツ */}
            <main className={styles.main}>

                {/* ユーザー情報のタイトル */}
                <header className={styles.title}><h2><b>マイページ</b></h2></header>
                
                {/* ユーザー名の表示 */}
                <section className={styles.userInfo}>
                    <p>ユーザ名: {userName}</p>
                </section>

                {/* ユーザーポイントの表示 */}
                <section className={styles.points}>
                    <div className={styles.pointValue}>{userPoints}pt</div>
                    <div className={styles.msk}></div>
                </section>

                {/* リンクボタン */}
                <section className={styles.buttons}>
                    <Link href="/setting" className={styles.btn}>設定</Link>
                    <Link href="/coupon" className={styles.btn}>クーポン一覧</Link>
                    <Link href="/logout" className={styles.btn}>ログアウト</Link>
                </section>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    )
}

export default Profile;