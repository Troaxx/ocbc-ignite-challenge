# Bank Manager Application 
<img src="/public/assets/images/dy-bank-high-resolution-logo-black-transparent.png" alt="App Icon" width="160" height="100">

| Username | Password    |
| -------- | ----------- |
| eladtester@test.test    | elad12345678   |


## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [Environment Variables](#environment-variables)
7. [Advanced Features](#advanced-features)
8. [Challenges Faced](#challenges-faced)
9. [Known Bugs](#known-bugs)
10. [Future Improvements](#future-improvements)
11. [Links](#links)
12. [Screenshots](#screenshots)

## Overview

The Bank Manager Application is a robust, web-based platform designed for bank administrators to efficiently manage their clients and handle various banking transactions. This application is built using React and Firebase, offering a secure and streamlined experience for banking operations.

## Features

### Core Functionality:
1. **Admin Authentication**
   - Secure Firebase authentication for admin login, ensuring only authorized access to client management features.

2. **Client Management**
   - Admins can add, edit, and delete client information with ease, maintaining a comprehensive database of bank clients.

3. **Transaction Management**
   - Perform essential banking transactions:
     - **Withdrawals**: Admins can withdraw money from client accounts.
     - **Deposits**: Deposit cash into client accounts.
     - **Transfers**: Transfer funds between client accounts.
     - **Credit Management**: Adjust the credit limits for clients.

4. **Routing and Navigation**
   - Smooth navigation across various sections of the application, including client list, transaction management, and account details.

### Enhanced Features:
1. **Form Validation and Error Handling**
   - Strong validation mechanisms on all forms to ensure accurate data entry and provide real-time feedback.

2. **Real-time Data Updates**
   - Instant updates to client information and transaction records using Firebase's real-time database.

3. **Loading Indicators and Notifications**
   - Use of loaders to enhance user experience during data operations.
   - Toastify notifications for actions like form submissions, CRUD operations, and error messages.

## Tech Stack

- **Frontend**: React, JSX, HTML, CSS, JavaScript
- **Libraries**: Firebase, React Router, React Icons, React Select, React Toastify
- **State Management**: React State and Context API
- **Backend**: Firebase for authentication and real-time data storage

## Setup and Installation

To set up and run the project locally, follow these steps:

1. **Clone the repository from GitHub**:
   - `git clone https://github.com/DanielYehezkely/bank-management-react`

2. **Navigate to the project directory**:
   - `cd bank-manager`

3. **Install the necessary dependencies**:
   - `npm install`

4. **Set up Firebase configuration**:
   - Create a `.env` file in the root directory.
   - Add your Firebase configuration variables (see [Environment Variables](#environment-variables)).

5. **Start the development server**:
   - `npm start`

6. **Open the app in your web browser**:
   - Visit `http://localhost:3000`

## Usage

1. **Admin Login**:
   - Access the admin login page.
   - Enter your credentials to log in and access the management dashboard.

2. **Managing Clients**:
   - View a list of all clients in the bank.
   - Add new clients, edit existing client details, or delete clients as needed.

3. **Performing Transactions**:
   - Navigate to the transactions page to withdraw, deposit, transfer funds, or change the credit limit for a client.

## Environment Variables

The application requires a `.env` file to store environment-specific configurations.

1. **Create a `.env` file**:
   - Copy the provided `.env.template` file to `.env`:
     - `cp .env.template .env`

2. **Edit the `.env` file**:
   - Fill in the required environment variables. Below are examples of variables you might need:
     ```
     VITE_API_KEY=YOUR_FIREBASE_API_KEY
     VITE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
     VITE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
     VITE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
     VITE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
     VITE_APP_ID=YOUR_FIREBASE_APP_ID
     VITE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
     ```

3. **Common variables**:
   - `VITE_API_KEY`: Your Firebase API key.
   - `VITE_AUTH_DOMAIN`: Your Firebase authentication domain.
   - `VITE_PROJECT_ID`: Your Firebase project ID.
   - `VITE_STORAGE_BUCKET`: Your Firebase storage bucket.
   - `VITE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
   - `VITE_APP_ID`: Your Firebase app ID.
   - `VITE_MEASUREMENT_ID`: Your Firebase measurement ID.

## Advanced Features

1. **Real-time Client Updates**:
   - The app syncs client data in real-time with Firebase, ensuring the admin always has the latest information.

2. **Enhanced Form Validations**:
   - Robust validation rules ensure accurate data entry, with instant feedback for any errors.

3. **Detailed Transaction Logs**:
   - Each transaction is logged and displayed with details, providing a clear history of all banking activities.

4. **Firebase Authentication**:
   - Secure admin login and session management using Firebase Authentication.

## Challenges Faced

1. **Handling Real-time Data**:
   - Ensuring smooth and consistent updates across the application while interacting with Firebase’s real-time database.

2. **Complex Form Management**:
   - Implementing form validations and handling multiple types of transactions required careful planning and coding.

3. **User Authentication**:
   - Setting up secure and seamless authentication for admin access involved configuring Firebase and handling potential security issues.

## Known Bugs

- **Responsive Layout**: Certain components may not render optimally on very small screens. Improvements are planned for better mobile support.

- **Firebase Limits**: Occasionally, Firebase limits can cause delays in data operations during peak usage.

## Future Improvements

1. **Enhanced Mobile Support**:
   - Improve the responsive design for better usability on mobile devices.

2. **User Roles and Permissions**:
   - Extend the authentication system to support different user roles and permissions.

3. **Detailed Analytics and Reporting**:
   - Add comprehensive analytics and reporting features to provide insights into bank operations and client activity.

## Links

- **GitHub Repository**: [Bank Manager App](https://github.com/DanielYehezkely/bank-management-react)
- **Live Deployment**: [Netlify Link](https://dyz-bank-manager-react.netlify.app/)

## Screenshots

### Admin Screenshots

1. **Login Admin**
   ![Admin Dashboard](/public/assets/readme-images/readme-login.png)
   ***
2. **Home Page**
   ![Client List](/public/assets/readme-images/readme-homePage.png)
   ***
3. **Client Manage**
   ![Client Details](/public/assets/readme-images/readme-clientManage.png)
   ***
4. **Client Details**
   ![Transaction Management](/public/assets/readme-images/readme-clientPage.png)
   ***
5. **Add Client**
   ![Transaction Management](/public/assets/readme-images/readme-addClient.png)
   ***
6. **Transaction Management**
   ![Transaction Management](/public/assets/readme-images/readme-transactionsPage.png)
   ***
7. **Transactions Modal**
   ![Transaction Management](/public/assets/readme-images/readme-modal.png)
   ***