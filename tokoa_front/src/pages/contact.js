import styles from '../styles/contact.module.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios'; // axiosをインポート
import { useState } from 'react';


// お問い合わせフォームのコンポーネント
function ContactForm() {

  // 状態変数の定義
  const [name, setName] = useState(''); // 名前
  const [nameError, setNameError] = useState(''); // 名前のエラーメッセージ
  const [phoneNumber, setPhoneNumber] = useState(''); // 電話番号
  const [phoneNumberError, setPhoneNumberError] = useState(''); // 電話番号のエラーメッセージ
  const [email, setEmail] = useState(''); // メールアドレス
  const [emailError, setEmailError] = useState(''); // メールアドレスのエラーメッセージ
  const [contact, setContact] = useState(''); // お問い合わせ内容
  const [contactError, setContactError] = useState(''); // お問い合わせ内容のエラーメッセージ

  // 名前のバリデーション関数
  const validateName = (name) => {
    return name.trim() !== '';
  }

  // 電話番号のバリデーション関数
  const validatePhoneNumber = (number) => {
    const regex = /^(0\d{1,4}-\d{1,4}-\d{4}|0\d{9,10})$/;
    return regex.test(number);
  };

  // メールアドレスのバリデーション関数
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // お問い合わせ内容のバリデーション関数
  const validateContact = (contact) => {
    return contact.trim() !== '';
  }

  // 各入力欄の変更ハンドラー
  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
    setNameError(validateName(name) ? '' : '名前を入力してください。');
  }

  const handlePhoneNumberChange = (e) => {
    const number = e.target.value;
    setPhoneNumber(number);
    setPhoneNumberError(validatePhoneNumber(number) ? '' : '無効な電話番号形式です。');
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    setEmailError(validateEmail(email) ? '' : '無効なメールアドレス形式です。');
  };

  const handleContactChange = (e) => {
    const contact = e.target.value;
    setContact(contact);
    setContactError(validateContact(contact) ? '' : 'お問い合わせ内容を入力してください。');
  }

  // フォーム送信ハンドラー
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNameValid = validateName(name);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    const isEmailValid = validateEmail(email);
    const isContactValid = validateContact(contact);

    // エラー状態の更新
    setNameError(isNameValid ? '' : '名前を入力してください。');
    setPhoneNumberError(isPhoneNumberValid ? '' : '電話番号を入力してください。');
    setEmailError(isEmailValid ? '' : 'メールアドレスを入力してください。');
    setContactError(isContactValid ? '' : 'お問い合わせ内容を入力してください。');

    // バリデーションチェック
    if (!isNameValid || !isPhoneNumberValid || !isEmailValid || !isContactValid) {
      return;
    }

    // フォームの送信
    try {
      const response = await axios.post('http://localhost:8000/api/inquiries/', {
        name: name,
        phone_number: phoneNumber,
        email: email,
        message: contact
      });

      console.log(response.data);
      location.replace("/contact_fin");

    } catch (error) {
      console.error('There was an error submitting the form', error);
    }
  };

// JSXでのレンダリング
return (

  // コンタクトフォームのメインコンテナ
  <div className={styles.container_contact}>

    {/* ページのヘッド部分の設定 */}
    <Head>
      <title>お問い合わせ</title>
    </Head>

    {/* ホームへのリンク付きヘッダーコンポーネントの表示 */}
    <Header backLink="/" />

    {/* メインコンテンツ部分 */}
    <div className={styles.main}>

      {/* お問い合わせタイトル */}
      <div className={styles.title}>
        <h1><b>お問い合わせ</b></h1>
      </div>

      {/* お問い合わせフォーム */}
      <form onSubmit={handleSubmit}>

        {/* 名前入力フィールド */}
        <div className={styles.formGroup}>
          <label className={styles.labelStyle}>名前<br/>
            <input type="text" id="name" name="name" value={name}
              onChange={handleNameChange} className={styles.name} placeholder="田中 太郎" />
          </label>
          {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
        </div>

        {/* 電話番号入力フィールド */}
        <div className={styles.formGroup}>
          <label className={styles.labelStyle}>電話番号(ハイフン無し)<br/>
            <input type="tel" id="phone" name="phone" value={phoneNumber}
              onChange={handlePhoneNumberChange} className={styles.num} placeholder="04010518585"/>
          </label>
          {phoneNumberError && <p style={{ color: 'red' }}>{phoneNumberError}</p>}
        </div>

        {/* メールアドレス入力フィールド */}
        <div className={styles.formGroup}>
          <label className={styles.labelStyle}>メールアドレス<br/>
            <input type="email" id="email" name="email" value={email} 
              onChange={handleEmailChange} className={styles.address} placeholder="Tokoa_love@eco.jp"/>
          </label>
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        </div>

        {/* お問い合わせ内容入力フィールド */}
        <div className={styles.formGroup}>
          <label className={styles.labelStyle}>お問い合わせ内容<br/>
            <textarea className={styles.contact} value={contact} onChange={handleContactChange}></textarea>
          </label>
          {contactError && <p style={{ color: 'red' }}>{contactError}</p>}
        </div>

        {/* 注意事項の表示 */}
        <div className={styles.alert}><b>
          ※お問い合わせは２４時間受け付けておりますが<br />
          ご回答は営業時間内にさせていただきますので<br />
          よろしくお願い致します。
        </b></div>

        {/* 送信ボタン */}
        <button className={styles.sosin} type="submit">送信</button>
      </form>
    </div>

    {/* フッターコンポーネントの表示 */}
    <Footer />
  </div>
  )
}

export default ContactForm;