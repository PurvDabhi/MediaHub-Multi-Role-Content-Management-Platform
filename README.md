# MediaHub - Multi-Role Content Management Platform

A full-stack content management platform for media companies, enabling editors, writers, and admins to manage, schedule, and publish content. Built with React, Redux Toolkit, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Role-Based Access Control**: Tailored dashboards and permissions for admins, editors, and writers
- **Rich Content Editor**: WYSIWYG editor with ReactQuill, media embedding, and autosave
- **Advanced Media Handling**: Upload, preview, and manage images, videos, and documents
- **Content Management**: Create, edit, update, and view content with proper ownership controls
- **User Management**: Admin-only user management interface
- **Authentication**: JWT-based authentication with persistent sessions
- **Responsive Design**: Fully responsive UI for desktop and mobile

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Rich Text Editor**: ReactQuill
- **File Upload**: React Dropzone
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Icons**: Heroicons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MediaHub-Multi-Role-Content-Management-Platform
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Create environment files:
```bash
# Frontend
cp .env.example .env

# Backend
cd backend
cp .env.example .env
```

5. Update environment variables:

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000/api
```

**Backend `.env`:**
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/mediahub
JWT_SECRET=your-secret-key
```

6. Start the backend server:
```bash
cd backend
npm start
```

7. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

## User Roles & Permissions

### Admin
- Full access to all features
- Manage users and roles
- Access to all content and media
- System settings and configuration

### Editor
- Approve, edit, schedule, and publish content
- Manage media library
- View analytics and reports
- Cannot manage users

### Writer
- Create and edit own content drafts
- Submit content for review
- Limited media management
- Cannot publish directly

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store and slices
│   └── slices/         # Redux slices
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Content Management
- `GET /api/content` - Get all content (with author population)
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content (with ownership validation)

### Media Management
- `GET /api/media` - Get all media files
- `POST /api/media/upload` - Upload media file

### User Management
- `GET /api/users` - Get all users (admin only)

### Debug
- `GET /api/debug/content` - Debug content with IDs
- `GET /api/test` - Server health check

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

### Code Style

The project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint and Prettier for code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Roadmap

- [ ] Real-time collaboration implementation
- [ ] Advanced user management
- [ ] Content versioning
- [ ] Activity logging
- [ ] Plugin system
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support

## Support

For support and questions, please open an issue in the repository or contact the development team.