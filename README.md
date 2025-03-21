---

# Realtime Note App

A realtime collaborative note-taking application built with **React** (frontend), **Node.js** (backend), and **Socket.IO** for realtime updates.

---

## Features

- **Realtime Collaboration**: Multiple users can edit notes simultaneously.
- **Create, Update, and Delete Notes**: Users can perform CRUD operations on notes.
- **Authentication**: Secure user authentication using JWT (JSON Web Tokens).
- **Active Editors Tracking**: See who is currently editing a note.

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or remotely)

---

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/RedwanAhmedTapu/realtime-note-app.git
cd realtime-note-app
```

---

### 2. Set Up the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   cd realtime-note-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:3000`.

---

### 3. Set Up the Backend

1. Navigate to the backend directory:

   ```bash
   first open new terminal
   cd backend
   cd realtime-note-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the MongoDB connection:

   - Ensure MongoDB is running locally on the default port (`27017`).
   - Set the `MONGO_URI` environment variable in the `.env` file:

     ```env
     MONGO_URI=mongodb://localhost:27017/realtime-note-app
     ```

     Replace `realtime-note-app` with your preferred database name.

4. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend will be running at `http://localhost:5000`.

---

### 4. Access the Application

Once both the frontend and backend servers are running, open your browser and navigate to:

```
http://localhost:3000
```

---

## Folder Structure

```
realtime-note-app/
├── frontend/
│   └── realtime-note-frontend/       # Frontend (React)
├── backend/
│   └── realtime-note-backend/        # Backend (Node.js)
```

---

## Technologies Used

- **Frontend**:
  - NextJs
  - Socket.IO Client
  - Axios (for API requests)
  - Tailwind CSS (for styling)

- **Backend**:
  - Node.js
  - Express.js
  - Socket.IO (for realtime communication)
  - MongoDB (for database)
  - JWT (for authentication)

---

## MongoDB Connection

The backend connects to a MongoDB database using the following connection string:

```env
MONGO_URI=mongodb://localhost:27017/realtime-note-app
```

- Replace `realtime-note-app` with your preferred database name.
- Ensure MongoDB is running locally on the default port (`27017`).

---



## Contact

If you have any questions or feedback, feel free to reach out:

- **Redwan Ahmed Tapu**
- Email: redwantapu1234@gmail.com
- GitHub: [RedwanAhmedTapu](https://github.com/RedwanAhmedTapu)

---

Enjoy building and collaborating on your notes in realtime! 🚀

---
