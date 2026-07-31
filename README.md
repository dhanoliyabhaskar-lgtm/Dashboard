# 📊 Personal Data Dashboard

> A comprehensive, AI-powered personal analytics dashboard that aggregates data from popular third-party services—including **Spotify**, **GitHub**, **Codeforces**, and **Google Calendar**—into a unified, visually engaging interface.

---

## 📖 Overview

**Personal Data Dashboard** is built to give users complete visibility over their digital life and productivity metrics. Instead of logging into multiple platforms separately, users get a single central hub that consolidates activity logs, coding stats, calendar events, music streaming insights, and much more.

Featuring **AI-generated analytical summaries**, dynamic **ApexCharts visualizations**, robust **PDF report export capabilities**, and an engaging **gamified system (Achievements & Goals)**, this platform turns raw data into actionable insights for personal growth.

---

## ✨ Key Features

### 1. 🌐 Unified Overview & Modular Layout
* **Central Dashboard:** Upon logging in, users are greeted with a high-level overview featuring quick stats, activity cards, and key metrics across all integrated apps.
* **28+ Custom Views:** Powered by Express and Pug templating, the application provides rich, dedicated views for every platform and utility module.

### 2. 🔗 Seamless Third-Party Integrations
* **GitHub Integration:** Tracks repository activity, commit velocity, pull requests, and language breakdowns.
* **Codeforces Integration:** Monitors rating graphs, problem-solving history, submission verdicts, and contest rankings.
* **Spotify Integration:** Displays top tracks, artists, genres, listening hours, and recent playback trends.
* **Google Calendar Integration:** Syncs upcoming schedules, meetings, deadlines, and time allocation statistics.
* **Integration Manager:** Dedicated management portal to easily connect.

### 3. 🧠 AI-Generated Insights & Summaries
* Intelligent background analysis evaluates cross-platform data to provide automated, personalized productivity and activity summaries.

### 4. 📈 Interactive Data Visualizations
* Powered by **ApexCharts.js** for smooth, responsive visual analytics.
* Includes dynamic multi-axis charts: **Area Charts**, **Line Graphs**, **Doughnut/Pie Charts**, **Bar Charts**, and comparative progress bars and many more types.

### 5. 📄 Custom PDF Report Generation
* **Built-in Export Engine:** Utilizes **PDFKit** to compile and output downloadable PDF reports on demand.
* **Flexible Date Ranges:** Export metrics based on **Weekly**, **Monthly**, or **Custom Date Ranges**.

### 6. 🏆 Gamification: Achievements & Levels
* **Automatic Progress Tracking:** Earn badges and unlock system achievements automatically as your productivity increases across linked accounts.
* **Level System:** Level up your account as you reach milestones on GitHub, Codeforces, or complete daily goals.

### 7. 🎯 Goal Management
* **Personalized Goal Setting:** Set custom milestones (e.g., commit counts, problem targets, study hours, etc.).
* Tracking integrates alongside achievements to visually measure real-time progress toward personal objectives.

### 8. ⚙️ Comprehensive Settings Hub (6 Modules)
* **Profile Management:** Show username, many more details of user.
* **Notifications Center:** Can change the type of notification the user wants to take.
* **Security & Password:** Change password and manage session security.
* **Theme Customizer:** Native **Light Mode** and **Dark Mode** toggle for high usability day or night.
* **Help & Feedback:** Direct reporting tool for user queries and feedback submission and contact information of developer for user to contact us.
* **Session Control:** Secure logout and session destruction handling.

---

## 🛠️ Tech Stack

### **Frontend**
* **Templating Engine:** [Pug](https://pugjs.org/) (28+ modular view components)
* **Styling:** Custom CSS (Responsive Design + Light/Dark Theme variables)
* **Client Scripting:** JavaScript (ES6+)
* **Data Visualization:** [ApexCharts.js](https://apexcharts.com/)

### **Backend**
* **Runtime:** Node.js
* **Framework:** [Express.js](https://expressjs.com/)
* **Document Engine:** [PDFKit](https://pdfkit.org/) (Custom PDF Generation)

### **Database & Security**
* **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
* **Authentication & Sessions:** Secure token & session-based authentication

---

## 📁 Repository & Folder Structure

```
Personal-Data-Dashboard/
├── public/
│   ├── css/          # Global styles, theme variables, component styles
│   ├── js/           # Client-side scripts & ApexCharts configurations
│   └── images/       # Icons, static assets, and logos
├── views/            # Pug view files (28 template components)
│   ├── overview.pug
│   ├── github.pug
│   ├── codeforces.pug
│   ├── spotify.pug
│   ├── calendar.pug
│   ├── integrations.pug
│   ├── achievements.pug
│   ├── goals.pug
│   ├── reports.pug
│   └── settings/     # 6 Settings sub-pages (profile, theme, password, etc.)
├── app.js            # Express application , the main backend file for all the works along with a massive 6500+ line code.
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

---

## 🚀 Getting Started (Local Development)

Follow these steps to get a local copy up and running on your machine.

### **Prerequisites**
Ensure you have the following installed on your system:
* **Node.js** (v16.x or higher)
* **npm** (Node Package Manager)
* **MongoDB** (Local instance running or a MongoDB Atlas connection URI)

### **Installation & Setup**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/personal-data-dashboard.git
   cd personal-data-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your application secrets & API keys:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/personal-dashboard
   SESSION_SECRET=your_super_secret_session_key
   
   # API Keys for Integrations
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   And many more API client_id and secret that you want to connect with.
   ```

4. **Run the Application**
   ```bash
   node ./app.js
   ```

5. **Access the Dashboard**
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 📑 Report Generation Workflow

1. Navigate to the **Reports** section from the sidebar menu.
2. Choose a timeframe: **Weekly**, **Monthly**, or set a **Custom Date Range**.
3. Select a date of your preference as a **starting date** for the data to take.
4. Click **Generate PDF**. The backend compiles the data using **PDFKit** and triggers a direct browser download.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

* **Bhaskar** — *Developer & Architect for Backend and Database Management*
* **Ajeet** — *UI/UX designer and the Frontend Developer*
* GitHub: [dhanoliyabhaskar-lgtm](https://github.com/)

---

<p align="center">
  <i>Built with ❤️ using Node.js, Express, Pug, and MongoDB.</i>
</p>
