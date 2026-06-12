# ShopEZ 🛍️

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) e-commerce application that allows users to browse products, manage their cart, and place orders, while admins can manage products and track orders through a dedicated dashboard.

## 🚀 Features

### User Features
- User registration and login with JWT authentication
- Browse products with category filters and price sorting
- Select size for clothing items (S/M/L/XL)
- Add to cart, view cart, and remove items
- Place orders with delivery address
- Track order status (Processing, Shipped, Delivered, Cancelled)

### Admin Features
- Secure admin dashboard (role-based access)
- Add and delete products
- Categorize products and manage sizes for clothing
- View all customer orders with customer details
- Update order status

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Context API for auth state

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password hashing
- CORS & dotenv

## 📁 Project Structure
ShopEZ/

├── client/                # React frontend

│   ├── src/

│   │   ├── components/    # Navbar, etc.

│   │   ├── pages/         # Home, Login, Register, Products, Cart, Orders, Admin

│   │   ├── context/        # AuthContext

│   │   ├── App.jsx

│   │   └── main.jsx

│

├── server/                 # Express backend

│   ├── models/             # User, Product, Cart, Order

│   ├── controllers/        # Business logic for each entity

│   ├── routes/             # API routes

│   ├── middleware/          # JWT auth & admin middleware

│   └── index.js

│

└── README.md

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/shanmukhasaihemanth-art1/ShopEZ.git
cd ShopEZ
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

PORT=8000

Start the backend server:
```bash
npm run dev
```
Server runs on `http://localhost:8000`

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🔑 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/cart` | Get user cart | User |
| POST | `/api/cart` | Add to cart | User |
| DELETE | `/api/cart/:productId` | Remove item from cart | User |
| DELETE | `/api/cart` | Clear cart | User |
| POST | `/api/orders` | Place an order | User |
| GET | `/api/orders/myorders` | Get user's orders | User |
| GET | `/api/orders/all` | Get all orders | Admin |
| PUT | `/api/orders/:id` | Update order status | Admin |

## 🏗️ Architecture

The backend follows the **MVC (Model-View-Controller)** pattern:
- **Models** – Mongoose schemas defining data structure
- **Controllers** – Business logic handling requests and responses
- **Routes** – API endpoint definitions connecting URLs to controllers

## 👤 Author

Built as part of an internship project assignment.