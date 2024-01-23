import styles from '../styles/upload.module.css'; // アップロードページのスタイルシートを使用
import Head from 'next/head';
import Header from '../components/Header'; // Headerコンポーネントをインポート
import Footer from '../components/Footer'; // Footerコンポーネントをインポート
import Link from 'next/link';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // 通知ライブラリのインポート
import 'react-toastify/dist/ReactToastify.css'; // 通知のスタイルシート

// UploadPageコンポーネント
function UploadPage() {

    // ステート変数の初期化
    const [selectedFile, setSelectedFile] = useState(null); // 選択された画像ファイル
    const [selectedImagePreview, setSelectedImagePreview] = useState(null); // プレビュー画像のURL
    const [category, setCategory] = useState('ペットボトル'); // 分別カテゴリ
    const [error, setError] = useState(''); // エラーメッセージ

    // トースト通知機能
    const notify = () => {
        toast('アップロードされました！');
    };

    // 画像選択時のハンドラー
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // アップロード処理のハンドラー
    const handleUpload = async () => {
        if (!selectedFile) {
            setError('※画像が選択されていません');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('category', category);

        try {
            const accessToken = localStorage.getItem('accessToken'); // トークンを取得
            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            notify(); // 通知

        } catch (error) {
            console.error('アップロード中にエラーが発生しました:', error);
            setError('※ログインしてください');
        }
    };

    // JSXでのレンダリング
    return (

        // アップロードページのコンテナ
        <div className={styles.container_upload}>

            {/* ページのヘッド部分の設定 */}
            <Head>
                <title>Upload Page</title>
            </Head>

            {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
            <Header backLink="/"/>

            {/* メインコンテンツ */}
            <main>

                {/* アップロードのタイトル */}
                <header className={styles.title}>
                    <h1><b>アップロード</b></h1>
                </header>

                {/* 説明文 */}
                <p className={styles.setumei}><b>こちらはアップロードページです。<br />分別した画像を選択してください。</b></p>

                {/* 選択された画像のプレビュー */}
                {selectedImagePreview && <img src={selectedImagePreview} alt="選択された写真" className={styles.previewImage} />}

                {/* 画像選択入力 */}
                <div className={styles.inputGroup}>
                    <label>
                        <input type="file" onChange={handleImageChange} />
                    </label>
                </div>

                {/* カテゴリ選択 */}
                <div className={styles.message}>分別したごみの種類を選択してください。</div>
                <select className={styles.dropdown} value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="ペットボトル">ペットボトル</option>
                    <option value="紙類">紙類</option>
                    <option value="缶・ビン">缶・ビン</option>
                </select>

                {/* エラーメッセージ */}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                {/* 説明文 */}
                <div className={styles.gaid}><b>※ポイント付与にお時間を頂戴致します。</b></div>

                {/* アップロードボタン */}
                <button className={styles.aprbtn} onClick={handleUpload}>アップロード</button>
            </main>

            {/* フッターコンポーネント */}
            <Footer />
        </div>
    );
}

export default UploadPage;