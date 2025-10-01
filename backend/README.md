# MediaHub Backend with MongoDB

## Prerequisites

1. **MongoDB**: Install MongoDB locally or use MongoDB Atlas
   - Local: Download from https://www.mongodb.com/try/download/community
   - Atlas: Create free cluster at https://cloud.mongodb.com

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start MongoDB (if using local installation):
```bash
mongod
```

3. Start the server:
```bash
npm start
```

## Features

- ✅ User registration with email validation
- ✅ Secure password hashing with bcrypt
- ✅ JWT authentication
- ✅ Role-based access (admin, editor, writer)
- ✅ Content management with MongoDB
- ✅ Media file uploads
- ✅ RESTful API endpoints

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Content Management
- `GET /api/content` - Get all content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content

### Media Management
- `GET /api/media` - Get all media
- `POST /api/media/upload` - Upload media file

## Environment Variables

Create `.env` file:
```
JWT_SECRET=your-super-secret-jwt-key
PORT=8000
MONGODB_URI=mongodb://localhost:27017/mediahub
```

## Database Schema

### Users Collection
- email (unique)
- password (hashed)
- name
- role (admin/editor/writer)
- timestamps

### Content Collection
- title
- body
- status (draft/scheduled/published)
- authorId (reference to User)
- publishDate
- tags
- timestamps

### Media Collection
- name
- url
- type (image/video/document)
- size
- uploadedBy (reference to User)
- timestamps