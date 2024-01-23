import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/auth'; // AuthContextからuseAuthをインポート

// Footerコンポーネント
function Footer() {
    const { user } = useAuth(); // ユーザー情報をコンテキストから取得

    // JSXでのレンダリング
    return (
        <div className="footer">
            <div className="container-fluid mt-3">
                <div className="row"> {/* 横幅をなしにする（colも必要） */}
                    <div className="col px-0">

                        {/* フッター */}
                        <footer className="bg-light text-center">
                            <div className="container p-4">

                                {/* SNSリンク */}
                                <section className="mb-4">
                                    <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#3b5998', border: 'none' }} href="#!" role="button"><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#55acee', border: 'none' }} href="#!" role="button"><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#ac2bac', border: 'none' }} href="#!" role="button"><i className="fab fa-instagram"></i></a>
                                </section>

                                {/* フッターメニュー */}
                                <section>
                                    <div className="row">
                                        {/* サービスセクション */}
                                        <div className="col">
                                            <h4 className="text-uppercase">Service</h4>
                                            <ul className="list-unstyled mb-0">
                                                <li><Link href="/upload" className="text-dark"　style={{ fontSize : '12.6px'}}>アップロード</Link></li>
                                                <li><Link href="/profile" className="text-dark"　style={{ fontSize : '12.6px'}}>マイページ</Link></li>
                                                <li><Link href="/shop" className="text-dark"　style={{ fontSize : '12.6px'}}>ショップ</Link></li>
                                            </ul>
                                        </div>

                                        {/* マイページセクション */}
                                        <div className="col">
                                            <h4 className="text-uppercase">MyPage</h4>
                                            <ul className="list-unstyled mb-0">
                                                <li><Link href="/setting" className="text-dark"　style={{ fontSize : '12.6px'}}>設定</Link></li>
                                                <li><Link href="/login" className="text-dark"　style={{ fontSize : '12.6px'}}>新規登録/ログイン</Link></li>
                                                <li><Link href="/logout" className="text-dark"　style={{ fontSize : '12.6px'}}>ログアウト</Link></li>
                                            </ul>
                                        </div>

                                        {/* その他のリンクセクション */}
                                        <div className="col">
                                            <h4 className="text-uppercase">Others</h4>
                                            <ul className="list-unstyled mb-0">
                                                <li><Link href="/contact" className="text-dark"　style={{ fontSize : '12.6px'}}>お問い合わせ</Link></li>
                                                <li><Link href="https://www.o-hara.ac.jp/senmon/school/wakayama_iryo" className="text-dark"　style={{ fontSize : '12.6px'}}>会社概要</Link></li>
                                                <li><Link href="/info" className="text-dark"　style={{ fontSize : '12.6px'}}>お知らせ</Link></li>

                                                {/* 管理者用リンクの条件付き表示 */}
                                                {user && user.isAdmin && (
                                                    <li><Link href="/manager/menu" className="text-blue"　style={{ color: 'blue',fontSize : '12.6px' }}>管理者ページ</Link></li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* コピーライトセクション */}
                            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                © 2023 Copyright:
                                <a className="text-dark" href="https://bootstrap.com/">Tokoa.com</a>
                            </div>

                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;