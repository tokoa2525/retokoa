import styles from '../styles/info.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

// お知らせページコンポーネント
function InfoPage() {

    // ステート変数の定義
    const [notifications, setNotifications] = useState([]); // お知らせのリスト
    const [isLoading, setIsLoading] = useState(true); // ローディング状態
    const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
    const notificationsPerPage = 4; // 1ページあたりのお知らせ数

    // コンポーネントのマウント時にお知らせを取得
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/notifications/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    // ページネーションのためのデータ処理
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    // ページ番号を変更する関数
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // JSXでのレンダリング
    return (
        <div className={styles.Container_info}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>お知らせページ</title></Head>

            {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/"/>

            {/* メインコンテンツ */}
            <main>

                {/* お知らせタイトル */}
                <h1 className={styles.title}><b>お知らせ一覧</b></h1>

                {/* お知らせカードの表示 */}
                <div className={styles.cardContainer}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : currentNotifications.length > 0 ? (
                        currentNotifications.map((notification) => (
                            <div key={notification.id} className={styles.card}>
                                {notification.mascot_image && (
                                    <img src={notification.mascot_image} alt="Mascot" className={styles.Image} />
                                )}
                                <div className={styles.cardContent}>
                                    <h5>{notification.message}</h5>
                                    <p>判定日 : {new Date(notification.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.text}><b>ログインしてください。</b></div>
                    )}
                </div>

                {/* ページネーション */}
                <div className={styles.nation}>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">

                            {/* ページ番号の表示 */}
                            {[...Array(Math.ceil(notifications.length / notificationsPerPage)).keys()].map(number => (
                                <li key={number} className="page-item">
                                    <a onClick={() => paginate(number + 1)} className="page-link">
                                        {number + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default InfoPage;