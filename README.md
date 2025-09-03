# Next.js + Rails 掲示板アプリ

フロントエンドに **Next.js**、バックエンドに **Ruby on Rails (APIモード)**、データベースに **PostgreSQL (Docker)** を利用したシンプルな掲示板アプリを学習用に作成しました。（現在開発途中）

---

## セットアップ

### 1. DB 起動
```bash
docker compose up -d
```

### 2. Rails API
```
cd backend
bundle install
rails db:create
rails db:migrate
rails server -p 3001
```

### 3. Next.js
```
cd frontend
npm install
npm run dev
```

### URL
フロント: http://localhost:3000
API: http://localhost:3001/api/v1/posts


