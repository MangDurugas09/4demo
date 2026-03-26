# ⚡ Electric Billing App

A comprehensive React Native application for managing electricity bills with a modern, user-friendly interface featuring a light blue and yellow color scheme.

## Features

### 📊 Client Dashboard

- View current bill amount and due date
- Account status and connection details
- Quick statistics for current and last month usage
- Account number and billing period information

### ⚡ Electricity Usage Tracking

- Weekly usage pattern visualization with bar charts
- Daily breakdown of electricity consumption
- Monthly comparison and cost analysis
- Peak and low usage insights
- Energy efficiency tips and recommendations

### 💳 Payment Management

- **6 Payment Methods:**
  - Online Banking
  - UPI (Google Pay, PhonePe, Paytm)
  - Credit/Debit Card
  - Cheque Payment
  - Digital Wallets (Amazon Pay, Apple Pay)
  - Cash Payment at collection centers

- Step-by-step payment instructions for each method
- Complete payment history with transaction details
- Amount due and due date tracking

### ℹ️ Company Information

- About Power Distribution Ltd
- Key statistics (2.5M+ customers, 35% green energy)
- Service coverage across 5 states and 200+ cities
- International certifications (ISO 9001, ISO 14001, ISO 45001)
- Customer support contact information (24/7 support)
- Social responsibility and sustainability initiatives
- Company strengths and core values

## Design

### Color Scheme

- **Primary:** Light Blue (#ADD8E6)
- **Accent:** Yellow (#FFD700)
- **Text:** White (#FFFFFF)
- **Background:** Dark Blue (#0B1E2E)

### UI Features

- Clean, modern interface
- Tab-based navigation
- Responsive cards and components
- Visual charts and statistics
- Smooth interactions and animations

## Project Structure

```
ecommerse_v2/
├── App.js                          # Main app component with navigation
├── index.js                        # Entry point
├── index.html                      # Landing page
├── package.json                    # Dependencies
├── components/
│   ├── Dashboard.js               # Dashboard component
│   ├── UsageSection.js            # Usage tracking component
│   ├── PaymentSection.js          # Payment management component
│   └── CompanyInfo.js             # Company information component
└── assets/                         # Images and resources
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, for web preview)

### Setup Steps

1. **Navigate to project directory:**

   ```bash
   cd c:\DEMO\ecommerse_v2
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Run on different platforms:**
   - Web: `npm run web`
   - Android: `npm run android`
   - iOS: `npm run ios`

## Available Scripts

- `npm start` - Start Expo server
- `npm run web` - Run on web browser
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device

## Technology Stack

- **React Native 0.81.5** - Cross-platform mobile framework
- **React 19.1.0** - UI library
- **Expo 54.0.33** - React Native development platform
- **StyleSheet API** - Native styling

## Key Components

### Dashboard.js

Displays current bill, account status, and billing information with clean card-based layout.

### UsageSection.js

Shows weekly usage patterns with visual charts, monthly comparisons, and energy-saving tips.

### PaymentSection.js

Provides 6 payment methods with detailed instructions and payment history tracking.

### CompanyInfo.js

Comprehensive company information including services, certifications, and contact details.

## Data Visualization

- **Weekly Usage Chart** - Bar chart showing daily consumption
- **Monthly Comparison** - Historical billing data
- **Statistics Grid** - Key metrics and insights
- **Status Cards** - Account and payment information

## Contact & Support

**Power Distribution Ltd**

- 📞 Phone: +1 (800) 555-0199
- ✉️ Email: support@powerco.com
- 📍 Address: 123 Power Street, City, State 12345
- ⏰ Toll Free: 1800-POWER-99

## Company Values

✓ 24/7 Customer Support
✓ Transparent Billing and Fair Pricing
✓ Regular Infrastructure Updates
✓ Community Sustainability Programs
✓ Digital Innovation for Customer Convenience
✓ Fair Employment and Safety Practices

## Certifications

- ISO 9001 - Quality Management
- ISO 14001 - Environmental Management
- ISO 45001 - Occupational Health and Safety

## Future Enhancements

- Bill payment integration
- Real-time notifications
- Download bill PDF option
- Energy consumption predictions
- Multi-language support
- Dark/Light theme toggle
- Complaint tracking system
- Profile customization

## License

© 2026 Power Distribution Ltd. All rights reserved.

---

Built with ❤️ using React Native & Expo
