import styles from '../../styles/manager.module.css'; // 管理者ページのスタイルシートを使用
import Head from 'next/head';
import Header from '../../components/Header'; // Headerコンポーネントをインポート
import Footer from '../../components/Footer'; // Footerコンポーネントをインポート
import axios from 'axios';
import React, { useState, useEffect } from 'react';

// 管理者用の評価ページコンポーネント
export default function Check() {

    const [photos, setPhotos] = useState([]); // 写真のリストを保持する状態
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // 現在表示している写真のインデックス

    // コンポーネントのマウント時に写真を取得
    useEffect(() => {
        fetchUnjudgedPhotos();
    }, []);

    // 未判定の写真を取得する関数
    const fetchUnjudgedPhotos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/unjudged-photos/', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            // 写真のリストを設定
            const fullPhotos = response.data.map(photo => {
                return {
                    ...photo,
                    image_url: `http://localhost:8000${photo.image}` // 完全なURLを設定
                };
            });
            setPhotos(fullPhotos);
        } catch (error) {
            console.error('Error fetching unjudged photos:', error);
        }
    };

    // 写真の判定処理
    const judgePhoto = async (judgement) => {
        try {
            const photo = photos[currentPhotoIndex];
            await axios.post(`http://localhost:8000/api/judge-photo/${photo.id}/`, { judgement }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            // 判定済みの写真をリストから除去
            const nextPhotos = photos.filter((_, index) => index !== currentPhotoIndex);
            setPhotos(nextPhotos);
            setCurrentPhotoIndex(0); // インデックスをリセット
        } catch (error) {
            console.error('Error judging photo:', error);
        }
    };

    // 現在の写真を取得
    const currentPhoto = photos[currentPhotoIndex];

    // JSXでのレンダリング
    return (

        // 評価ページのコンテナ
        <div className={styles.container}>

            {/* ページのヘッド部分の設定 */}
            <Head><title>評価ページ</title></Head>

            {/* 管理者ホームページへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/manager/menu"/>

            {/* 評価ページのタイトル */}
            <header className={styles.title}>
                <h1><b>評価ページ</b></h1>
            </header>

            {/* 現在の写真表示 */}
            {currentPhoto ? (
                <div>
                    <img src={currentPhoto.image_url} alt="Photo to judge" className={styles.image} />
                    <div className={styles.buttonGroup}>
                        {/* 判定ボタン */}
                        <button onClick={() => judgePhoto(true)} className={`${styles.on} ${styles.yes}`}>はい</button>
                        <button onClick={() => judgePhoto(false)} className={`${styles.on} ${styles.no}`}>いいえ</button>
                    </div>
                </div>
            ) : (
                <b><p>判定する写真はありません。</p></b>
            )}

            <Footer/>
        </div>
    );
}