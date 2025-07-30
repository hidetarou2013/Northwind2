# Northwind Trading System

A modern web application built with Spring Boot (Java 21) backend and React frontend, based on the classic Northwind database.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Java 21** with Spring Boot 3.2.1
- **Gradle** build system
- **Spring Data JPA** for database operations
- **H2 Database** (in-memory for development)
- **PostgreSQL** support for production
- **OpenAPI/Swagger** for API documentation
- **MapStruct** for DTO mapping
- **JWT Authentication** ready

### Frontend (React)
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **MUI X Data Grid** for data tables
- **Axios** for API communication
- **Responsive design**

## 📊 Database Schema

The system includes the following main entities:

- **Products**: Product catalog with categories and suppliers
- **Categories**: Product categorization
- **Suppliers**: Supplier information
- **Customers**: Customer data with party model
- **Employees**: Employee information with party model
- **Orders**: Customer orders with order details
- **Geographic**: Countries, regions, and cities hierarchy
- **Authentication**: User login and role management

See [ER-Diagram.md](./ER-Diagram.md) for detailed database schema visualization.

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 16+ and npm
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./gradlew bootRun
   ```
   
   Or on Windows:
   ```bash
   gradlew.bat bootRun
   ```

3. The backend will start on `http://localhost:8080`

4. Access the API documentation at: 
`http://localhost:8080/swagger-ui.html`
`http://localhost:8080/Northwind2/swagger-ui.html`

5. Access H2 Database Console at: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:northwind`
   - Username: `sa`
   - Password: (empty)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will start on `http://localhost:3000`

## 🔧 Development

### Backend Development
- Main application: `src/main/java/com/northwind/NorthwindApplication.java`
- API Controllers: `src/main/java/com/northwind/controller/`
- Services: `src/main/java/com/northwind/service/`
- Entities: `src/main/java/com/northwind/entity/`
- Repositories: `src/main/java/com/northwind/repository/`

### Frontend Development
- Main app: `src/App.tsx`
- Components: `src/components/`
- API services: `src/services/api.ts`

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/all` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/active` - Get active products
- `GET /api/products/search?name={name}` - Search products
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/low-stock` - Get low stock products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## 🇯🇵 日本語ドキュメント

### バックエンド起動方法

#### 前提条件
- Java 21以上がインストールされていること
- Gradleが利用可能であること

#### 起動手順
1. バックエンドディレクトリに移動：
   ```bash
   cd backend
   ```

2. Spring Bootアプリケーションを起動：
   ```bash
   ./gradlew bootRun
   ```
   
   Windowsの場合：
   ```bash
   gradlew.bat bootRun
   ```

3. アプリケーションが起動したら、以下のURLでアクセス可能：
   - メインアプリケーション: `http://localhost:8080`
   - Swagger UI (API ドキュメント): `http://localhost:8080/swagger-ui.html`
   - H2 データベースコンソール: `http://localhost:8080/h2-console`

### サービスポート
- **バックエンド**: `8080`
- **フロントエンド**: `3000`

### RESTful API CRUD URI

#### 商品管理 (Products)
| 操作 | HTTPメソッド | URI | 説明 |
|------|-------------|-----|------|
| 全件取得（ページネーション） | GET | `/api/products` | ページネーション付きで全商品を取得 |
| 全件取得 | GET | `/api/products/all` | ページネーションなしで全商品を取得 |
| 1件取得 | GET | `/api/products/{id}` | ID指定で商品を取得 |
| アクティブ商品取得 | GET | `/api/products/active` | アクティブな商品のみ取得 |
| 商品検索 | GET | `/api/products/search?name={name}` | 商品名で検索 |
| カテゴリ別商品取得 | GET | `/api/products/category/{categoryId}` | カテゴリID指定で商品を取得 |
| 在庫不足商品取得 | GET | `/api/products/low-stock` | 在庫不足の商品を取得 |
| 新規作成 | POST | `/api/products` | 新商品を登録 |
| 更新 | PUT | `/api/products/{id}` | 既存商品を更新 |
| 削除 | DELETE | `/api/products/{id}` | 商品を削除 |

#### データベース接続情報
- **H2 データベースコンソール**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:northwind`
- **ユーザー名**: `sa`
- **パスワード**: (空)

### フロントエンド起動方法

#### 前提条件
- Node.js 16以上がインストールされていること
- npmが利用可能であること

#### 起動手順
1. フロントエンドディレクトリに移動：
   ```bash
   cd frontend
   ```

2. 依存関係をインストール：
   ```bash
   npm install
   ```

3. 開発サーバーを起動：
   ```bash
   npm start
   ```

4. アプリケーションが起動したら、以下のURLでアクセス可能：
   - メインアプリケーション: `http://localhost:3000`
   - 商品ダッシュボード: `http://localhost:3000`

### フロントエンドURL構成

#### メインページ
- **アプリケーション**: `http://localhost:3000`
  - Northwind Trading Systemのメインダッシュボード
  - 商品管理機能
  - データグリッド表示

#### 主要機能
- **商品ダッシュボード**: 商品一覧、検索、フィルタリング
- **商品管理**: 商品のCRUD操作
- **在庫管理**: 在庫状況の確認
- **カテゴリ管理**: 商品カテゴリの管理

#### 技術仕様
- **フレームワーク**: React 19.1.0 with TypeScript
- **UIライブラリ**: Material-UI (MUI) 7.2.0
- **データグリッド**: MUI X Data Grid 8.9.1
- **HTTP通信**: Axios 1.11.0
- **API接続**: `http://localhost:8080/api`

## 🎯 Features

### Current Features
- Product management with full CRUD operations
- Product search and filtering
- Low stock alerts
- Responsive dashboard with key metrics
- Data grid with sorting and pagination
- Category and supplier relationships

### Planned Features
- Customer management
- Order processing
- Employee management
- Reporting system
- User authentication and authorization
- Advanced search and filtering
- Data export capabilities

## 🐳 Docker Support (Coming Soon)

```yaml
# docker-compose.yml example
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: northwind
      POSTGRES_USER: northwind
      POSTGRES_PASSWORD: northwind
    
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Based on the classic Northwind database schema
- Built with modern Java and React technologies
- Inspired by enterprise-level e-commerce systems


