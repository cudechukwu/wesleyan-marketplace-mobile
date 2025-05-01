📌 Wesleyan Marketplace

📢 Project Overview
The Wesleyan Marketplace is a campus-based online platform designed to facilitate student-to-student transactions. Students can buy, sell, or trade items such as textbooks, dorm furniture, and essential supplies. The marketplace also provides a space for students to offer or request services such as tutoring, ridesharing, and freelance work.

🏆 Features
- Swap & Sell: List and find second-hand items from fellow students.
- Student Services: Offer and request tutoring, rides, and more.
- Exclusive Deals: Access special student discounts.
- Testimonials: Read feedback from students about their experiences.
- Responsive Design: Fully optimized for mobile and desktop.
- Secure Transactions: Provides a safe and transparent way to exchange goods and services.

👥 Team Members
- Deborah-Gifty Afia Lalude (@dlalude)
- Chukwudi (@Chukwudi)

Chukwudi | 100%

🚀 How to Run the Project 
Viewing the Deployed Site
The project is deployed on GitHub Pages and can be accessed at:
(https://dlalude.github.io/wesleyan-marketplace/)

## 🧪 Homework 4: Unit Testing (PHP Backend)

### ✅ Unit Testing Steps

1. **Install PHPUnit (if not already installed):**
   - Locally:  
     ```bash
     composer require --dev phpunit/phpunit
     ```
   - Or globally:  
     ```bash
     brew install phpunit
     ```

2. **Save your test file:**  
   Save the test code as `BackendTest.php` inside the `tests/` directory.

3. **Navigate to the project folder in terminal:**
   ```bash
   cd /path/to/your/project

4. **Run the tests**
   - If composer:  
     ```bash
     ./vendor/bin/phpunit tests/BackendTest.php
     ```
   - If globally:  
     ```bash
     phpunit tests/BackendTest.php
     ```
## 🧪 Problem 2 – Using AI to Write Tests

I used ChatGPT as a tool to help design and write my PHPUnit test cases. To do this, I first provided the AI with a detailed description of my project, including the structure of the backend and the purpose of key files like `register.php`, `login.php`, and `listings.php`.

Then I asked:

> “Can you write PHPUnit tests to check if these endpoints work correctly?”

The AI returned well-structured test functions that served as a solid foundation. I then adapted the generated tests to match my specific implementation — including dynamically generated test users — and refined the logic to ensure compatibility with my backend responses.

---

### 🔁 How to Reproduce

You can follow the same steps:

1. Visit [chat.openai.com](https://chat.openai.com)
2. Use this prompt:

    ```
    Write PHPUnit tests for a PHP backend that includes login, registration, and listing endpoints.
    ```

3. Provide your specific API structure (e.g., expected requests and responses)
4. Copy, adapt, and refine the generated test code into your project



Homework 3 instructions.. 

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started
1. Download full zip and add wesleyan-marketplace folder to XAMPP. Setting up backend

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
    npx expo start
   ```

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Important Note: 

I was unable to test the app on an android environment since android studio didnt respond on my laptop despite deleting and reinstalling several times (I went to TA Dominik Dadak to see if he could help but unfortunately couldn't).
Project works perfectly on IOS, so if there is an issue testing on android let me know.

Recording of Mobile Testing:
https://drive.google.com/file/d/1ZWHKpTALnzXljzibS1D7--rZl2_xZEvF/view?usp=sharing

## 📡 REST API

This section documents the REST API endpoints for the Wesleyan Marketplace backend (PHP + MySQL).

---

### 🧾 Authentication

#### `POST /login.php` — Log in a user  
**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

---

#### `POST /register.php` — Register a new user  
**Request Body:**
```json
{
  "username": "janedoe",
  "password": "longsecurepassword",
  "confirm_password": "longsecurepassword"
}
```

---

#### `GET /logout.php` — Log out user  
Destroys the current session and redirects to login.

---

### 📦 Listings

#### `GET /listings.php` — Fetch all listings  
**Success Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "item_name": "Desk",
      "description": "Wooden desk",
      "price": 50.00,
      "username": "johndoe"
    },
    ...
  ]
}
```

---

#### `POST /create.php` — Create a new listing  
**Request Body:**
```json
{
  "username": "johndoe",
  "item_name": "Chair",
  "description": "Black plastic chair",
  "price": 20.00
}
```

---

#### `POST /update.php` — Update a listing (owner only)  
**Request Body:**
```json
{
  "id": 3,
  "item_name": "Lamp",
  "description": "New desk lamp",
  "price": 12.99
}
```

---

#### `POST /delete.php` — Delete a listing (owner only)  
**Request Body:**
```json
{
  "id": 3
}
```

<img width="1440" alt="postScreenshot" src="https://github.com/user-attachments/assets/374cbd93-8ab5-41eb-9b4e-59e060bf445f" />
**********
<img width="1440" alt="Screenshot 2025-04-28 at 11 28 23" src="https://github.com/user-attachments/assets/44a01055-f162-41c8-92dd-e03f04069313" />


