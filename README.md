# MediaHub - Multi-Role Content Management Platform

A full-stack content management platform for media companies, enabling editors, writers, and admins to manage, schedule, and publish content. Built solo by [Purv Dabhi](https://github.com/PurvDabhi) using a modern MERN stack, this project demonstrates a robust, scalable architecture with thoughtful role-based access and a seamless editorial workflow.

---

## Features

- **Role-Based Access Control**  
  Tailored dashboards and permissions for admins, editors, and writers.
- **Rich Content Editor**  
  WYSIWYG editor (ReactQuill) with media embedding and autosave.
- **Advanced Media Handling**  
  Upload, preview, and manage images, videos, and documents.
- **Content Management**  
  Create, edit, update, and view content with ownership validation.
- **User Management**  
  Admin-only user management interface.
- **Authentication**  
  JWT-based authentication with persistent sessions.
- **Responsive Design**  
  Fully responsive UI for desktop and mobile.

---

## Tech Stack

### Frontend

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Rich Text Editor:** ReactQuill
- **File Upload:** React Dropzone
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Icons:** Heroicons

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Password Hashing:** bcryptjs

---

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB (local or cloud instance)

### Installation

Clone the repository:

```sh
git clone <repository-url>
cd MediaHub-Multi-Role-Content-Management-Platform
```

Install frontend dependencies:

```sh
npm install
```

Install backend dependencies:

```sh
cd backend
npm install
cd ..
```

Create environment files:

```sh
# Frontend
cp .env.example .env

# Backend
cd backend
cp .env.example .env
```

Update environment variables as needed:

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000/api
```

**Backend (.env):**
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/mediahub
JWT_SECRET=your-secret-key
```

### Running the App

Start the backend server:

```sh
cd backend
npm start
```

Start the frontend development server:

```sh
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:8000](http://localhost:8000)

---

## User Roles & Permissions

| Role   | Permissions                                                                                   |
|--------|----------------------------------------------------------------------------------------------|
| Admin  | Full access to all features, user and role management, system settings, all content/media     |
| Editor | Approve, edit, schedule, publish content. Manage media, view reports. Cannot manage users     |
| Writer | Create/edit own drafts, submit for review, limited media management, cannot publish directly  |

---

## Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store and slices
│   └── slices/    # Redux slices
├── services/      # API services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── hooks/         # Custom React hooks
```

---

## API Endpoints

### Authentication

- `POST /api/auth/login` – User login
- `POST /api/auth/register` – User registration

### Content Management

- `GET /api/content` – Get all content (with author population)
- `POST /api/content` – Create new content
- `PUT /api/content/:id` – Update content
- `DELETE /api/content/:id` – Delete content (ownership validation)

### Media Management

- `GET /api/media` – Get all media files
- `POST /api/media/upload` – Upload media file

### User Management

- `GET /api/users` – Get all users (admin only)

### Debug

- `GET /api/debug/content` – Debug content with IDs
- `GET /api/test` – Server health check

---

## Development

### Scripts

- `npm run dev` &ndash; Start development server
- `npm run build` &ndash; Build for production
- `npm run preview` &ndash; Preview production build
- `npm test` &ndash; Run tests

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- ESLint and Prettier for code formatting

---

## Contributing

This project was built solo, but contributions are welcome!  
Feel free to fork the repository, create a feature branch, make your changes, and submit a pull request.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Roadmap

- Real-time collaboration
- Advanced user management
- Content versioning
- Activity logging
- Plugin system
- Mobile app
- Advanced analytics
- Multi-language support

---

## Support

For support and questions, please open an issue in the repository or contact me directly.

---
