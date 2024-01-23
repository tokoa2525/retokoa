import styles from '../styles/login.module.css'; // ログインページのスタイルシートを使用
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'; // 通知ライブラリのインポート
import 'react-toastify/dist/ReactToastify.css'; // 通知のスタイルシート


function RegisterForm() {
  // トースト通知機能
  const notify = () => {
    toast('新規登録が完了しました！');
  };

  // ユーザーデータの状態
  const [userData, setUserData] = useState({
    name: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState(''); // エラーメッセージ用の状態
  const router = useRouter();

  // 連続する3つの半角英数字をチェックする関数
  const hasConsecutiveCharacters = (str) => {
    return /(\d)\1\1/.test(str);
  };

  // バリデーション関数
  const validate = () => {
    if (userData.name.length > 12) {
      setError('名前は12文字以下である必要があります。');
      return false;
    }
    if (userData.password.length < 8 || !/^[a-zA-Z0-9]+$/.test(userData.password) || hasConsecutiveCharacters(userData.password)) {
      setError(
        <>
          パスワードは8文字以上の半角英数字で<br/>
          あり、連続する3つの数字を含まない<br/>
          必要があります。
        </>
      );
      return false;
    }
    if (userData.password !== userData.password2) {
      setError('パスワードが一致しません。');
      return false;
    }
    return true;
  };

  // 入力フィールドの変更をハンドルする関数
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // ユーザー登録処理
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name, 
          password: userData.password,
        }),
      });

      if (res.status === 201) {
        console.log('ユーザー登録に成功しました。');
        notify();
        router.push('/login');
        setUserData({
          name: '',
          password: '',
          password2: '',
        });
      } else {
        const data = await res.json();
        setError(data.error || '登録に失敗しました。');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('登録処理中にエラーが発生しました。');
    }
  };

  // JSXでのレンダリング
  return (
    <form onSubmit={handleSubmit}>
      {/* ユーザ名入力フィールド */}
      <div className={styles.label}>
        <label>
          ユーザ名:<br />
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="ユーザ名"
            required
          />
        </label>
      </div>

      {/* パスワード入力フィールド */}
      <div className={styles.label}>
        <label>
          パスワード:<br />
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="パスワード"
            required
          />
        </label>
      </div>

      {/* パスワード確認フィールド */}
      <div className={styles.label}>
        <label>
          再確認のため<br />もう一度パスワードを入力してください:<br />
          <input
            type="password"
            name="password2"
            value={userData.password2}
            onChange={handleChange}
            placeholder="再パスワード"
            required
          />
        </label>
      </div>

      {/* エラーメッセージ */}
      {error && <div className={styles.error}>{error}</div>}

      {/* 登録ボタン */}
      <button type="submit" className={styles.new}>登録する</button>
    </form>
  );
}

export default RegisterForm;