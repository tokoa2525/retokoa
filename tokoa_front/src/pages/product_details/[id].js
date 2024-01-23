import styles from '../../styles/shop.module.css';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

// 商品詳細ページコンポーネント
function DetailsPage({ item: initialItem }) {

  const [item, setItem] = useState(initialItem); // 商品情報の状態
  const [userPoints, setUserPoints] = useState(0); // ユーザーのポイント数
  const [error, setError] = useState(''); // エラーメッセージ
  const router = useRouter();

  // ユーザーの所持ポイントを取得するためのやつ
  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios.get(`http://localhost:8000/api/user-points/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserPoints(response.data.points); // ポイント数を設定
        } catch (err) {
          console.error('ポイントの取得中にエラーが発生しました', err);
        }
      }
    };

    fetchUserPoints();
  }, []);

  // 商品交換処理のハンドラー
  const handleExchange = async () => {
    if (userPoints < item.points_required) {
      setError('ポイントが不足しています。');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/exchange-coupon/`, {
        item_id: item.id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setUserPoints(currentPoints => currentPoints - item.points_required);
        router.push('/exchange');
      } else {
        setError(response.data.error || '交換に失敗しました。');
      }
    } catch (err) {
      console.error('在庫がありません。', err);
      setError('在庫がありません。');
    }
  };

  // JSXでのレンダリング部分
  return (
    // 商品詳細ページのコンテナ
    <div className={styles.container_shop}>

      {/* ページのタイトルを設定 */}
      <Head><title>{item.name}</title></Head>

      {/* ヘッダーコンポーネントを表示し、ショップページへの戻るリンクを渡す */}
      <Header backLink="/shop"/>

      {/* メインコンテンツ */}
      <main>

        {/* 商品名の表示 */}
        <div className={styles.title_detail}><h1><b>{item.name}</b></h1></div>

        {/* 商品情報カード */}
        <div className={styles.card}>

          {/* 商品画像 */}
          <img src={item.image_url} alt={item.name} className={styles.imagePlaceholder} />

          {/* 商品詳細情報 */}
          <div className={styles.details}>

            {/* ユーザーの所持ポイント数 */}
            <h5>所持ポイント数：{userPoints}pt</h5>

            {/* 商品交換に必要なポイント数 */}
            <h5>必要ポイント数：{item.points_required}pt</h5>

            {/* 商品説明 */}
            <div className={styles.cardin}>
              <h5>{item.description}</h5>
            </div>

            {/* 商品交換ボタン */}
            <button onClick={handleExchange} className={styles.use}>交換する</button>

            {/* エラーメッセージの表示 */}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </main>

      {/* フッターコンポーネント */}
      <Footer />
    </div>
  );
};

// サーバーサイドでの商品情報の取得
export async function getServerSideProps(context) {
  const { id } = context.params;
  const response = await axios.get(`http://localhost:8000/api/items/${id}`);
  const item = response.data;

  return {
    props: { item } // 商品情報をページコンポーネントに渡す
  };
}

export default DetailsPage;