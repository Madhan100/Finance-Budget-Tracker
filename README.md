# FinTrack Pro – Finance Budget Tracker Mobile App
### MCA Semester III – Core Elective-II: Mobile App Development using React Native
**Autonomous End of Semester Examinations – Major Hackathon (75 Marks)**

---

## 📱 Project Overview
**FinTrack Pro** is a comprehensive, modern, and production-ready mobile budget management application built with **React Native** and **Expo**. It follows the **Figma design specifications** and satisfies all functional and architectural criteria outlined in the RVS SCS MCA examination question paper.

No external backend or database is needed. All transactions, categories, user profiles, monthly ledgers, and financial reports are driven by localized reactive state management with dynamic real-time recalculations.

---

## 🎯 Exam Requirements & Marks Distribution (75 Marks)

### Part I – Required Screens (30 Marks)
| Screen | Requirement & Features | Marks | Status |
| :--- | :--- | :---: | :---: |
| **Screen 1: Home Screen** | App branding, welcome banner, role badges, hero balance gradient card, daily/weekly/monthly report summaries, quick actions grid, and recent transactions. | **5** | ✅ Completed |
| **Screen 2: Analysis Screen** | Total Income, Total Expenses, Current Net Balance, visual ratio progress bars, ranked category expense breakdown, and monthly trends. Accessible to both Admin & Customer. | **5** | ✅ Completed |
| **Screen 3: Profile & Edit Profile** | Customer-only profile with correct Name, Email, and Role tag. Edit profile form with validations (name, email format, phone, currency, budget) that update globally. | **5** | ✅ Completed |
| **Screen 4: Month-wise Transactions** | Customer-only monthly ledger. Previous/Next month selectors (`2026-10`, `2026-09`, `2026-08`), subtotal breakdown bar, type filters (All/Expense/Income), and empty state. | **5** | ✅ Completed |
| **Screen 5: Overall Categories Screen** | Expense categories (Food, Travel, Shopping, Bills, Entertainment, Health, Education) with total spent, budget progress bars, and navigation to details. | **5** | ✅ Completed |
| **Screen 6: Category Details Screen** | Selected category name, icon, total spent, remaining allowance, and itemized list of transactions with dates and amounts. Real-time updates. | **5** | ✅ Completed |

### Part II – React Navigation (30 Marks)
| Navigation Type | Implementation | Marks | Status |
| :--- | :--- | :---: | :---: |
| **Stack Navigation** | Native Stack for Auth (`SignIn`, `SignUp`) and App (`DrawerRoot`, `CategoryDetails`, `AddEditTransaction`, `EditProfile`) with smooth modals and back navigation. | **10** | ✅ Completed |
| **Bottom Tab Navigation** | Professional tab bar with icons and badges (Home, Analysis, Transactions/Records, Categories, Profile) respecting the user's role. | **10** | ✅ Completed |
| **Drawer Navigation** | Custom side drawer with user profile banner (Avatar, Name, Email, Role badge), role-filtered navigation items, and session-clearing Logout. | **10** | ✅ Completed |

### Part III – Functional Requirements (15 Marks)
| Requirement | Implementation | Marks | Status |
| :--- | :--- | :---: | :---: |
| **Screen Navigation** | All buttons, drawer triggers, tabs, and back navigations work smoothly without broken routes or blank screens. | **5** | ✅ Completed |
| **Personalized Alerts** | Interactive in-app notification banner and native dialogs with user greeting: *"Hi Gokul, your expense for 'Grocery Basket' has been added successfully."*, *"Your transaction has been updated."*, *"Your transaction has been deleted."* | **5** | ✅ Completed |
| **Daily, Weekly, Monthly Reports** | Real-time calculation on the Home screen based on local transaction dates. Toggle between Daily, Weekly, and Monthly with Income, Expense, and Net Balance. | **5** | ✅ Completed |

---

## 🔐 Role-Based Demo Credentials

| Role | Name | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | **Madhan** | `madhan.admin@example.com` | `Admin@123` | Supervisory access to all system records, global financial analytics, admin control console, and system audit stats. |
| **Customer** | **Gokul** | `gokul.customer@example.com` | `Customer@123` | Full personal ledger access, month-by-month filters, category analysis, personalized alerts, and editable profile. |

> **Examiner Tip:** The Sign In screen features **1-Tap Demo Auto Fill** buttons (`⚡ Gokul (Customer)` and `⚡ Madhan (Admin)`) for rapid instant testing.
>
> **Strict Role Security:** If a user attempts to log in with Admin credentials while the Customer role tab is selected (or vice versa), the app prevents access and displays: *"Access Denied: This account is registered as 'Admin'. You cannot sign in under 'Customer' role."*

---

## 🚀 How to Run the Application

### 1. Start the Dev Server
In the project root directory, run:
```bash
npx expo start
```
or
```bash
npm start
```

### 2. View on Device or Simulator
- **Android Device / Expo Go:** Scan the displayed QR code with the **Expo Go** app.
- **Web Browser:** Press `w` in the terminal or run:
  ```bash
  npm run web
  ```
- **Android Emulator:** Press `a` in the terminal or run:
  ```bash
  npm run android
  ```
- **iOS Simulator:** Press `i` in the terminal (macOS).

---

## 📂 Project Architecture

```
Finance-Budget-Tracker/
├── App.js                         # Root entry wrapping SafeArea, AuthProvider, BudgetProvider
├── index.js                       # Root registration with react-native-gesture-handler
├── app.json                       # Expo configuration
├── package.json                   # Verified Expo SDK 58 compatible dependencies
│
└── src/
    ├── constants/
    │   ├── theme.js               # Figma color palette, spacing, radius, and shadows
    │   ├── categories.js          # Expense & Income categories with icons, colors, and budgets
    │   └── initialData.js         # Realistic seed transactions (daily, weekly, monthly)
    │
    ├── context/
    │   ├── AuthContext.js         # Role-based demo auth, profile updates, and session clearing
    │   └── BudgetContext.js       # Transaction CRUD, month aggregations, reports, and alerts
    │
    ├── components/
    │   ├── CustomHeader.js        # Header with drawer hamburger, role badge, and back button
    │   ├── CustomDrawerContent.js # Side drawer with user profile banner and role-based links
    │   ├── PersonalizedAlert.js   # Floating in-app notification banner
    │   ├── TransactionCard.js     # Reusable transaction card with category badge and amount
    │   ├── CategoryCard.js        # Category spending vs budget card with progress bar
    │   └── ReportSummaryCard.js   # Daily, Weekly, Monthly segmented financial reports
    │
    ├── navigation/
    │   ├── RootNavigator.js       # Switches between AuthNavigator and AppNavigator
    │   ├── AuthNavigator.js       # Stack: SignIn and SignUp screens
    │   ├── AppNavigator.js        # Stack: DrawerRoot, CategoryDetails, AddEditTransaction, EditProfile
    │   ├── DrawerNavigator.js     # Drawer: Home, Analysis, Transactions, Categories, Profile, Logout
    │   └── TabNavigator.js        # Bottom Tabs: Home, Analysis, Transactions/Records, Categories, Profile
    │
    └── screens/
        ├── auth/
        │   ├── SignInScreen.js    # Role selector, demo fillers, validation, and error messages
        │   └── SignUpScreen.js    # Registration form with input validations
        └── app/
            ├── HomeScreen.js            # [Screen 1] Balance gradient card, reports, quick actions
            ├── AnalysisScreen.js        # [Screen 2] Income, expenses, balance, ratio bars, trends
            ├── ProfileScreen.js         # [Screen 3] Customer profile details, role badge, highlights
            ├── EditProfileScreen.js     # [Screen 3] Profile editing with validation and live updates
            ├── TransactionScreen.js     # [Screen 4] Month-by-month ledger with previous/next navigation
            ├── AddEditTransactionScreen.js # Transaction form with category picker & personalized alerts
            ├── CategoriesScreen.js      # [Screen 5] Overall expense categories & budget progress
            └── CategoryDetailsScreen.js # [Screen 6] Selected category details & itemized records
```

---

## 🧪 Verification & Test Results
- **Expo Doctor Check:** 20/20 checks passed without errors.
- **Bundler Compilation:** Verified with `npx expo export --platform web` (1,164 modules bundled cleanly).
- **Navigation Verification:** Stack, Bottom Tabs, and Drawer all configured and functional.
- **Form Validations:** Verified on SignIn, SignUp, Edit Profile, and Transaction forms.
