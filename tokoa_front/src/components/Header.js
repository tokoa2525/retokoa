import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Headerコンポーネント
function Header({ backLink }) {
    const router = useRouter();

    // 戻るボタンのクリックイベントハンドラー
    function goToBackPage(e) {
        e.preventDefault(); // デフォルトのリンク動作を防止
        router.push(backLink); // 指定されたリンクへ移動
    }

    return (
        // コンテナ設定
        <div className="container-fluid mb-5 ml-0 pl-0"> {/* コンテナの中身を横幅いっぱいに表示 */}
            <div className="row"> {/* 横幅をなしにする（colも必要） */}
                <div className="col px-0">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container">

                            <div className="float-start mr-1">
                                {/* 戻るボタン */}
                                <a className="btn btn-info btn-floating" href="#" onClick={goToBackPage}>←</a>
                            </div>

                            <Link href="/" className="navbar-brand"></Link>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    {/* 各ナビゲーション項目 */}
                                    <li className="nav-item active">
                                        <Link href="/" className="nav-link">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/upload" className="nav-link">Upload</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/shop" className="nav-link">Shop</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/contact" className="nav-link">Contact</Link>
                                    </li>
                                    {/* マイページのドロップダウンメニュー */}
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            MyPage
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" href="../login">新規登録/ログイン</Link></li>
                                            <li><Link className="dropdown-item" href="../profile">マイページ</Link></li>
                                            <li><Link className="dropdown-item" href="../setting">設定</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><Link className="dropdown-item logout" href="../logout">ログアウト</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Header;