import styles from '../styles/coupon.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

// クーポンページコンポーネント
function CouponPage() {

    // ステート変数の定義
    const [coupons, setCoupons] = useState([]); // クーポンのリスト
    const [error, setError] = useState(''); // エラーメッセージ
    const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
    const itemsPerPage = 4; // 1ページあたりのアイテム数
    const router = useRouter();

    // コンポーネントがマウントされたときにクーポンを取得
    useEffect(() => {
        const fetchCoupons = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('ログインが必要です');
                return;
            }

            // クーポンの取得
            try {
                const response = await axios.get('http://localhost:8000/api/user-coupons/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCoupons(response.data.coupons);

            } catch (error) {
                console.error('クーポンの取得中にエラーが発生しました', error);
                setError('クーポンの取得に失敗しました');
            }
        };

        fetchCoupons();
    }, []);

    // クーポンクリックハンドラー
    const handleCouponClick = item_id => {
        console.log(`Item ID: ${item_id}`);
        if (item_id) {
            router.push(`/coupon-detail/${item_id}`);
        } else {
            console.error('Invalid item ID');
            setError('商品IDが不正です');
        }
    };

    // ページネーションのためのデータ処理
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCoupons = coupons.slice(indexOfFirstItem, indexOfLastItem);

    // ページ番号を変更する関数
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // JSXでのレンダリング
    return (

        // クーポンページのメインコンテナ
        <div className={styles.Container_coupon}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>クーポン一覧</title></Head>

            {/* マイページへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/profile"/>

            <main>
                <h1 className={styles.title}><b>クーポン一覧</b></h1>
                {error && <b><p className={styles.error}>{error}</p></b>}
                <div className={styles.cardContainer}>

                    {/* クーポンカードのレンダリング */}
                    {currentCoupons.map((coupon, index) => (
                        <div key={index} className={styles.card} onClick={() => handleCouponClick(coupon.item_id)}>
                            <img src={coupon.image_url} alt={coupon.item} className={styles.cardImage} />
                            <div className={styles.cardContent}>
                                <div className={styles.product}>{coupon.item}</div>
                                <p>{`使用ポイント: ${coupon.points_used}pt`}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ページネーション */}
                <div className={styles.nation}>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">

                            {/* ページネーションボタンの生成 */}
                            {[...Array(Math.ceil(coupons.length / itemsPerPage)).keys()].map(number => (
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
            <Footer />
        </div>
    );
}

export default CouponPage;