import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/auth'; // AuthContextをインポート

// 認証保護を提供する高階コンポーネント
const withAuthProtection = (WrappedComponent) => {

  // 返される関数コンポーネント
  return (props) => {
    const router = useRouter(); // useRouterフックを使用
    const { user } = useContext(AuthContext); // AuthContextからユーザー情報を取得

    useEffect(() => {
      // トークンの存在をチェック
      const token = localStorage.getItem('accessToken');

      // ユーザーが認証されていない、またはトークンが存在しない場合はログインページにリダイレクト
      if (!user || !token) {
        router.push('/login');
      }
    }, [user, router]);

    // ユーザーが認証されている場合のみ、ラップされたコンポーネントをレンダリング
    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuthProtection; // 高階コンポーネントをエクスポート