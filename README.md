# FinTrack Pro – Finance & Budget Tracker Mobile App

A clean, modern, and intuitive personal finance and budget tracking mobile application built with **React Native** and **Expo**. Designed with a sleek mobile-first UI, featuring role-based demo access, responsive analytics, dynamic monthly ledgers, and comprehensive expense categorization.

---

## ✨ Features

- **🔐 Role-Based Access Control:**
  - Dedicated access modes for **Customer** and **Admin**.
  - 1-Tap quick demo credential autofill for easy preview and testing.
  - Role validation preventing unauthorized portal access.

- **📊 Comprehensive Financial Analytics:**
  - Real-time balance, total income, and total expense metrics.
  - Interactive income vs. expense visual ratio bar.
  - Ranked expense category breakdown with progress indicators.
  - Monthly spending trends across recorded months.

- **📅 Month-Wise Ledger:**
  - Browse past and present months with interactive previous/next selectors.
  - Itemized transaction history with type tags (Income / Expense).
  - Monthly net-flow subtotal calculations.
  - Filter transactions by `All`, `Expenses`, or `Income`.

- **📁 Category Management & Details:**
  - Organized expense classification: Food, Travel, Shopping, Bills, Entertainment, Health, and Education.
  - Category-level budgets with remaining allowances and over-budget warnings.
  - Deep-dive into category details with itemized expense lists.

- **🔔 Interactive Transaction Alerts:**
  - Real-time in-app floating banner notifications.
  - Contextual updates when adding, editing, or removing transactions.

- **👤 Profile Management:**
  - Customer profile overview with role indicators.
  - Edit personal details including Name, Email, Phone, Currency symbol, and Monthly Budget targets.
  - Live state persistence across Home, Drawer, and Profile.

- **🧭 Multi-Navigation Architecture:**
  - **Stack Navigation:** Smooth modal transitions and child screen flows.
  - **Bottom Tab Navigation:** Fast access to core views (Home, Analysis, Months, Categories, Profile).
  - **Drawer Navigation:** Side menu with personalized profile header and role-based links.

---

## 🛠️ Tech Stack

- **Framework:** React Native, Expo (SDK 58)
- **Navigation:** React Navigation (Native Stack, Bottom Tabs, Drawer)
- **State Management:** React Context API (AuthContext, BudgetContext)
- **UI & Icons:** Expo Vector Icons (Ionicons), Expo Linear Gradient
- **Styling:** Custom design tokens (Figma-inspired palette, responsive typography, soft elevation shadows)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Madhan100/Finance-Budget-Tracker.git
   cd Finance-Budget-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

### Running on Devices
- **Mobile Device (Android / iOS):** Scan the terminal QR code using the **Expo Go** app.
- **Web Browser:** Press `w` in the terminal or run `npm run web`.
- **Android Emulator:** Press `a` in the terminal or run `npm run android`.
- **iOS Simulator:** Press `i` in the terminal.

---

## 📂 Project Structure

```
Finance-Budget-Tracker/
├── App.js                     # Root entry with Context & SafeArea providers
├── index.js                   # App registry and gesture handler setup
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
│
└── src/
    ├── constants/
    │   ├── theme.js           # Design tokens, color palette, spacing & shadows
    │   ├── categories.js      # Expense & income category definitions
    │   └── initialData.js     # Default transaction dataset
    │
    ├── context/
    │   ├── AuthContext.js     # Authentication, roles, and profile state
    │   └── BudgetContext.js   # Transaction CRUD, monthly calculations & alerts
    │
    ├── components/
    │   ├── CustomHeader.js        # Reusable screen header with drawer/back controls
    │   ├── CustomDrawerContent.js # Side drawer with user profile banner
    │   ├── PersonalizedAlert.js   # In-app notification toast banner
    │   ├── TransactionCard.js     # Transaction item card with category styling
    │   ├── CategoryCard.js        # Category spending & budget progress card
    │   └── ReportSummaryCard.js   # Daily, Weekly, Monthly financial report cards
    │
    ├── navigation/
    │   ├── RootNavigator.js   # Auth conditional router
    │   ├── AuthNavigator.js   # Sign In & Sign Up stack
    │   ├── AppNavigator.js    # Main application stack
    │   ├── DrawerNavigator.js # Side navigation drawer
    │   └── TabNavigator.js    # Bottom tab bar
    │
    └── screens/
        ├── auth/
        │   ├── SignInScreen.js    # Role-based login with demo quick-fill
        │   └── SignUpScreen.js    # User registration with validations
        └── app/
            ├── HomeScreen.js            # Balance overview, reports, recent activity
            ├── AnalysisScreen.js        # Detailed analytics, ratio bars & trends
            ├── ProfileScreen.js         # User profile and account details
            ├── EditProfileScreen.js     # Profile editing form
            ├── TransactionScreen.js     # Month-by-month transaction ledger
            ├── AddEditTransactionScreen.js # Add/edit transaction form
            ├── CategoriesScreen.js      # Overall category overview
            └── CategoryDetailsScreen.js # Itemized category history
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
