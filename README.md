#  CIVIC REPORTING APP

A simple web-based platform that enables citizens to report public and community-related issues, track their reports, and monitor the progress of reported issues.

##  Live Demo

🔗 **Live Application:** https://civic-reporting-app-1.onrender.com

🔗 **GitHub Repository:** https://github.com/Neolife01-dot/CIVIC-REPORTING-APP

---

##  Problem Statement

Many community problems such as broken streetlights, damaged roads, blocked drainage systems, waste disposal, flooding, and water supply issues often go unreported or are difficult to track.

Citizens may not know where to report these problems, while authorities may lack an organized system for receiving and monitoring complaints.

The Civic Reporting App provides a simple digital platform for citizens to report issues and track their status.

---

##  Our Solution

The Civic Reporting App allows users to:

- Report civic and community issues
- Add descriptions and locations
- Upload images as evidence
- Track submitted reports
- View report statuses
- Allow administrators to manage reports
- Update the status of reported issues

The goal is to improve communication between citizens and responsible authorities while encouraging community participation.

---

##  Key Features

###  Citizen Features

- User registration
- User login
- Submit civic reports
- Select issue categories
- Add issue descriptions
- Add location information
- Upload images
- View submitted reports
- Track report status

###  Admin Features

- View submitted reports
- Review reported issues
- Update report status
- Monitor pending reports
- Mark issues as resolved

###  Location

Users can manually enter a location or use their device's GPS location.

###  Image Upload

Users can attach images to provide visual evidence of reported issues.

---

##  Report Status

Reports can have the following statuses:

- 🟡 Pending
- 🔵 Under Review
- 🟢 Resolved

---

## 🧰 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive Web Design

### Backend

- Node.js
- Express.js
- REST API

### Database

- SQLite

### Other Tools

- Git
- GitHub
- Render
- Multer
- CORS
- Nodemon

---

## 🗂️ Project Structure

```text
CIVIC-REPORTING-APP/
│
├── css/
│   ├── admin.css
│   ├── auth.css
│   ├── dashboard.css
│   ├── report.css
│   ├── reports.css
│   └── style.css
│
├── js/
│   ├── admin.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── main.js
│   ├── report.js
│   └── reports.js
│
├── IMAGE/
│   ├── hero.png
│   └── logo.png
│
├── pages/
│   ├── admin.html
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── report.html
│   └── reports.html
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── uploads/
│   ├── init-db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── index.html
├── README.md
└── .gitignore