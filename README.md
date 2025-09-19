# VideoTweet - A Full-Stack Video Sharing Platform

![Vercel Deployment](https://img.shields.io/badge/Vercel-LIVE-brightgreen?style=for-the-badge&logo=vercel)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-skyblue?style=for-the-badge&logo=tailwindcss)

A complete, full-stack web application built from the ground up, combining features from platforms like YouTube and Twitter. Users can register, upload videos, post tweets, subscribe to channels, comment, and create playlists.

### **Live Application:** [https://video-tweet-frontend.vercel.app/](https://video-tweet-frontend.vercel.app/)
### **Backend API Repo:** [https://github.com/raziya-023/BackendApp](https://github.com/raziya-023/BackendApp)

---

## Preview

<p align="center">
  <img alt="VideoTweet Channel Page Preview" src="https://github.com/user-attachments/assets/f8f4b54f-831b-43cb-8b26-7a83a1ffdfe0">
</p>

---

## Core Features

| Dashboard & Content Management | Video Playback & Interaction | Social Feed (Tweets) |
| :---: | :---: | :---: |
| A complete dashboard for channel stats and full content management (Create, Update, Delete) for videos and playlists. | An interactive video player with real-time likes, subscriptions, and a full commenting system. | A fully functional micro-blogging feed where users can post tweets and view a live feed of all content. |
| <details><summary>View Screenshot</summary><img alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/94133bfa-371d-46ed-adc9-ca7842908499"></details> | <details><summary>View Screenshot</summary><img alt="Video Detail Screenshot" src="https://github.com/user-attachments/assets/b8108178-9b29-4007-a79e-4e257c9ec25a"></details> | <details><summary>View Screenshot</summary><img alt="Tweets Page Screenshot" src="https://github.com/user-attachments/assets/8b0104e8-7a6d-4bb7-82fd-0e8b0e1c3528"></details> |

---

## Tech Stack

#### **Frontend**
-   **Framework:** React.js (with Vite)
-   **Styling:** Tailwind CSS
-   **State Management:** Redux Toolkit (Global) & TanStack Query (Server)
-   **Routing:** React Router DOM
-   **HTTP Client:** Axios

#### **Backend**
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (with Mongoose)
-   **Media Storage:** Cloudinary
-   **Authentication:** JWT (JSON Web Tokens)

---

## Local Setup

1.  Clone the repository: `git clone https://github.com/raziya-023/video-tweet-frontend.git`
2.  Navigate to the directory: `cd video-tweet-frontend`
3.  Install dependencies: `npm install`
4.  Run the development server: `npm run dev`

*(Make sure the backend server is running separately for full functionality.)*
