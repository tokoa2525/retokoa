import styles from '../../../styles/manager.module.css'; // 管理者ページのスタイルシートを使用
import Head from 'next/head';
import Header from '../../../components/Header'; // Headerコンポーネントをインポート
import Footer from '../../../components/Footer'; // Footerコンポーネントをインポート
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

// 地域統計ページコンポーネント
export default function RegionStatistics() {

  const router = useRouter();
  const { region } = router.query; // ルーターから地域を取得
  const [statistics, setStatistics] = useState(null); // 地域統計データを保持する状態
  const [isLoading, setIsLoading] = useState(true); // データ読み込み中かどうかを示す状態

  // 地域統計データを取得するためのやつ
  useEffect(() => {
    if (region) {
      const fetchStatistics = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/api/region-statistics/${region}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          });
          setStatistics(response.data);
        } catch (error) {
          console.error('Error fetching region statistics:', error);
          setStatistics(null);
        }
        setIsLoading(false);
      };
      fetchStatistics();
    }
  }, [region]);

  // 統計データの計算
  const totalUploads = statistics?.total_uploads || 0;
  const successfulSorts = statistics?.successful_sorts || 0;
  const sortingSuccessRate = totalUploads > 0 ? (successfulSorts / totalUploads) * 100 : 0;
  const totalAgeGroupCounts = Object.values(statistics?.user_age_group_counts || {}).reduce((sum, count) => sum + count, 0);

  // JSXでのレンダリング
  return (

    // 地域統計ページのコンテナ
    <div className={styles.container}>

      {/* ページのヘッド部分の設定 */}
      <Head><title>{region}の情報</title></Head>

      {/* 管理者ホームページへのリンク付きヘッダーコンポーネントの表示 */}
      <Header backLink="/manager/menu" />

      {/* 地域統計のタイトル */}
      <header className={styles.title}>
        <h1><b>{region}の情報</b></h1>
      </header>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* 年齢層別アップロード数 */}
          <div className={styles.ageGroup}>
            <h3>年齢別アップロード数</h3>
            {Object.entries(statistics?.user_age_group_counts || {}).map(([ageGroup, count]) => (
              <div key={ageGroup}>
                {ageGroup}: {count}人
                {/* プログレスバー */}
                <div className="progress">
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: `${(count / totalAgeGroupCounts) * 100}%` }} aria-valuenow={count} aria-valuemin="0" aria-valuemax={totalAgeGroupCounts}></div>
                </div>
              </div>
            ))}
          </div>

          {/* 分別成功率 */}
          <div className={styles.progress_success}>
            <h3>分別成功率</h3>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{ width: `${sortingSuccessRate}%` }} aria-valuenow={successfulSorts} aria-valuemin="0" aria-valuemax={totalUploads}>{sortingSuccessRate.toFixed(2)}%</div>
            </div>
          </div>

          {/* 総アップロード数 */}
          <div className={styles.count}>
            <h3>総アップロード数：{totalUploads}個</h3>
          </div>
        </div>
      )}

      {/* 管理者メニューへ戻るボタン */}
      <Link href="/manager/menu" className={styles.button}>管理者メニューへ戻る</Link>
      <Footer />
    </div>
  );
}