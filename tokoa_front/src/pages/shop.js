import styles from '../styles/shop.module.css'; // スタイルシートのインポート
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import axios from 'axios'; // axiosをインポート
import React, { useState, useEffect } from 'react';

// Shoppage コンポーネント
function Shoppage() {

  // ステート変数の定義
  const [items, setItems] = useState([]); // 商品のリスト
  const [search, setSearch] = useState(''); // 検索用の文字列
  const [filteredItems, setFilteredItems] = useState([]); // 検索結果のリスト
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
  const itemsPerPage = 4; // 1ページあたりの商品数

  // 商品データの取得
  useEffect(() => {
    axios.get('http://localhost:8000/api/items/')
      .then(response => {
        const updatedItems = response.data.map(item => ({
          ...item,
          image_url: `${item.image_url}`
        }));
        setItems(updatedItems);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // 検索処理
  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  // ページネーションのためのデータ処理
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // ページ番号を変更する関数
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // JSXでのレンダリング
  return (

    // ショップページのメインコンテナ
    <div className={styles.container_shop}>

      {/* ページのヘッド部分の設定 */}
      <Head><title>ショップ</title></Head>

      {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
      <Header backLink="/"/>

      {/* メインコンテンツ */}
      <main>
        <div className={styles.title}><h1><b>ショップ</b></h1></div>

        {/* 検索バー */}
        <div className={styles.search}>
          <input
            type="text"
            placeholder="商品を検索"
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* 商品リスト */}
        <div className={styles.product_grid}>
          {currentItems.map(item => (
            <div key={item.id} className={styles.productdetail}>
              <Link href={`/product_details/${item.id}`} passHref>
                <div className={styles.product}>
                  <img src={`${item.image_url}`} alt={item.name} className={styles.image} />
                </div>
              </Link>
              <div className={styles.name}>{item.name}<br/>必要ポイント:{item.points_required}pt</div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        <div className={styles.nation}>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {[...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys()].map(number => (
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
  
export default Shoppage;