# 🍕 FeastRush — Multi-Restaurant Food Ordering Platform

> A full-stack food ordering web application built with **Node.js**, **MongoDB**, and **HTML/CSS/JavaScript**. Supports three user roles — Customer, Restaurant Owner, and Admin — with JWT-based authentication.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [Pages Overview](#pages-overview)
- [Screenshots](#screenshots)
- [Author](#author)

---

## 📖 About the Project

FeastRush is a multi-restaurant food ordering platform where customers can browse restaurants, order food, and track deliveries in real time. Restaurant owners can manage their menus and incoming orders. Admins oversee the entire platform including approvals, commissions, and complaints.

This project was built as a college web development project to demonstrate full-stack development skills including REST API design, JWT authentication, role-based access control, and a modern responsive UI.

---

## ✨ Features

### 👤 Customer
- Register and login with JWT authentication
- Browse restaurants with filters (cuisine, rating, delivery time)
- Search restaurants and menu items
- Add items to cart with quantity control
- Apply coupon codes for discounts
- Checkout with multiple payment options (UPI, Card, Net Banking, COD)
- Live order tracking with status timeline
- View order history
- Rate and review restaurants
- Save favourite restaurants

### 🍽️ Restaurant Owner
- Register restaurant (pending admin approval)
- Manage menu — add, edit, delete items
- Toggle item availability in real time
- Accept or reject incoming orders
- Update order status step by step
- View daily revenue and order stats
- View customer reviews and respond
- Manage business hours and bank details

### 🛡️ Admin
- Platform-wide dashboard with revenue, orders, users, restaurants
- Approve or suspend restaurant registrations
- Ban or unban users
- Manage commission percentage per restaurant
- Create, edit, and delete coupon codes
- Handle customer complaints and process refunds
- View all orders across all restaurants
- Download revenue and commission reports

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| Cross-Origin | CORS |
| Environment | dotenv |

---

## 📁 Project Structure

```
feastrush/
│
├── frontend/                         # All HTML pages
│   ├── index.html                    # Homepage / Landing page
│   ├── auth.html                     # Login & Register (all 3 roles)
│   ├── restaurants.html              # Restaurant listing with filters
│   ├── menu.html                     # Restaurant menu + cart
│   ├── checkout.html                 # Checkout + payment + order confirmation
│   ├── admin.html                    # Admin dashboard
│   └── owner.html                    # Restaurant owner panel
│
├── backend/                          # Node.js + Express server
│   ├── server.js                     # Main entry point
│   ├── .env                          # Environment variables
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── models/
│   │   ├── User.js                   # User schema (customer/owner/admin)
│   │   ├── Restaurant.js             # Restaurant schema
│   │   ├── MenuItem.js               # Menu item schema
│   │   ├── Order.js                  # Order schema with status history
│   │   └── Coupon.js                 # Coupon/discount schema
│   ├── controllers/
│   │   ├── auth.controller.js        # Register, login, getMe
│   │   ├── restaurant.controller.js  # Restaurant & menu CRUD
│   │   ├── order.controller.js       # Place, track, update orders
│   │   └── admin.controller.js       # Admin operations
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── order.routes.js
│   │   └── admin.routes.js
│   └── middleware/
│       └── auth.middleware.js        # JWT verify + role-based access
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your computer:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A REST client like [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) for testing APIs

---

### Step 1 — Clone or Download the Project

```bash
# If using git
git clone https://github.com/yourusername/feastrush.git
cd feastrush

# Or just extract the downloaded zip folder
```

---

### Step 2 — Setup the Backend

```bash
cd backend
npm install
```

This installs all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

---

### Step 3 — Configure Environment Variables

Create a `.env` file inside the `backend` folder (already provided):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/feastrush
JWT_SECRET=feastrush_super_secret_key_2026
JWT_EXPIRE=7d
```

> If you are using MongoDB Atlas (cloud), replace `MONGO_URI` with your Atlas connection string.

---

### Step 4 — Start MongoDB

```bash
# If MongoDB is installed locally
mongod
```

---

### Step 5 — Start the Backend Server

```bash
cd backend
node server.js
```

You should see:

```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

---

### Step 6 — Open the Frontend

Open any HTML file directly in your browser:

```
frontend/index.html       → Homepage
frontend/auth.html        → Login / Register
frontend/restaurants.html → Browse restaurants
```

> All `fetch()` API calls in the frontend point to `http://localhost:5000/api`

---

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server runs on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/feastrush` |
| `JWT_SECRET` | Secret key for signing JWT tokens | your secret |
| `JWT_EXPIRE` | How long the token stays valid | `7d` |

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user or restaurant owner |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| GET | `/api/auth/me` | Private | Get logged-in user's profile |

---

### Restaurant Routes — `/api/restaurants`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/restaurants` | Public | Get all active restaurants (with filters) |
| GET | `/api/restaurants/:id` | Public | Get single restaurant details |
| GET | `/api/restaurants/:id/menu` | Public | Get menu items for a restaurant |
| GET | `/api/restaurants/owner/me` | Owner | Get my restaurant details |
| PUT | `/api/restaurants/owner/me` | Owner | Update my restaurant profile |
| POST | `/api/restaurants/owner/menu` | Owner | Add a new menu item |
| PUT | `/api/restaurants/owner/menu/:id` | Owner | Update a menu item |
| DELETE | `/api/restaurants/owner/menu/:id` | Owner | Delete a menu item |

---

### Order Routes — `/api/orders`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Customer | Place a new order |
| GET | `/api/orders/my` | Customer | Get my order history |
| GET | `/api/orders/:id` | Private | Get single order details |
| GET | `/api/orders/owner/all` | Owner | Get all orders for my restaurant |
| GET | `/api/orders/owner/stats` | Owner | Get today's stats |
| PATCH | `/api/orders/:id/status` | Owner | Update order status |

---

### Admin Routes — `/api/admin`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Platform-wide dashboard stats |
| GET | `/api/admin/restaurants` | Admin | Get all restaurants |
| PATCH | `/api/admin/restaurants/:id` | Admin | Approve / suspend a restaurant |
| GET | `/api/admin/users` | Admin | Get all customers |
| PATCH | `/api/admin/users/:id/ban` | Admin | Ban or unban a user |
| GET | `/api/admin/orders` | Admin | Get all orders platform-wide |
| POST | `/api/admin/coupons` | Admin | Create a new coupon |
| GET | `/api/admin/coupons` | Admin | Get all coupons |
| DELETE | `/api/admin/coupons/:id` | Admin | Delete a coupon |

---

## 👥 User Roles

### How to Register Each Role

**Customer:**
```json
POST /api/auth/register
{
  "firstName": "Arjun",
  "lastName": "Shah",
  "email": "arjun@test.com",
  "phone": "9876543210",
  "password": "123456",
  "role": "user"
}
```

**Restaurant Owner:**
```json
POST /api/auth/register
{
  "firstName": "Rahul",
  "lastName": "Mehta",
  "email": "rahul@pizzapalace.com",
  "phone": "9876543211",
  "password": "123456",
  "role": "owner",
  "restaurantName": "Pizza Palace",
  "cuisine": "Italian"
}
```

**Admin** — Create directly in MongoDB:
```js
// In MongoDB shell or Compass
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@feastrush.com",
  phone: "9999999999",
  password: "<bcrypt hashed password>",
  role: "admin",
  isActive: true
})
```

---

### How Authentication Works

```
1. User logs in  →  POST /api/auth/login
2. Server returns JWT token
3. Frontend saves token in localStorage
4. Every protected API call sends:
   Authorization: Bearer <token>
5. Server verifies token and checks role
6. If valid → request proceeds
7. If invalid → 401 Unauthorized
```

---

## 🖥️ Pages Overview

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Landing page with hero, restaurant cards, how it works |
| Auth | `auth.html` | Login & Register for all 3 roles |
| Restaurants | `restaurants.html` | Browse, filter, search restaurants |
| Menu + Cart | `menu.html` | View menu items, add to cart, apply coupon |
| Checkout | `checkout.html` | Delivery address, payment, order confirmation |
| Admin Panel | `admin.html` | Full admin dashboard with 8 sections |
| Owner Panel | `owner.html` | Restaurant management dashboard |

---

## 📸 Screenshots

> Add screenshots of your pages here after taking them.

```
/screenshots
  ├── homepage.png
  ├── auth.png
  ├── restaurants.png
  ├── menu.png
  ├── checkout.png
  ├── admin.png
  └── owner.png
```

---

## 🧪 Quick Test with Postman

**1. Register a user:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "email": "test@test.com",
  "phone": "9876543210",
  "password": "123456",
  "role": "user"
}
```

**2. Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "123456"
}
```

**3. Get restaurants (copy token from login response):**
```
GET http://localhost:5000/api/restaurants
Authorization: Bearer <your_token_here>
```

---

## 👨‍💻 Author

**Your Name**
- College: Your College Name
- Department: Computer Science / IT
- Project Type: College Web Development Project
- Year: 2026

---

## 📄 License

This project is built for educational purposes as part of a college assignment.

---

> Built with ❤️ using Node.js, MongoDB & Vanilla JavaScript