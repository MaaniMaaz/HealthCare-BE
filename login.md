# HealthCare Email Verification Login System

## Overview
This document provides comprehensive details about the email verification login system implemented for the HealthCare application. The system uses passwordless authentication where users receive a 6-digit verification code via email to log in.

## 🚀 Features
- **Passwordless Authentication**: No passwords required, just email verification
- **Automatic User Registration**: New users are automatically registered on first login
- **Rate Limiting**: Protection against spam and brute force attacks
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Email Templates**: Professional HTML email templates
- **Social Authentication**: Support for Google and Facebook login
- **Role-based Access**: Support for user, doctor, and admin roles
- **Security**: Code expiration, attempt limits, and secure token handling

## 📋 API Endpoints

### Base URL: `http://localhost:8001`

### 1. Request Login Code
**POST** `/auth/request-login-code`

Sends a 6-digit verification code to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "data": {
    "message": "Verification code sent to your email",
    "email": "user@example.com",
    "expiresIn": "5 minutes"
  }
}
```

**Response (Rate Limited):**
```json
{
  "success": false,
  "message": "Too many requests. Please try again in 15 minutes"
}
```

### 2. Verify Login Code
**POST** `/auth/verify-login-code`

Verifies the code and logs in the user (or creates new account).

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "name": "John Doe",
  "deviceToken": "optional_device_token"
}
```

**Response (Success - Existing User):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": null,
      "profileImage": null,
      "role": "user",
      "lastLoginAt": "2025-07-31T18:59:59.999Z"
    },
    "isNewUser": false
  }
}
```

**Response (Success - New User):**
```json
{
  "success": true,
  "message": "Account created and logged in successfully",
  "data": {
    "message": "Account created and logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": null,
      "profileImage": null,
      "role": "user",
      "lastLoginAt": "2025-07-31T18:59:59.999Z"
    },
    "isNewUser": true
  }
}
```

### 3. Refresh Token
**POST** `/auth/refresh-token`

Refreshes the JWT token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Current User
**GET** `/auth/me`

Gets the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "profileImage": null,
    "role": "user",
    "lastLoginAt": "2025-07-31T18:59:59.999Z",
    "createdAt": "2025-07-31T10:00:00.000Z"
  }
}
```

### 5. Update Profile
**PUT** `/auth/update-profile`

Updates the user's profile information.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "user@example.com",
    "phone": "+1234567890",
    "profileImage": null,
    "role": "user"
  }
}
```

### 6. Logout
**POST** `/auth/logout`

Logs out the user (clears device token if requested).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body (Optional):**
```json
{
  "clearDeviceToken": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 7. Social Authentication
**POST** `/auth/social-auth`

Authenticates users via social providers (Google, Facebook).

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "provider": "google",
  "deviceToken": "optional_device_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": null,
      "profileImage": null,
      "role": "user",
      "lastLoginAt": "2025-07-31T18:59:59.999Z"
    },
    "isNewUser": false
  }
}
```

## 🔐 Authentication Flow

### Frontend Login Flow
1. **User enters email** on login page
2. **Call** `POST /auth/request-login-code` with email
3. **Show message** "Check your email for verification code"
4. **User enters code** from email
5. **Call** `POST /auth/verify-login-code` with email and code
6. **Store tokens** (JWT and refresh token) in secure storage
7. **Redirect** to dashboard/home page

### Token Management
- **Access Token**: Valid for 7 days (configurable)
- **Refresh Token**: Valid for 30 days (configurable)
- **Auto-refresh**: Use refresh token to get new access token when expired
- **Logout**: Clear tokens from storage

## 🛡️ Security Features

### Rate Limiting
- **3 requests per 15 minutes** per email address
- Prevents spam and brute force attacks
- Returns 429 status with retry-after information

### Code Security
- **6-digit numeric codes** (100000-999999)
- **5-minute expiration** time
- **Maximum 3 attempts** per code
- **Auto-deletion** of expired codes
- **One-time use** codes

### JWT Security
- **Secure secrets** for signing tokens
- **Different secrets** for access and refresh tokens
- **Expiration times** to limit token lifetime
- **User validation** on each request

## 📧 Email Configuration

### SendGrid Setup
1. **Create SendGrid account** at https://sendgrid.com
2. **Generate API key** in SendGrid dashboard
3. **Add API key** to `.env` file:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   ```

### Email Templates
- **Login Code Email**: Professional template with verification code
- **Welcome Email**: Sent to new users after registration
- **HTML Templates**: Responsive design with healthcare branding

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (required, unique),
  phone: String,
  profileImage: String,
  role: String (user/admin/doctor),
  isActive: Boolean,
  lastLoginAt: Date,
  deviceToken: String,
  provider: String (email/google/facebook),
  createdAt: Date,
  updatedAt: Date
}
```

### VerificationCode Model
```javascript
{
  email: String (required),
  code: String (required),
  type: String (login/password_reset),
  expiresAt: Date (5 minutes from creation),
  attempts: Number (max 3),
  isUsed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## ⚙️ Environment Variables

Add these to your `.env` file:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Server
PORT=8001

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL=your_sender_email@domain.com
```

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Email is required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access token has expired"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again in 15 minutes"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🧪 Testing the API

### Using Postman/Insomnia

1. **Request Login Code:**
   ```
   POST http://localhost:8001/auth/request-login-code
   Content-Type: application/json
   
   {
     "email": "test@example.com"
   }
   ```

2. **Check Email** for verification code

3. **Verify Code:**
   ```
   POST http://localhost:8001/auth/verify-login-code
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "code": "123456",
     "name": "Test User"
   }
   ```

4. **Use Token** for authenticated requests:
   ```
   GET http://localhost:8001/auth/me
   Authorization: Bearer your_jwt_token_here
   ```

## 🔧 Frontend Integration

### JavaScript Example
```javascript
// Request login code
async function requestLoginCode(email) {
  const response = await fetch('/auth/request-login-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  const data = await response.json();
  return data;
}

// Verify login code
async function verifyLoginCode(email, code, name) {
  const response = await fetch('/auth/verify-login-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code, name }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store tokens
    localStorage.setItem('accessToken', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  }
  
  return data;
}

// Make authenticated requests
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      return makeAuthenticatedRequest(url, options);
    } else {
      // Redirect to login
      window.location.href = '/login';
    }
  }
  
  return response.json();
}

// Refresh access token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) return false;
  
  try {
    const response = await fetch('/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  return false;
}
```

## 📱 Mobile App Integration

### React Native Example
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store tokens securely
await AsyncStorage.setItem('accessToken', token);
await AsyncStorage.setItem('refreshToken', refreshToken);

// Retrieve tokens
const token = await AsyncStorage.getItem('accessToken');

// Clear tokens on logout
await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
```

## 🐛 Troubleshooting

### Common Issues

1. **"MONGO_URI is undefined"**
   - Check `.env` file path in `dotenv.config()`
   - Ensure `.env` file is in project root

2. **"SendGrid API key not found"**
   - Add `SENDGRID_API_KEY` to `.env` file
   - Verify SendGrid account and API key

3. **"Verification code expired"**
   - Codes expire after 5 minutes
   - Request a new code

4. **"Too many requests"**
   - Rate limit is 3 requests per 15 minutes
   - Wait before requesting new code

5. **"Invalid token"**
   - Token may be expired or malformed
   - Use refresh token to get new access token

## 🚀 Deployment Considerations

### Production Setup
1. **Use strong JWT secrets** (at least 32 characters)
2. **Set up proper CORS** for your frontend domain
3. **Use HTTPS** for all API calls
4. **Set up proper logging** for security events
5. **Configure rate limiting** based on your needs
6. **Set up monitoring** for failed login attempts

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_very_long_and_secure_refresh_secret_key_here
SENDGRID_API_KEY=your_production_sendgrid_api_key
```

## 📞 Support

For any issues or questions regarding the authentication system:

1. Check this documentation first
2. Review error messages and logs
3. Test with Postman/Insomnia
4. Check environment variables
5. Verify database connection

---

**Last Updated:** July 31, 2025  
**Version:** 1.0.0  
**Author:** HealthCare Development Team