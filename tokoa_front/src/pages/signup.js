import styles from '../styles/login.module.css'; // ログインページのスタイルシートを使用
import Head from 'next/head';
import Header from '../components/Header'; // Headerコンポーネントをインポート
import Footer from '../components/Footer'; // Footerコンポーネントをインポート
import RegisterForm from '../components/RegisterForm'; // RegisterFormコンポーネントをインポート

// SignupPageコンポーネント
function SignupPage() {

  return (

    // コンテナのスタイル適用（ログインページと共通）
    <div className={styles.container_login}>

      {/* ページタイトルの設定 */}
      <Head>
        <title>ログイン/新規登録</title>
      </Head>

      {/* ログインページへのリンク付きヘッダーコンポーネントの表示 */}
      <Header backLink="/login"/>

      {/* メインコンテンツ */}
      <main>

        {/* ページタイトル */}
        <div className={styles.title}>
          <h1><b>新規登録</b></h1>
        </div>

        {/* RegisterFormコンポーネントの挿入 */}
        <RegisterForm/>

        {/* CAPTCHAに関するコメント */}
        <div>
          {/* CAPTCHAに変更予定。確認の効率性を優先して後回しにする */}
          {/* CAPTCHAが追加されるまでの一時的なプレースホルダー */}
          {/* <input type="checkbox" id="nobot" />
          <label htmlFor="nobot">私はロボットではありません</label> */}
        </div>
      </main>

      {/* フッターコンポーネント */}
      <Footer/>
    </div>
  )
}

export default SignupPage; // コンポーネントをエクスポート