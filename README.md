
🛒 Smart Shopping Basket

A modern React + TypeScript shopping basket application with dynamic pricing, discount rules, and order management powered by Firebase.

---

## ✨ Features

- 🛍️ Add / Remove products from basket
- ➕ Update product quantity
- 💰 Automatic offer & discount calculation
- 📊 Real-time subtotal, savings & total
- 🔥 Offer system:
  - Buy 1 Get 1 Free (Cheese)
  - Soup + Bread → Half price bread
  - Butter → 33% off
- 📦 Order placement with Firebase
- 📜 Order history with search & sorting
- 🧪 Fully tested business logic (Jest)
- 🎨 Clean UI with Tailwind CSS

---

## 🧠 Tech Stack

- React 18 + TypeScript
- Redux Toolkit (State Management)
- Tailwind CSS (UI)
- Firebase Firestore (Database)
- Jest + React Testing Library (Testing)

---

## ⚙️ Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/akshay0497/shopping-basket-task.git
cd shopping-basket-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm start
```

👉 App runs on: [http://localhost:3000](http://localhost:3000)

---

## 🔥 Available Scripts

```bash
npm start      # Run development server
npm test       # Run test cases
npm run build  # Production build
```

---

## 🧮 Offer Logic (Core Feature)

The app automatically applies multiple offers:

| Product            | Offer            |
| ------------------ | ---------------- |
| 🧀 Cheese          | Buy 1 Get 1 Free |
| 🥣 Soup + 🍞 Bread | Bread at 50%     |
| 🧈 Butter          | 33% Discount     |

👉 Logic handled in:

```
src/utils/basketCalculations.ts
```

---

## 📦 Order Management

* Orders stored in **Firebase Firestore**
* Includes:

  * Items
  * Total
  * Savings
  * Timestamp

👉 Features:

* Order history view
* Search orders
* Sort by price/date/items

---

## 🧪 Testing

* Unit tests for:

  * Basket logic
  * Offers calculation
  * Redux slice

Run tests:

```bash
npm test
```

---

## 🔐 Firebase Setup

Update your Firebase config in:

```
src/firebase.ts
```

---

## 🚀 Deployment

Configured for Vercel:

```bash
npm run build
```

---

## 💡 Key Highlights

* Clean architecture (UI + Logic separation)
* Scalable discount system
* Production-ready UI
* Real-world shopping flow

## 👨‍💻 Author

**Akshay Kumar Gupta**
