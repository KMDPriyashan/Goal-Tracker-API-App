# Goal Tracker

<div align="center">

**Turn intentions into measurable progress.**

A responsive goal-management web app for creating goals, organizing tasks, tracking milestones, and scheduling reminders.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=323330)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

---

## Overview

**Goal Tracker** helps users turn high-level goals into structured, actionable plans. The app combines a personal dashboard with goal details, milestone planning, recurring task management, reminders, user profiles, and progress summaries.

This repository contains the complete front-end experience. Data is currently stored in the browser with `localStorage`, while sessions are kept in `sessionStorage`. An API base URL is included in `JavaScript/config.js` and is ready to be used when backend integration is added.

---

## Features

- **User registration and login** with browser-based session handling
- **Personal dashboard** showing goals, completed goals, pending tasks, total tasks, and goal completion percentage
- **Recent activity** created from goals, tasks, and reminders
- **Goal management**
  - Create, view, edit, search, filter, and delete goals
  - Define multiple milestones with due dates
  - Track active and completed status
- **Task management**
  - Create, edit, complete, and delete tasks
  - Add descriptions, start dates, due dates, and frequencies
  - Search and filter tasks
- **Reminder management**
  - Schedule dated reminders
  - View upcoming and past reminders
  - Delete reminders
- **Profile summary** with account and activity counts
- **Responsive interface** powered by Bootstrap 5
- **Client-side validation and alert feedback**

---

## Screenshots

> Add screenshots of the dashboard and key workflows here to showcase the application.

```markdown
![Dashboard](docs/screenshots/dashboard.png)
![Goals](docs/screenshots/goals.png)
![Tasks](docs/screenshots/tasks.png)
```

---

## Technology Stack

| Area | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3, Bootstrap 5 |
| Icons | Bootstrap Icons |
| Application logic | Vanilla JavaScript |
| User session | Browser `sessionStorage` |
| Application data | Browser `localStorage` |
| API configuration | Fetch-based JavaScript helper |

---

## Project Structure

```text
Goal-Tracker-API-App/
├── index.html                 # Entry point; redirects to login
├── login.html                 # User login
├── register.html              # User registration
├── dashboard.html             # Progress overview and recent activity
├── goals.html                 # Goal list, search, and status filter
├── add-goal.html              # Goal creation form
├── edit-goal.html             # Goal editing form
├── goal-detail.html           # Detailed goal view
├── tasks.html                 # Task list and filters
├── add-task.html              # Task creation form
├── edit-task.html             # Task editing form
├── reminders.html             # Reminder list
├── add-reminder.html          # Reminder creation form
├── profile.html               # Profile and activity summary
├── JavaScript/
│   ├── config.js              # API base URL, storage helpers, request helper
│   ├── auth.js                # Registration, login, and logout
│   ├── dashboard.js           # Dashboard statistics and activity
│   ├── goals.js               # Goal CRUD and milestone logic
│   ├── tasks.js               # Task CRUD and filtering
│   ├── reminders.js           # Reminder CRUD
│   ├── profile.js             # Profile summary
│   └── utils.js               # Shared UI and formatting helpers
└── Style/
    └── style.css              # Shared custom styles
```

---

## Getting Started

### Prerequisites

- A modern web browser
- A local HTTP server

VS Code with the **Live Server** extension is recommended.

### Run the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/KMDPriyashan/Goal-Tracker-API-App.git
   ```

2. Open the project folder:

   ```bash
   cd Goal-Tracker-API-App
   ```

3. Start a local server:

   - Right-click `index.html` in VS Code
   - Select **Open with Live Server**

4. Open the local URL shown by Live Server, usually:

   ```text
   http://127.0.0.1:5500
   ```

The entry page redirects to `login.html`. Create an account on the registration page, then log in to open the dashboard.

---

## First-Time Usage

1. Register with a username, email, and password.
2. Log in with the same credentials.
3. Open **Goals** and create a goal with one or more milestones.
4. Open **Tasks** and add actions with frequencies and dates.
5. Open **Reminders** to schedule important dates.
6. Use the **Dashboard** to review totals and completion progress.
7. View **Profile** for a summary of your stored activity.

---

## Data Storage

The current front-end prototype stores data locally in the browser:

| Storage | Purpose |
| --- | --- |
| `registeredUser` | Registered account details |
| `sessionStorage.user` | Active logged-in user |
| `goals` | Goal records and milestones |
| `tasks` | Task records |
| `reminders` | Reminder records |

Clearing the browser's site data removes the account and application records. Data is not synchronized across browsers or devices.

> **Security note:** This demo is not intended for production authentication. Passwords and user data should never be stored in browser storage in a production system.

---

## API Configuration

The API helper is configured in [`JavaScript/config.js`](JavaScript/config.js):

```javascript
const API_BASE_URL = 'http://localhost:5500/api/GoalTracker';
```

Update this value to match the deployed backend URL. The project also contains `apiRequest()` for JSON fetch requests and CORS-aware error feedback.

To connect a real backend, replace or extend the browser-storage operations in the feature modules for:

- Authentication
- Goals and milestones
- Tasks
- Reminders
- Profile data

---

## Browser Support

Goal Tracker uses modern browser features and Bootstrap 5. It is compatible with current versions of:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

---

## Future Improvements

- Connect to a secure REST API
- Add password hashing and server-side authentication
- Encrypt or properly protect user data
- Persist data across devices
- Add goal completion controls
- Add task editing history
- Add email or push notifications
- Add charts and trend reports
- Add dark mode and accessibility preferences
- Add automated unit and end-to-end tests

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push the branch and open a pull request:

   ```bash
   git push origin feature/your-feature
   ```

Please keep changes focused and preserve the existing project structure and naming conventions.

---

## License

No license has been selected for this project yet. Until a license is added, the repository's default copyright protections apply.

---

<div align="center">

Built to make goals clear, measurable, and achievable.

</div>
