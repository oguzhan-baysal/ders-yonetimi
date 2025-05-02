# 📝 API Dokümantasyonu

Bu dokümantasyon, projenin API endpoint'lerini ve kullanımlarını detaylı olarak açıklar.

## 🌐 API Base URL

```
http://localhost:5000/api
```

## 🔑 Authentication

### Register

```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "student|admin",
  "firstName": "string",
  "lastName": "string",
  "birthDate": "string (YYYY-MM-DD)"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

## 👨‍🎓 Students

### Get All Students

```http
GET /students
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `search`: string
- `sort`: string (field:asc|desc)

**Response:**
```json
{
  "students": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "birthDate": "string",
      "enrolledCourses": number
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

### Get Student by ID

```http
GET /students/:id
```

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "birthDate": "string",
  "enrolledCourses": [
    {
      "id": "string",
      "code": "string",
      "name": "string"
    }
  ]
}
```

## 📚 Courses

### Create Course

```http
POST /courses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "string",
  "name": "string",
  "description": "string",
  "credits": number,
  "department": "string",
  "semester": "string",
  "instructor": "string",
  "capacity": number
}
```

**Response:**
```json
{
  "id": "string",
  "code": "string",
  "name": "string",
  "description": "string",
  "credits": number,
  "department": "string",
  "semester": "string",
  "instructor": "string",
  "capacity": number,
  "enrolledStudents": number
}
```

### Get All Courses

```http
GET /courses
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `search`: string
- `department`: string
- `semester`: string
- `sort`: string (field:asc|desc)

**Response:**
```json
{
  "courses": [
    {
      "id": "string",
      "code": "string",
      "name": "string",
      "description": "string",
      "credits": number,
      "department": "string",
      "semester": "string",
      "instructor": "string",
      "capacity": number,
      "enrolledStudents": number
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

## ✍️ Enrollments

### Create Enrollment

```http
POST /enrollments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "studentId": "string",
  "courseId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "student": {
    "id": "string",
    "username": "string"
  },
  "course": {
    "id": "string",
    "code": "string",
    "name": "string"
  },
  "enrollmentDate": "string"
}
```

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "message": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## 📋 API Conventions

### Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (for protected routes)

### Response Format
- Success responses include HTTP status 2xx
- Error responses include HTTP status 4xx or 5xx
- All responses are in JSON format

### Pagination
- Page numarası 1'den başlar
- Default limit: 10
- Maximum limit: 100

### Sorting
- Format: `field:asc` veya `field:desc`
- Örnek: `sort=createdAt:desc`

### Filtering
- Query parameters ile filtering
- Multiple filters desteklenir
- Case-insensitive arama

### Date Format
- ISO 8601 format
- Timezone: UTC
- Format: YYYY-MM-DDTHH:mm:ss.sssZ

## 🔍 API Versioning

Current version: v1
Base path: `/api/v1`

### Version History
- v1: Initial release
  - Basic CRUD operations
  - JWT authentication
  - Role-based authorization 