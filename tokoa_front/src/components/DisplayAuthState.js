import React from 'react';
import { useAuth } from '../contexts/auth'; // AuthコンテキストからuseAuthをインポート

// DisplayAuthStateコンポーネント
const DisplayAuthState = () => {
  // Authコンテキストからユーザー情報を取得
  const { user } = useAuth();

  // JSXでのレンダリング
  return (
    <div>
      <h3>現在の認証状態:</h3>
      {/* ユーザー情報をJSON形式で表示 */}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default DisplayAuthState; // コンポーネントをエクスポート