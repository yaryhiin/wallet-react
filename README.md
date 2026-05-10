# Wallet Tracker

A full-stack personal finance tracker built with React and Supabase.  
Users can create accounts, track income and expenses, transfer money between accounts, manage custom categories, and view recent/all transactions.

## Live Demo

[Live Website](https://wallet-react-yaryhiin.netlify.app/)

## Preview

### Dashboard
<img width="754" height="754" alt="Dashboard Preview" src="https://github.com/user-attachments/assets/02dd408b-e58e-4c7c-ac72-74d182692874" />

### Transactions
<img width="754" height="753" alt="Transactions Preview" src="https://github.com/user-attachments/assets/58e4854c-1c36-406f-928b-310f7824b8a6" />

### Transfer
<img width="754" height="560" alt="Transfer Preview" src="https://github.com/user-attachments/assets/7dd9d0d7-cf86-4f7b-805f-001097244784" />


## Features

- User authentication with Supabase
- Email confirmation on signup
- Create, edit, and delete accounts
- Add income and expense transactions
- Transfer money between accounts with exchange rate support
- Custom income/expense categories
- Recent transactions dashboard
- Full transaction table
- Sort transactions by date, amount, category, currency, and account
- Light/dark theme
- Responsive layout
- Persistent cloud database with Supabase

## Tech Stack

- React
- React Router
- Supabase Auth
- Supabase Database
- SCSS Modules
- Netlify
- Frankfurter API for currency exchange rates

## Main Functionality

### Authentication

Users can sign up, confirm their email, log in, and access their personal wallet data.

### Accounts

Users can create multiple accounts with custom names, balances, currencies, and icons.

### Transactions

Users can add income and expenses, assign categories, choose payment accounts, edit existing transactions, and delete them.

### Transfers

Users can transfer money between accounts. The app supports exchange rates and automatically updates both account balances.

### Categories

Default categories are created for new users, and users can add or delete custom categories.

### Sorting

The transaction table can be sorted by different columns, making it easier to review financial history.

## What I Learned

While building this project, I practiced:

- Managing async data from Supabase
- Handling authentication and protected routes
- Preventing route crashes after page reloads
- Working with relational user-owned data
- Building reusable form components
- Handling loading, error, and empty states
- Managing derived state like sorted transactions
- Debugging real production issues after deployment

## Challenges

Some of the biggest challenges were:

- Keeping user data available after page reload
- Fixing protected routes with async Supabase session/data loading
- Handling email confirmation redirects from Supabase
- Managing transfers between two accounts correctly
- Keeping UI state synced with database updates

## Future Improvements

- Add transaction search and filters
- Add dashboard charts
- Add crypto asset tracking
- Add monthly budget goals
- Improve mobile UI further
- Add export to CSV

## Getting Started

Clone the project:

```bash
git clone your-repo-link
cd wallet-tracker
```

Install dependencies:
```bash
npm install
```

Create a .env file:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the app:
```bash
npm start
```

## Author
Built by Tim.
