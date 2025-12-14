# Crack-ed

Crack-ed is a full-stack web application designed to... (A more detailed description will go here once the project's purpose is clearer). It features a modern React frontend and a robust Flask backend.

## Features

### User-Facing Features

*   **Authentication:**
    *   User registration with OTP verification (mobile number).
    *   User login with OTP verification.
    *   Session management with tokens.
    *   Logout functionality.
*   **Application Process:**
    *   Multi-step application form for the "AURUM Banker Program".
    *   Personal details, address, education, and job experience sections.
    *   File uploads for documents like passport photo, Aadhar card, PAN card, certificates, and resume.
    *   Application status tracking (e.g., "Apply Now", "In Progress", "Completed", "Selected").
    *   Ability to view and update the application.
*   **Payments:**
    *   Integration with Razorpay for fee payments.
    *   Ability to create payment orders and handle payment success/failure.
    *   View payment history.
    *   Downloadable PDF payment receipts.
*   **Loan applications:**
    *   Users can apply for loans.
    *   Users can select a loan provider.
*   **Callback Request:**
    *   Users can request a callback.

### Admin-Facing Features

*   **Admin Authentication:**
    *   Separate login for admin users.
    *   Role-based access control (e.g., 'admin', 'ops').
    *   Admin/user management: create, update, delete, and toggle activation status of admin users.
    *   Password reset functionality for admins.
*   **Application Management:**
    *   Dashboard to view all user applications with pagination and search functionality.
    *   View detailed information for each application.
    *   Update application status and other details.
    *   Bulk delete and bulk download (as Excel) of applications.
*   **Payment Management:**
    *   View a detailed payment history for all users.
    *   Search and filter payment records.
    *   Download payment receipts for individual transactions.
    *   Manually update payment details (e.g., cheque/cash payments).
*   **File Access:**
    *   Securely view uploaded documents and images for each application.
*   **Loan management:**
    *   View loan applications.
    *   Update loan application status.

## Technologies Used

### Frontend
*   **React:** A JavaScript library for building user interfaces.
*   **Bootstrap:** A powerful, feature-packed frontend toolkit for building responsive designs.
*   **Axios:** Promise based HTTP client for the browser and node.js.
*   **React Router DOM:** Declarative routing for React.
*   **SweetAlert2:** A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes.

### Backend
*   **Flask:** A micro web framework for Python.
*   **SQLAlchemy:** SQL toolkit and Object Relational Mapper (ORM) for Python.
*   **Flask-Migrate (Alembic):** Database migrations for Flask applications using Alembic.
*   **Flask-Login:** Provides user session management for Flask.
*   **Flask-CORS:** A Flask extension for handling Cross Origin Resource Sharing (CORS), making cross-domain AJAX possible.
*   **Flask-WTF:** Simple integration of Flask and WTForms.
*   **Marshmallow:** An ORM/ODM/framework-agnostic library for converting complex objects to and from native Python datatypes.
*   **psycopg2-binary:** PostgreSQL database adapter for Python.
*   **Razorpay:** For payment gateway integration.
*   **Google Cloud Vision (potential):** For image analysis or OCR capabilities.
*   **Gspread (potential):** For interacting with Google Sheets.
*   **PyJWT:** For JSON Web Token implementation.
*   **PyMongo (potential):** MongoDB driver for Python.

## Setup Instructions

### Prerequisites
*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   Python 3.8+
*   pip (comes with Python)
*   A PostgreSQL database instance (or other supported database)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd crack-ed-backend
    ```
2.  **Create a Python virtual environment:**
    ```bash
    python -m venv venv
    ```
3.  **Activate the virtual environment:**
    *   **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    *   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
4.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Configure Environment Variables:**
    Create a `.env` file in the `crack-ed-backend` directory and add your configuration variables. (e.g., `DATABASE_URL`, `SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, etc.).
    A `.flaskenv` file might also be present for Flask-specific environment variables.

6.  **Database Migrations:**
    Initialize and upgrade your database.
    ```bash
    flask db init # Only if migrations folder doesn't exist
    flask db migrate -m "Initial migration" # Or a descriptive message
    flask db upgrade
    ```
    *Note: Ensure your database connection string in `.env` is correct before running migrations.*

7.  **Run the Backend Server:**
    ```bash
    flask run
    ```
    The backend server should now be running, typically on `http://127.0.0.1:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd crack-ed-frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the `crack-ed-frontend` directory for frontend-specific environment variables (e.g., `REACT_APP_BACKEND_URL=http://127.0.0.1:5000`).

4.  **Run the Frontend Development Server:**
    ```bash
    npm start
    ```
    The frontend application should open in your browser, typically on `http://localhost:3000`.

## Usage
(To be filled in: How to use the application, e.g., sign up, log in, navigate through features.)

## Project Structure
*   `crack-ed-backend/`: Contains the Flask backend application, including API endpoints, database models, migrations, and utility scripts.
*   `crack-ed-frontend/`: Contains the React frontend application, including UI components, pages, styles, and asset files.

## Contributing
(Guidelines for contributing, if applicable.)

## License
(License information, if applicable.)
