# Full Stack Web Application with React and Django REST Framework

! TaskManagementSystem

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This is a full-stack web application that allows users to manage their tasks efficiently. 
There are two types of tasks continous tasks and fixed tasks eg. solving two leetcode problems every l day 2 or two day etc is continous task and finish TaskManagement project start april 20 ,2025 and finish june 20,2025 etc is exapmle of fixed task
The frontend is built using React, providing a dynamic user interface, while the backend is powered by Django REST Framework, offering a robust API for data management.

## Features

- User authentication (registration and login)
- CRUD operations for tasks
- Responsive design
- User-friendly interface

## Technologies Used

- **Frontend:**
  - React
  - Axios (for API calls)
  - Material-UI (for styling)

- **Backend:**
  - Django
  - Django REST Framework
  - PostgreSQL (or SQLite for development)
  - JWT (for authentication)

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Python 3.x
- pip (Python Package Installer)
- PostgreSQL (if using PostgreSQL)

### Clone the Repository
bash
git clone https://github.com/Asfm445/TaskmanagementSystem.git
cd TaskManagementSystem

### Frontend Setup

1. Navigate to the frontend directory:

bash cd frontend
   

3. Install dependencies:

bash npm install

4. Start the development server:
bash npm start
### Backend Setup

1. Navigate to the backend directory:
  bash cd backend2
2. Create a virtual environment:
bash
   python -m venv venv
   source venv/bin/activate  # On Windows use venv\Scripts\activate
3. Install dependencies:
bash
   pip install -r requirements.txt
   

4. Set up the database:
   create .env and replace information in env-example with True information

   
bash
   python manage.py migrate
   

5. Create a superuser (optional):

   
bash
   python manage.py createsuperuser
   

6. Start the Django server:

   
bash
   python manage.py runserver
   

## Usage

Once both the frontend and backend servers are running, you can access the application at http://localhost:3000 (frontend) and http://localhost:8000 (backend).

## API Endpoints

Here are some of the key API endpoints available in this application:

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| PORT    | api/user/register/    | for registration          |
| POST   | api/token/            | for authorization  to get token          |
| POST    | /api/token/refresh/   | for authorization to refresh token         |
| GET    | /progress/             | To retreive all continous tasks          |
| POST | /progress/               | To Create continous tasks           |
| PATCH | /progress/              | To update  continous tasks         | note: data should contain id others optional
| DELETE | /progress/?id={id}     | To Delete continous tasks         |
| POST | /progress/stop/          | To stop/start continous tasks        | note: data contain only id and stop stop=True to stop and False to start
| GET    | /fixed/             | To retreive all fixed tasks          |
| POST | /progress/               | To Create fixed tasks           |
| PATCH | /progress/              | To update  fixed tasks         | note: data should contain id others optional
| DELETE | /progress/?id={id}     | To Delete continous tasks         |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/YourFeature).
3. Make your changes and commit them (git commit -m 'Add new feature').
4. Push to the branch (git push origin feature/YourFeature).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for checking out this project! Feel free to reach out with any questions or feedback.
