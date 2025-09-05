# 【アップデート版】AI開発指示書 - MF-MPツール

## 1. プロジェクト概要

### プロジェクト名
**MF-MPツール**

### 目的
複数の担当者が同時にLINE UID、日時情報、NG理由を効率的に入力するための社内業務ツールを開発する。データはAccessからのODBCリンクでの利用を前提とする。

### 技術スタック
| カテゴリ | 技術 | バージョン/詳細 |
| :--- | :--- | :--- |
| **バックエンド** | Laravel | `11.x` |
| | PHP | `8.2` 以上 |
| **データベース** | MySQL | `8.0` |
| **フロントエンド** | React | ポップで動きのあるUI |
| **Webサーバ** | IIS | `10` (本番環境) |
| **開発環境** | XAMPP | PHP `8.2`以上, MySQL `8.0` |

---

## 2. 開発ステップガイド

### **ステップ0: 環境構築とプロジェクト初期設定**

1.  **リポジトリのクローン**
    ```bash
    git clone [https://github.com/Hideo0121/MF-MPToo.git](https://github.com/Hideo0121/MF-MPToo.git) C:\xampp\htdocs\MF-MPTool
    cd C:\xampp\htdocs\MF-MPTool
    ```

2.  **.envファイルの設定**
    `.env.example` をコピーして `.env` を作成し、データベース接続情報を設定します。
    ```bash
    cp .env.example .env
    ```
    `.env` ファイルを以下のように編集してください。
    ```ini
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=mf_mp_tool # データベース名を指定
    DB_USERNAME=root       # XAMPPのデフォルト
    DB_PASSWORD=           # XAMPPのデフォルト
    ```

3.  **依存パッケージのインストール**
    ```bash
    composer install
    npm install
    ```

4.  **アプリケーションキーの生成**
    ```bash
    php artisan key:generate
    ```

5.  **ローカルサーバの起動**
    開発中はLaravelの組み込みサーバを利用すると便利です。
    ```bash
    php artisan serve
    # フロントエンドの開発サーバも起動
    npm run dev
    ```

### **ステップ1: データベースのセットアップ**

1.  **マイグレーションファイルの作成**
    以下のコマンドで必要なマイグレーションファイルを生成します。
    ```bash
    php artisan make:migration create_workers_table
    php artisan make:migration create_ng_reasons_table
    php artisan make:migration create_line_uid_entries_table
    ```

2.  **マイグレーションファイルへのスキーマ定義**
    生成された各ファイルに、指示書通りのカラム定義を記述します。

    * `database/migrations/xxxx_create_workers_table.php`:
        ```php
        Schema::create('workers', function (Blueprint $table) {
            $table->id();
            $table->string('worker_code', 10)->unique();
            $table->string('password');
            $table->boolean('is_admin')->default(false);
            $table->timestamps();
        });
        ```
    * `database/migrations/xxxx_create_ng_reasons_table.php`:
        ```php
        Schema::create('ng_reasons', function (Blueprint $table) {
            $table->id();
            $table->string('reason', 50)->unique();
            $table->string('created_by', 10);
            $table->timestamps();
        });
        ```
    * `database/migrations/xxxx_create_line_uid_entries_table.php`:
        ```php
        Schema::create('line_uid_entries', function (Blueprint $table) {
            $table->id();
            $table->string('line_uid', 33);
            $table->tinyInteger('month');
            $table->tinyInteger('day');
            $table->tinyInteger('hour');
            $table->tinyInteger('minute');
            $table->foreignId('ng_reason_id')->constrained('ng_reasons');
            $table->string('worker_code', 10);
            $table->boolean('is_duplicate')->default(false);
            $table->timestamps();

            $table->index(['line_uid', 'month', 'day', 'hour', 'minute']);
        });
        ```

3.  **モデルの作成**
    リレーションを定義するためにモデルを作成します。
    ```bash
    php artisan make:model Worker
    php artisan make:model NgReason
    php artisan make:model LineUidEntry
    ```
    * `app/Models/LineUidEntry.php` にリレーションを追加:
        ```php
        public function ngReason()
        {
            return $this->belongsTo(NgReason::class);
        }
        ```

4.  **シーダーの作成（初期データ投入）**
    ```bash
    php artisan make:seeder NgReasonSeeder
    php artisan make:seeder AdminWorkerSeeder
    ```
    * `database/seeders/NgReasonSeeder.php`:
        初期NG理由データを投入するロジックを記述します。
    * `database/seeders/AdminWorkerSeeder.php`:
        管理者アカウント（`J04`, `password`）をハッシュ化して投入するロジックを記述します。

5.  **データベースの実行**
    マイグレーションとシーディングを実行します。
    ```bash
    php artisan migrate --seed
    ```

### **ステップ2: バックエンドAPIの実装 (Laravel)**

1.  **認証API (Sanctum)**
    * **設定**: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` を実行し、`app/Http/Kernel.php` の `api` ミドルウェアグループに `EnsureFrontendRequestsAreStateful::class` を追加します。
    * **ルーティング (`routes/api.php`)**:
        ```php
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user', function (Request $request) {
                return $request->user();
            });
            // 他の認証必須ルートをここに追加
        });
        ```
    * **コントローラ (`AuthController`)**: ログイン・ログアウト処理を実装します。作業者コードの形式（`[A-Z][0-9]+` または `[A-Z]{2}[0-9]+`）を正規表現でバリデーションします。

2.  **メイン入力API**
    * **FormRequestの作成**:
        ```bash
        php artisan make:request StoreLineUidEntryRequest
        ```
        このファイルに、LINE UID（33桁英数）、日時（未来日不可）、NG理由などのバリデーションルールを厳密に定義します。
    * **コントローラ (`LineUidEntryController`)**:
        `store` アクションを実装します。`StoreLineUidEntryRequest` を使ってバリデーションし、重複チェックロジック（同一UID+日時のデータが存在すれば `is_duplicate` を `true` にする）を組み込みます。
    * **ルーティング (`routes/api.php` の `auth:sanctum` ミドルウェア内)**:
        ```php
        Route::apiResource('entries', LineUidEntryController::class)->only(['store']);
        Route::get('ng-reasons', [NgReasonController::class, 'index']); // NG理由一覧取得
        ```

3.  **管理者API**
    * **管理者ミドルウェアの作成**: `php artisan make:middleware IsAdmin` を作成し、ログインユーザーの `is_admin` フラグをチェックするロジックを実装します。
    * **ルーティング (`routes/api.php` の `auth:sanctum` ミドルウェア内)**:
        ```php
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::apiResource('workers', AdminWorkerController::class);
            Route::apiResource('ng-reasons', AdminNgReasonController::class);
        });
        ```
    * **コントローラ**: `AdminWorkerController`, `AdminNgReasonController` を作成し、CRUD機能を実装します。

### **ステップ3: フロントエンドの実装 (React)**

1.  **UIライブラリとアニメーションライブラリの導入**
    ```bash
    npm install @mui/material @emotion/react @emotion/styled
    npm install framer-motion
    ```

2.  **コンポーネント設計**
    * `src/components/pages/LoginPage.tsx`: ログインフォーム
    * `src/components/pages/EntryPage.tsx`: メイン入力フォーム
    * `src/components/pages/AdminDashboard.tsx`: 管理者向けダッシュボード
    * `src/components/ui/`: ボタンや入力フィールドなどの共通UIコンポーネント
    * `src/hooks/`: API通信や状態管理のカスタムフック

3.  **状態管理**
    * React Context API を使用して、ログインユーザー情報やセッション状態をグローバルに管理します。

4.  **実装の方針**
    * **ログイン画面**: 作業者コードとパスワードを入力し、`/api/login` へPOSTリクエストを送信します。
    * **入力画面**:
        * 1画面で完結するフォームを Material-UI を使って構築します。
        * `/api/ng-reasons` から取得したNG理由をセレクトボックスに表示します。
        * 入力値はリアルタイムでバリデーションし、エラーメッセージを表示します。
        * 送信ボタンクリック時に、Framer Motion を使った確認ダイアログを表示し、APIへデータを送信します。
    * **管理者画面**:
        * 作業者一覧、NG理由一覧を表示・編集・削除するUIを作成します。
        * 管理者用APIエンドポイントと連携します。

---

## 3. その他の要件

### セキュリティ
指示書にある通り、Eloquent ORMの使用、CSRF/XSS対策、パスワードの `bcrypt` ハッシュ化を徹底してください。全てのAPIリクエストで厳密なバリデーションを実施します。

### テスト
`Pest` または `PHPUnit` を使用して、バックエンドのテストを作成します。特に認証、バリデーション、重複チェックロジックは重点的にテストしてください。
```bash
# Featureテストの例
php artisan make:test LineUidEntryTest


### Git運用
指示書通りのブランチ戦略（main, develop, feature/*）を遵守してください。コミット前には必ずテストを実行し、すべてのテストが通過することを確認してください。
