# 開発計画書

## 概要
画面設計指示書に基づく開発計画とテスト計画

## 1. ログイン画面の開発計画

### 1.1 実装済み確認事項
- ✅ タイトル「ログイン」
- ✅ Worker Code → 「作業者コード」変更
- ✅ Password → 「パスワード」変更
- ✅ Login → 「ログイン」変更

### 1.2 未実装事項
- 🔄 Worker Code入力時の英字大文字変換
- 🔄 「Enter your worker code and password below to log in」の除去
- 🔄 「記憶する」チェックボックスの除去
- 🔄 SignUpリンクの除去

### 1.3 対象ファイル
- `resources/js/pages/auth/login.tsx`

## 2. Entry画面の開発計画

### 2.1 UI/レイアウト改善
- 🆕 タイトル「NG Data Entry」→「モンプチ レシート登録」
- 🆕 フィールドラベル日本語化（Month→月、Day→日、Hour→時、Minute→分）
- 🆕 月日時分を「レシート日時」でグループ化（fieldset使用）
- 🆕 Submit→「登録」ボタンテキスト変更

### 2.2 ハンバーガーメニュー機能
- 🆕 ページ右上にハンバーガーメニュー配置
- 🆕 ログアウトメニュー実装
- 🆕 J04ユーザーのみ「ユーザー追加」メニュー表示

### 2.3 キーボード操作・フォーカス制御
- 🆕 Enterキーでのフォーカス移動（Line_UID→月→日→時→分→NG理由→登録ボタン）
- 🆕 Enterキーでの自動Submit無効化
- 🆕 F5キー: line_uidフィールドでクリップボード貼り付け
- 🆕 F12キー: フォーム送信

### 2.4 バリデーション強化
- 🆕 line_uid必須バリデーション
- 🆕 月日時分は任意項目に変更
- 🆕 F12キー、Enterキー、クリックすべてでバリデーション実行

### 2.5 UX改善
- 🆕 登録完了通知をアラートからおしゃれな表示に変更
- 🆕 登録完了後のフィールド初期化
- 🆕 デバッグ画面の除去

### 2.6 対象ファイル
- `resources/js/pages/Entry.tsx`
- `resources/js/components/hamburger-menu.tsx`
- `app/Http/Controllers/EntryController.php`（新規作成）
- `app/Http/Requests/EntryRequest.php`（新規作成）

## 3. ユーザー追加機能の開発計画

### 3.1 モーダルダイアログ実装
- 🆕 フロート形式のユーザー追加画面
- 🆕 「作業者コード」「パスワード」入力フィールド
- 🆕 「キャンセル」「登録」ボタン

### 3.2 API実装
- 🆕 Workerモデルへの新規ユーザー追加機能
- 🆕 SeederのWorkerFactoryを参考にしたデータ構造

### 3.3 対象ファイル
- `resources/js/components/UserAddModal.tsx`（新規作成）
- `app/Http/Controllers/WorkerController.php`
- `routes/api.php`

## 4. 実装優先順位

### Phase 1: ログイン画面完成
1. Worker Code大文字変換
2. 不要要素の除去

### Phase 2: Entry画面基本機能
1. UI改善（タイトル、ラベル、グループ化）
2. ボタンテキスト変更
3. バリデーション調整

### Phase 3: Entry画面高度機能
1. キーボードショートカット（F5、F12）
2. フォーカス制御
3. ハンバーガーメニュー

### Phase 4: ユーザー追加機能
1. モーダルダイアログ
2. API実装
3. 統合テスト

## 5. 技術的考慮事項

### 5.1 使用技術
- React (TypeScript)
- Inertia.js
- Laravel
- TailwindCSS
- Radix UI

### 5.2 新規依存関係
- Toast/Notification ライブラリ（登録完了通知用）

## 6. デザイン統一
- Doc/sample/login-preview.html
- Doc/sample/staff-registration-preview.html
これらを参考にした統一デザインの適用
