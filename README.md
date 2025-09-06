# イベントリマインド用スクリプトのテンプレート

## 概要

スプレッドシートにイベントの情報を記載することで、Mattermost にリマインダーを投稿できるようにするスクリプトです。
[![Image from Gyazo](https://i.gyazo.com/677b2ed5c67f076e27ff52e9dc6a0d32.png)](https://gyazo.com/677b2ed5c67f076e27ff52e9dc6a0d32)

<br>

---

## 環境構築手順

### clasp

事前に[clasp](https://github.com/google/clasp)がインストール・ログイン済みであるものとします。

<br>

### node_modules のインストール

※基本的にローカル開発用の@types くらいなのでインストールしなくても支障はありません※

```
npm install
```

<br>

### スプレッドシートおよびプロジェクトの作成

```
# スプレッドシートとプロジェクトを作成
clasp create --type sheets

# 作成後にシートとScriptプロジェクトが作成されるため確認
Created new Google Sheet: https://drive.google.com/open?id=xxxxxxxx
Created new Google Sheets Add-on script: https://script.google.com/d/xxxxxxxxxx/edit

# コードをプロジェクトにpushする
clasp push

# 以下の選択肢にはyで回答
? Manifest file has been updated. Do you want to push and overwrite? (y/N) y
```

上記の手順により本リポジトリの`.clasp.json.sample`と同じデータ形式の`.clasp.json`が作成されます。

<br>

### スプレッドシートのインポート

`/template/スプレッドシートテンプレート.xlsx`を上記手順で作成済みのスプレッドシートにインポート（この時インポート場所には、「スプレッドシートを置換する」を選択）

<br>

### スプレッドシートへの情報の記入

- 「settings」シートに対象とするシート名と送信先の IncomingWebhook を記入。
- 各シートに情報を記入。（1 回のイベント毎に 1 行となるイメージ）
- 対象とするイベントの分だけ「テンプレートシート」をコピーして追加。

<br>

### トリガーの設定

GAS を動作させるためのトリガー情報を設定する。

- 設定例
  [![Image from Gyazo](https://i.gyazo.com/4df008af642a5b3ef8eb438707a7ee47.png)](https://gyazo.com/4df008af642a5b3ef8eb438707a7ee47)

### コード修正後の手順

コードを修正した場合は以下のコマンドで GAS プロジェクトに反映させる。

```
clasp push
```

### お願い

構築中に「xxx で権限エラーになった」「API 実行の認証設定が必要だった」のようなことがありましたらご連絡ください 🙏
