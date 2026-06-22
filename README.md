# User Management Dashboard

A modern React-based User Management system with CRUD operations, search, filtering, sorting, and pagination. Built using functional components and clean state management.

---

## 🚀 Features

- View list of users
- Search users by name, email, or department
- Advanced filter panel (first name, last name, email, department)
- Sort users (A-Z / Z-A)
- Add new user
- Edit existing user
- Delete user
- Pagination with page size control
- Responsive UI (mobile + desktop)

---

## 🛠️ Tech Stack

- React.js (Functional Components)
- JavaScript (ES6+)
- Tailwind CSS
- React Icons
- JSON Placeholder API (mock backend)

---

## 📁 Project Structure
```
src/
│
├── components/
│ ├── UserCard
│ ├── UserForm
│ ├── UserToolbar
│
├── pages/
│ └── UsersPage.jsx
│
├── services/
│ └── userService.js
│
└── App.css
└── App.jsx
└── Main.jsx

```

---

## ⚙️ Features Breakdown

### 1. User Listing
Displays users fetched from API with clean card UI.

### 2. Search
Global search across:
- Name
- Email
- Department

### 3. Filtering
Expandable filter panel:
- First Name
- Last Name
- Email
- Department

Filters are optional and can be combined.

### 4. Sorting
- Ascending (A-Z)
- Descending (Z-A)

### 5. Pagination
- Page-based navigation
- Prev / Next controls
- Adjustable users per page (5, 10, 25, 50, 100)

### 6. CRUD Operations
- Add user
- Edit user
- Delete user

---

## ▶️ How to Run

```bash
# install dependencies
npm install

# start development server
npm run dev