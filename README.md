# Authentication and User Management System Documentation

This documentation provides a detailed explanation of the authentication and user management system. The system is built using Node.js, Express, MongoDB, and various utility functions for handling OTPs, tokens, passkeys, and email services.

---

## Table of Contents

1. [Introduction](#introduction)
2. [File Structure](#file-structure)
3. [Email Service](#email-service)
4. [Database Connection](#database-connection)
5. [User Controller](#user-controller)
6. [Authentication Controller](#authentication-controller)
7. [Authentication Middleware](#authentication-middleware)
8. [Models](#models)
   - [Otp Model](#otp-model)
   - [PassKey Model](#passkey-model)
   - [Token Model](#token-model)
   - [User Model](#user-model)
9. [Routes](#routes)
   - [Auth Routes](#auth-routes)
   - [User Data Routes](#user-data-routes)
10. [Utility Functions](#utility-functions)
    - [Token Utilities](#token-utilities)
    - [OTP Utilities](#otp-utilities)
    - [PassKey Utilities](#passkey-utilities)
11. [Conclusion](#conclusion)

---

## Introduction

The system is designed to handle user authentication, registration, and management. It uses OTP (One-Time Password) for email verification, passkeys for secure login, and JWT (JSON Web Tokens) for session management. The system also includes email services for sending OTPs and welcome emails.

---

## File Structure

The project is organized into several files, each serving a specific purpose:

- **`emailService.js`**: Handles sending emails using Nodemailer.
- **`database.js`**: Manages the connection to the MongoDB database.
- **`userController.js`**: Contains logic for fetching user data and managing passkeys.
- **`authController.js`**: Handles authentication-related logic like registration, login, OTP generation, and token management.
- **`auth.js`**: Middleware for authenticating requests using JWT.
- **`Otp.js`**: Mongoose model for storing OTPs.
- **`PassKey.js`**: Mongoose model for storing passkeys.
- **`Token.js`**: Mongoose model for storing JWT tokens.
- **`User.js`**: Mongoose model for user data.
- **`authRoutes.js`**: Express routes for authentication endpoints.
- **`userDataRoutes.js`**: Express routes for user data endpoints.
- **`tokenUtils.js`**: Utility functions for generating and verifying JWT tokens.
- **`otpUtils.js`**: Utility functions for generating and verifying OTPs.
- **`passKeyultis.js`**: Utility functions for generating and verifying passkeys.

---

## Email Service

### `emailService.js`

This file contains the `EmailService` class, which is responsible for sending emails using Nodemailer.

#### Key Functions:

- **`sendEmail`**: Sends an email with the provided options (to, subject, text, html, attachments).
- **`sendSimpleEmail`**: A helper function that sends a simple email with HTML content.

#### Why it exists:
The `EmailService` class abstracts the email-sending logic, making it reusable across the application. It uses environment variables for email credentials, ensuring security.

---

## Database Connection

### `database.js`

This file contains the `connectDB` function, which establishes a connection to the MongoDB database using Mongoose.

#### Key Functions:

- **`connectDB`**: Connects to the MongoDB database using the URI provided in the environment variables.

#### Why it exists:
This function centralizes the database connection logic, making it easy to connect to the database from anywhere in the application.

---

## User Controller

### `userController.js`

This file contains functions for fetching user data and managing passkeys.

#### Key Functions:

- **`userData`**: Fetches user data (email, firstName, lastName, etc.) based on the user ID.
- **`userPassKeys`**: Retrieves all passkeys associated with a user's email.
- **`userGenerateNewPasskeys`**: Generates new passkeys for a user and saves them to the database.

#### Why it exists:
These functions handle user-related operations, such as fetching user details and managing passkeys, which are essential for user authentication and security.

---

## Authentication Controller

### `authController.js`

This file contains functions for handling user registration, login, OTP generation, and token management.

#### Key Functions:

- **`register`**: Registers a new user, generates an OTP, and sends it via email.
- **`generateNewOtp`**: Generates a new OTP and sends it to the user's email.
- **`registerOtpVerification`**: Verifies the OTP during registration and generates JWT tokens.
- **`login`**: Handles user login and checks if the user is verified.
- **`generateLoginOtp`**: Generates an OTP for login and sends it via email.
- **`verifyLoginOtp`**: Verifies the OTP during login and generates JWT tokens.
- **`verifyLoginViaPassCode`**: Verifies the passkey during login and generates JWT tokens.
- **`refreshToken`**: Refreshes the access token using the refresh token.
- **`logout`**: Logs out the user by blacklisting the tokens.

#### Why it exists:
These functions handle the core authentication logic, including OTP-based verification, passkey-based login, and token management.

---

## Authentication Middleware

### `auth.js`

This file contains the `auth` middleware, which authenticates requests using JWT.

#### Key Functions:

- **`auth`**: Verifies the JWT token in the request header and checks if it is blacklisted.

#### Why it exists:
This middleware ensures that only authenticated users can access protected routes.

---

## Models

### `Otp.js`

This file defines the Mongoose model for storing OTPs.

#### Schema:
- **`otp`**: The OTP code (6-digit number).
- **`credentialType`**: The type of credential (email or phone).
- **`credential`**: The email or phone number associated with the OTP.
- **`expiresAt`**: The expiration time of the OTP (5 minutes).

#### Why it exists:
This model is used to store OTPs temporarily for email or phone verification.

---

### `PassKey.js`

This file defines the Mongoose model for storing passkeys.

#### Schema:
- **`email`**: The email associated with the passkey.
- **`passkey`**: The passkey string.

#### Why it exists:
This model is used to store passkeys for secure login.

---

### `Token.js`

This file defines the Mongoose model for storing JWT tokens.

#### Schema:
- **`userId`**: The user ID associated with the token.
- **`token`**: The JWT token.
- **`type`**: The type of token (refresh or blacklisted).
- **`expiresAt`**: The expiration time of the token.

#### Why it exists:
This model is used to manage refresh tokens and blacklisted tokens.

---

### `User.js`

This file defines the Mongoose model for storing user data.

#### Schema:
- **`firstName`**: The user's first name.
- **`lastName`**: The user's last name.
- **`email`**: The user's email (unique).
- **`phone`**: The user's phone number.
- **`age`**: The user's age.
- **`address`**: The user's address.
- **`dateOfBirth`**: The user's date of birth.
- **`password`**: The user's hashed password.
- **`verified`**: Whether the user is verified (default: false).

#### Why it exists:
This model is used to store user information and handle password hashing.

---

## Routes

### `authRoutes.js`

This file defines the Express routes for authentication endpoints.

#### Routes:
- **`POST /register`**: Registers a new user.
- **`POST /generate-new-register-opt`**: Generates a new OTP for registration.
- **`POST /register-otp-verification`**: Verifies the OTP during registration.
- **`POST /login`**: Logs in a user.
- **`POST /generate-login-otp`**: Generates an OTP for login.
- **`POST /login-via-passkey`**: Logs in a user using a passkey.
- **`POST /login-otp-verification`**: Verifies the OTP during login.
- **`POST /logout`**: Logs out a user.
- **`POST /refresh-token`**: Refreshes the access token.

#### Why it exists:
These routes expose the authentication functionality to the client.

---

### `userDataRoutes.js`

This file defines the Express routes for user data endpoints.

#### Routes:
- **`GET /user-dashboard-data`**: Fetches user data for the dashboard.
- **`GET /user-passkey`**: Fetches user passkeys.
- **`GET /generate-new-passkeys`**: Generates new passkeys for the user.

#### Why it exists:
These routes expose user-related functionality to the client.

---

## Utility Functions

### `tokenUtils.js`

This file contains utility functions for generating and verifying JWT tokens.

#### Key Functions:
- **`generateTokens`**: Generates access and refresh tokens.
- **`verifyToken`**: Verifies a JWT token.
- **`blacklistToken`**: Blacklists a token.

#### Why it exists:
These functions handle token generation, verification, and blacklisting.

---

### `otpUtils.js`

This file contains utility functions for generating and verifying OTPs.

#### Key Functions:
- **`generateOtp`**: Generates a 6-digit OTP and saves it to the database.
- **`verifyOtp`**: Verifies the OTP and deletes it from the database.

#### Why it exists:
These functions handle OTP generation and verification for email or phone authentication.

---

### `passKeyultis.js`

This file contains utility functions for generating and verifying passkeys.

#### Key Functions:
- **`generatePasskey`**: Generates a random passkey.
- **`saveGeneratedPasskey`**: Saves generated passkeys to the database.
- **`getGeneratedPasskeys`**: Retrieves passkeys for a user.
- **`verifyPasskey`**: Verifies a passkey and deletes it from the database.

#### Why it exists:
These functions handle passkey generation, storage, and verification for secure login.

---

## Conclusion

This documentation provides a comprehensive overview of the authentication and user management system. Each file, function, and module has been explained in detail, highlighting its purpose and functionality. This system is designed to be secure, scalable, and easy to maintain.