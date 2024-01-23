import styles from '../styles/setting.module.css'; // スタイルシートのインポート
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // 通知ライブラリのインポート
import 'react-toastify/dist/ReactToastify.css'; // 通知のスタイルシート

// 設定ページコンポーネント
function Setting() {

  // ステート変数の初期化
  const [age, setAge] = useState(''); // 年代の状態
  const [region, setRegion] = useState(''); // 地域の状態

  // 通知機能
  const notify = (message, isError = false) => {
    if (isError) {
      toast.error(message); // エラー通知
    } else {
      toast(message); // 通常の通知
    }
  };

  // 登録ボタンのクリックハンドラー
  const handleSubmit = async () => {
    // 年代と地域が選択されていない場合はエラー通知
    if (!age || !region) {
      notify('年代と地域を選択してください', true);
      return;
    }

    // トークン取得とAPIリクエストの送信
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('http://localhost:8000/api/update_profile/', { age_group: age, region }, {
        headers: {
          Authorization: `Bearer ${token}` // 認証ヘッダー
        }
      });

      notify('更新されました！'); // 成功通知
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
      notify('更新に失敗しました。', true); // 失敗通知
    }
  };

  // JSXでのレンダリング
  return (

    // 設定ページのメインコンテナ
    <div className={styles.container_setting}>

      {/* ページのヘッド部分 */}
      <Head>
        <title>設定</title>
      </Head>

      {/* マイページへのリンク付きヘッダーコンポーネントの表示 */}
      <Header backLink="/profile"/>

      {/* メインコンテンツ */}
      <main className={styles.main}>

        {/* タイトル */}
        <div className={styles.title}>
          <h1><b>設定</b></h1>
        </div>

        {/* 年代選択 */}
        <div className={styles.age}>
          <label>
            年齢
            <div className={styles.option}>
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                {/* 年代のオプション */}
                <option value="">年代を選択</option>
                <option value="10代">10代</option>
                <option value="20代">20代</option>
                <option value="30代">30代</option>
                <option value="40代">40代</option>
                <option value="50代">50代</option>
                <option value="60代以上">60代以上</option>
              </select>
            </div>
          </label>
        </div>

        {/* 地域選択 */}
        <div className={styles.region}>
          <label>
            お住まいの地域
            <div className={styles.option}>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                {/* 地域のオプション */}
                <option value="">地域を選択</option>
                <option value="和歌山市">和歌山市</option>
                <option value="海南市">海南市</option>
                <option value="橋本市">橋本市</option>
                <option value="有田市">有田市</option>
                <option value="御坊市">御坊市</option>
                <option value="田辺市">田辺市</option>
                <option value="新宮市">新宮市</option>
                <option value="紀の川市">紀の川市</option>
                <option value="岩出市">岩出市</option>
              </select>
            </div>
          </label>
        </div>

        {/* 登録ボタン */}
        <button className={styles.toroku} onClick={handleSubmit}>登録</button>
      </main>

      {/* フッターコンポーネント */}
      <Footer />
    </div>
  );
}

export default Setting;