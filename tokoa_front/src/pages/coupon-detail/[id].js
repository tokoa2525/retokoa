import styles from '../../styles/coupon.module.css';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

// クーポン詳細ページコンポーネント
const CouponDetailPage = () => {
    const [coupon, setCoupon] = useState(null); // クーポン情報の状態
    const [error, setError] = useState(''); // エラーメッセージの状態
    const router = useRouter();
    const { id } = router.query; // URLからクーポンIDを取得

    // クーポン情報を取得するための副作用
    useEffect(() => {
        if (!id) return; // IDがない場合は処理をしない
        const fetchCouponDetail = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/items/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCoupon(response.data); // クーポン情報をセット
            } catch (error) {
                console.error('Error fetching coupon details:', error);
                setError('Failed to fetch coupon details');
            }
        };
        fetchCouponDetail();
    }, [id]);

    // クーポンコードをクリップボードにコピーする関数
    const handleCopyToClipboard = async () => {
        if (coupon?.coupon_code) {
            try {
                await navigator.clipboard.writeText(coupon.coupon_code);
                console.log('Coupon code copied to clipboard!');
            } catch (err) {
                console.error('Unable to copy coupon code to clipboard', err);
            }
        }
    };

    // JSXでのレンダリング部分
    return (
        // クーポン詳細ページのコンテナ
        <div className={styles.Container_coupon}>

            {/* ページのヘッド情報設定 */}
            <Head><title>クーポン詳細</title></Head>

            {/* クーポン一覧ページへのリンク付きヘッダーコンポーネントを表示 */}
            <Header backLink="/coupon" />

            {/* メインコンテンツ */}
            <main>

                {/* クーポン詳細のタイトル表示 */}
                <h1 className={styles.title}><b>クーポン詳細</b></h1>

                {/* クーポン情報の表示 */}
                {coupon ? (
                    <div className={styles.coupon}>
                        {/* クーポン名 */}
                        <p className={styles.p}>{coupon.name}</p>

                        {/* クーポン画像 */}
                        {coupon.image_url && (
                            <img src={coupon.image_url} alt={coupon.name} className={styles.image} />
                        )}

                        {/* クーポンコード表示 */}
                        <div className={styles.text}>クーポンコード</div>
                        <div className={styles.cord}>
                            <div className={styles.waku}>
                                <div className={styles.moji}>{coupon.coupon_code}</div>
                            </div>

                            {/* クーポンコードをクリップボードにコピーするボタン */}
                            <button className={styles.copyButton} onClick={handleCopyToClipboard}>Copy</button>
                        </div>

                        {/* クーポンの説明 */}
                        <div className={styles.comment}>{coupon.description}</div>

                        {/* クーポン関連の製品URL */}
                        {coupon.product_url && (
                            <Link href={coupon.product_url} target="_blank" rel="noopener noreferrer">
                                <div className={styles.url}>ご購入はこちらから</div>
                            </Link>
                        )}
                    </div>
                ) : (
                    // エラーメッセージまたは読み込み中のメッセージ
                    <p>{error || '読み込み中...'}</p>
                )}

                {/* クーポン一覧、ホームへ戻るボタン */}
                <div className={styles.buttonGroup}>
                    <Link href='/coupon'><div className={styles.btn}>一覧へ戻る</div></Link>
                    <Link href='/'><div className={styles.btn}>ホームへ戻る</div></Link>
                </div>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
};

export default CouponDetailPage;