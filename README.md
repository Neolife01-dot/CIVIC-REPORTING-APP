#         Civic Reporting App

##  Project Overview

Civic Reporting App is a web-based platform that allows citizens to report community problems such as broken streetlights, potholes, flooding, waste disposal issues, water supply problems, and other public infrastructure challenges.

The platform helps citizens submit reports with descriptions, locations, and photographic evidence while allowing administrators to monitor and update the status of reported issues.

---

##  Problem Statement

Many community problems remain unresolved because citizens do not have a simple and centralized way to report them.

Issues such as:

- Broken streetlights
- Bad roads
- Flooding
- Blocked drainage
- Waste disposal
- Electricity problems
- Water supply issues

may go unreported or lack proper tracking.

The Civic Reporting App provides a digital platform for reporting and monitoring these issues.

---

##  Solution

The Civic Reporting App allows users to:

1. Submit civic issue reports.
2. Select an issue category.
3. Provide a detailed description.
4. Enter the location of the issue.
5. Upload photographic evidence.
6. Track submitted reports.
7. View the current status of reports.

Administrators can:

1. View community reports.
2. Monitor pending reports.
3. Review submitted issues.
4. Update report status.
5. Mark resolved issues.

---

##  Key Features

### Citizen Features

- Report civic issues
- Issue categories
- Issue description
- Location input
- GPS location support
- Image upload
- Report submission confirmation
- View submitted reports
- View report details
- Track report status

### Administrator Features

- Admin Dashboard
- Total reports statistics
- Pending reports
- Under Review reports
- Resolved reports
- Community reports table
- View report information
- Update report status
- Refresh dashboard data

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- SQLite

### Other Technologies

- Multer for image uploads
- Nodemon for development
- REST API
- Browser Geolocation API

---

##  Project Structure

```text
civic-reporting-app/
│
├── css/
│   ├── report.css
│   ├── reports.css
│   └── admin.css
│
├── js/
│   ├── report.js
│   ├── reports.js
│   └── admin.js
│
├── pages/
│   ├── report.html
│   ├── reports.html
│   └── admin.html
│
├── server/
│   ├── server.js
│   ├── config/
│   ├── database/
│   ├── uploads/
│   ├── package.json
│   └── package-lock.json
│
├── index.html
└── README.md