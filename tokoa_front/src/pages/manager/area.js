import styles from '../../styles/manager.module.css'; // 管理者ページのスタイルシートを使用
import Head from 'next/head';
import Header from '../../components/Header'; // Headerコンポーネントをインポート
import Footer from '../../components/Footer'; // Footerコンポーネントをインポート
import Link from 'next/link';

// 地域選択ページコンポーネント
export default function Area() {
  // 表示する地域のリスト
  const regions = ['和歌山市', '海南市', '橋本市', '有田市', '御坊市', '田辺市', '新宮市', '紀の川市', '岩出市'];

  // JSXでのレンダリング
  return (

    // 地域選択ページのコンテナ
    <div className={styles.container}>

      {/* ページのヘッド部分の設定 */}
      <Head><title>地域選択ページ</title></Head>

      {/* 管理者ホームページへのリンク付きヘッダーコンポーネントの表示 */}
      <Header backLink="/manager/menu"/>

      {/* 地域選択のタイトル */}
      <header className={styles.title_area}>
        <h3><b>地域を選択してください</b></h3>
      </header>

      {/* 地域選択ボタン */}
      <div className={styles.areabtn}>
        {regions.map(region => (
          <Link key={region} href={`/manager/area_info/${encodeURIComponent(region)}`} className={styles.city}>
            {region}
          </Link>
        ))}
      </div>

      {/* フッターコンポーネント */}
      <Footer/>
    </div>
  );
}