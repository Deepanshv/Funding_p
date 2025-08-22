# CrowdFund Platform 🚀

A modern, production-ready crowdfunding platform built with React, Vite, and JavaScript. This application features admin-controlled campaigns and a seamless UPI-based donation system, catering specifically to the Indian market. All demo data has been cleared, making this a clean slate for real-world deployment.

---

## 🌟 Overview

| **Status** | |
|---|---|
| **Version** | `1.0.0` (Production Ready) |
| **Framework** | React.js |
| **Styling** | Inline Styles / CSS Modules (as per project structure) |
| **Payment** | UPI (India specific) |
| **Data** | LocalStorage |

---

## ⚡ Key Features

✅ **Admin-Controlled Content:** Only a designated administrator can create, edit, or delete campaigns, ensuring quality control and content integrity.
✅ **UPI-Based Donations:** Experience a secure and instant payment system using QR codes, compatible with all major Indian UPI apps like PhonePe, Paytm, and GPay.
✅ **Real-Time Updates:** Donations and campaign progress update instantly across all dashboards, providing live feedback without page refreshes.
✅ **Interactive Analytics Dashboard:** Gain valuable insights with live statistics and an interactive map of India, showcasing the geographic distribution of campaigns and performance metrics.
✅ **Favorites System:** Easily bookmark campaigns you want to follow or contribute to later, ensuring you never lose track of causes important to you.
✅ **Responsive Design:** The platform is fully optimized for a seamless experience across desktop, tablet, and mobile devices.

---

## 🛠️ How to Get Started

Follow these simple steps to get your local development environment up and running.

#### Prerequisites

* **Node.js**: Ensure you have Node.js (v18 or higher recommended) installed.

* **npm** (Node Package Manager) or **yarn**: Used for managing project dependencies.

#### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Deepanshv/Funding_p.git](https://github.com/Deepanshv/Funding_p.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Funding_p
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```

#### Running the Application

To start the development server and view the application in your browser:

```bash
npm run dev
# or if you use yarn
# yarn dev
```

The application will typically be available at `http://localhost:5174`.

---

## 👥 User Flows & Credentials

This application supports two primary user roles: **Regular Users** and **Administrators**.

### 1. Regular User Experience

A user who is not logged in as an administrator.

* **Experience:** Users can browse through active campaigns, view their detailed descriptions, make secure UPI donations, and bookmark campaigns as favorites for easy access.

* **Initial State:** Upon their first visit, the dashboard will display an an "empty campaigns" state until an administrator creates and publishes active campaigns.

### 2. Administrator Workflow

The privileged user with comprehensive control over the platform's content and data.

* **Login Access:**

    * **URL:** `http://localhost:5174/admin-login`

    * **Username:** `admin`

    * **Password:** `admin123`

* **Key Actions:** Administrators can effortlessly create, manage, edit, and delete campaigns. They also have the crucial ability to clear all platform data from the database, allowing for a fresh start when needed.

---

## 📁 Code Structure

The project is organized into a clear and modular structure for maintainability and scalability:

* `src/pages/`: Contains the primary React components for each distinct page of the application (e.g., `Analytics.jsx`, `Admin.jsx`).

* `src/components/`: Houses reusable and modular React components that are utilized across various parts of the application.

* `src/context/`: Manages the global state and data flow, ensuring consistent data access throughout the application.

* `public/`: Stores static assets such as `index.html` and other public resources.

---

