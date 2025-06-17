# Salary Management Application

## Project Overview

The Salary Management Application is a full-stack web application designed to manage user salaries, with distinct interfaces for administrators and regular users. The application features an administrative panel for managing user data and a public interface for users to submit their salary details.

## Technologies Used

This project leverages a modern web development stack to provide a robust and scalable solution:

### Frontend
*   **Next.js:** A React framework for building server-rendered and statically generated web applications, providing excellent performance and developer experience.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **TypeScript:** For type-safe JavaScript development.

### Backend
*   **Laravel:** A powerful PHP web application framework known for its elegant syntax and robust features, used for building the API.
*   **PHP:** The server-side scripting language.
*   **Composer:** PHP dependency management.

### Database
*   **PostgreSQL / MySQL / SQLite:** Configured to be flexible, supporting different relational databases based on the environment. 

### Other Tools & Concepts
*   **Git:** Version control system.
*   **GitHub:** For source code hosting and CI/CD (GitHub Actions).
*   **Nginx / Apache:** (For production web server on backend).
*   **npm / Yarn:** JavaScript package managers.

## Features

The application provides the following core functionalities:

*   **Admin Login/Register:** Secure authentication for administrators to access privileged sections.
*   **Admin Dashboard:** A dedicated interface for administrators to manage user accounts, salary data, and other administrative tasks.
*   **User Salary Submission:** A user-facing portal where individuals can submit their salary information.
*   **API Endpoints:** A comprehensive set of RESTful APIs built with Laravel to support data operations for both frontend interfaces.

## Local Development Setup

To get a local copy up and running, follow these steps:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   PHP (8.1 or higher recommended)
*   Composer
*   Git
*   A local database server (e.g., MySQL, PostgreSQL, or just rely on SQLite for simplicity)

### 1. Clone the Repository

First, clone the project from GitHub:

```bash
git clone https://github.com/AlphonceMG/salary-app.git
cd salary-app
```

### 2. Frontend Setup (`frontend/`)

Navigate into the `frontend` directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install # or yarn install
```

Start the Next.js development server:

```bash
npm run dev # or yarn dev
```

The frontend application should now be accessible at `http://localhost:3000` (or similar).

### 3. Backend Setup (`backend/`)

Open a **new** terminal window and navigate into the `backend` directory:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create a copy of the environment file:

```bash
cp .env.example .env
```

Generate an application key (required by Laravel):

```bash
php artisan key:generate
```

### 4. Database Setup (Backend)

Configure your database connection in the `backend/.env` file. For local development, you might start with SQLite (Laravel's default for `.env.example` if not changed) or configure MySQL/PostgreSQL.

**Using SQLite (Simplest for local development):**

No extra server needed. Just ensure your `backend/.env` has your environment variables:
