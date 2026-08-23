# UniFix - Campus Issue Reporting & Management System
### Chitkara University • Evaluation 1 Project

**Tagline:** *"Report. Track. Resolve."*  
**Description:** UniFix helps students report campus problems and allows the administration to track and resolve them efficiently.

---

## 👥 Team of 4 Members - Page Allocation & React Concepts

| Member | Page / Component | Key React Concepts Demonstrated |
| :--- | :--- | :--- |
| **Member 1** | **Page 1: Home** (`src/pages/Home.jsx`) | Reusable components, layout structure, feature cards mapping using `map()`, 4-step workflow process |
| **Member 2** | **Page 2: Report Issue** (`src/pages/ReportIssue.jsx`) | `useState` for form fields, controlled inputs (`onChange`), form submission, conditional rendering for success message |
| **Member 3** | **Page 3: Complaints Dashboard** (`src/pages/Complaints.jsx`) | Arrays of objects, `map()`, custom component (`<ComplaintCard />`), passing data via `props`, `useState` for upvoting, conditional rendering for status badges |
| **Member 4** | **Page 4: Admin Dashboard** (`src/pages/AdminDashboard.jsx`) | Dynamic metric calculations from array state, `map()` for table & stats cards, `useState` for status changes, conditional rendering for status styling |

---

## 🛠️ Technologies & Rules Followed

- **HTML5 & Vanilla CSS3** (No external UI libraries or heavy frameworks)
- **JavaScript (ES6+)**
- **React** (Vite build tool)
- **Allowed React Concepts Used:**
  1. Components (Modular JSX files)
  2. Props (Passing data down to children)
  3. `useState` (State management for pages, forms, upvotes, and status changes)
  4. Conditional Rendering (Ternary operators and `&&` conditions)
  5. Arrays & `map()` (Dynamic lists and statistics)
- **Strictly Avoided:** React Router, Redux, Context API, `useEffect`, `useReducer`, Backend/APIs, Databases, Firebase, or external UI libraries.

---

## 🚀 How to Run the Project Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```

3. Open your browser and go to:
   ```
   http://localhost:5173
   ```

---

## 📁 Project File Structure

```
UniiFix/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                     # React DOM Root
    ├── App.jsx                      # Main Component & Page Navigation State
    ├── index.css                    # Design System & University Styling
    ├── data/
    │   └── sampleComplaints.js      # Sample Initial Complaints Dataset
    ├── components/
    │   ├── Navbar.jsx               # Navbar with page switcher
    │   ├── Navbar.css
    │   ├── Footer.jsx               # Footer with Team breakdown
    │   ├── Footer.css
    │   ├── ComplaintCard.jsx        # Reusable card with props & upvote state
    │   └── ComplaintCard.css
    └── pages/
        ├── Home.jsx                 # Page 1: Landing, Features & Workflow
        ├── Home.css
        ├── ReportIssue.jsx          # Page 2: Complaint Form & Success State
        ├── ReportIssue.css
        ├── Complaints.jsx           # Page 3: Complaints Dashboard & Filter
        ├── Complaints.css
        ├── AdminDashboard.jsx       # Page 4: Admin Management & Live Status
        └── AdminDashboard.css
```
