# MetricFlow - Business KPI Dashboard

A streamlined web application for small business owners to track and manage key business metrics without complexity.

## 🚀 Features

- **User Authentication:** Secure sign up, login, and password reset via Supabase Auth
- **Metric Management:** Full CRUD operations (Create, Read, Update, Delete)
- **Visual Progress Tracking:** Color-coded progress bars based on performance
- **Category Filtering:** Organize by Sales, Marketing, Operations, Finance
- **Sorting Options:** Sort by Recent, Name, or Progress
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates:** See changes instantly
- **Professional UI:** Modern, clean design with smooth animations

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (Key-Value Store)
- **Authentication:** Supabase Auth
- **Backend:** Supabase Edge Functions (Hono server)
- **Icons:** Lucide React

## 📋 Pages Overview

### 1. Landing Page (/)
- Hero section with clear value proposition
- Feature cards highlighting key benefits
- Call-to-action buttons for signup and login
- Professional footer

### 2. Sign Up Page (/signup)
- Full name, email, password, confirm password fields
- Optional business name field
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Password visibility toggle
- Auto-login after successful registration

### 3. Login Page (/login)
- Email and password fields
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Error handling for invalid credentials

### 4. Forgot Password Page (/forgot-password)
- Email input for password reset
- Sends reset link via Supabase Auth
- Success confirmation message
- Back to login link

### 5. Dashboard Page (/dashboard) - Protected Route
- **Authentication required** - redirects to login if not authenticated
- Summary statistics (Total, On Track, Needs Attention)
- Filter by category dropdown
- Sort options (Recent, Name A-Z, Progress)
- Responsive metric cards grid
- Empty state when no metrics exist

## 🎯 Metric Card Features

Each metric card displays:
- Category badge (color-coded)
- Metric name
- Current value with unit
- Target value with unit
- Progress bar (color-coded: green ≥80%, yellow 50-79%, red <50%)
- Percentage completion
- Last updated timestamp (relative time)
- Edit and Delete action buttons

## ✨ CRUD Operations

### CREATE - Add New Metric
1. Click "+ Add New Metric" button
2. Fill in required fields:
   - Metric Name (max 100 chars)
   - Current Value (number, min 0)
   - Target Value (number, must be > 0)
   - Unit (e.g., $, customers, %, max 20 chars)
   - Category (Sales, Marketing, Operations, Finance)
3. Click "Save Metric"
4. Toast notification confirms success
5. Metric appears in dashboard

### READ - View Metrics
- Dashboard automatically loads all user's metrics
- Filter by category (All/Sales/Marketing/Operations/Finance)
- Sort by Recent/Name/Progress
- Real-time progress calculation and color coding

### UPDATE - Edit Metric
1. Click "Edit" button on metric card
2. Modal opens with pre-filled values
3. Modify any field
4. Click "Save Metric"
5. Toast notification confirms update
6. Card updates with new values

### DELETE - Remove Metric
1. Click "Delete" button on metric card
2. Confirmation dialog appears with warning
3. Confirm deletion
4. Toast notification confirms removal
5. Metric removed from dashboard
6. Empty state shown if last metric deleted

## 🎨 Design System

### Color Palette
```
Primary Blue:       #3B82F6 (buttons, links, accents)
Primary Blue Hover: #2563EB (hover states)
Success Green:      #10B981 (on-track metrics, success messages)
Warning Orange:     #F59E0B (mid-range metrics)
Danger Red:         #EF4444 (low metrics, delete actions)
Dark Text:          #1F2937 (headings, body text)
Gray Text:          #6B7280 (secondary text)
Light Gray:         #F3F4F6 (backgrounds)
```

### Category Colors
- **Sales:** Blue (#3B82F6)
- **Marketing:** Purple (#A855F7)
- **Operations:** Orange (#F59E0B)
- **Finance:** Green (#10B981)

### Typography
- Headings: Bold, responsive sizing
- Body: Regular, 16px
- Modern sans-serif font stack (Inter, SF Pro, Segoe UI)

### Components
- **Buttons:** Rounded corners, hover effects, loading states
- **Input Fields:** Border focus states, error states with red borders
- **Cards:** White background, subtle shadows, hover effects
- **Modal:** Overlay with centered card, smooth animations
- **Progress Bars:** 8px height, rounded, color-coded fills
- **Toast Notifications:** Top-right position, auto-dismiss (3s)

## 🔒 Security Features

### Frontend Security
- Password validation (8+ chars, mixed case, numbers)
- Client-side form validation
- Protected routes with authentication checks
- Session management via Supabase Auth

### Backend Security
- User verification on all protected endpoints
- User-scoped data access (users only see their own metrics)
- Bearer token authentication
- Error handling with detailed logging
- CORS enabled for secure cross-origin requests

## 📱 Responsive Design

### Desktop (>1024px)
- 3-column grid for metric cards
- Full navigation header
- 500px max-width modals

### Tablet (768px-1024px)
- 2-column grid for metric cards
- Condensed navigation
- 90% width modals (max 500px)

### Mobile (<768px)
- Single column (stacked) layout
- Full-width buttons
- Stacked header elements
- Optimized touch targets

## 🚀 Getting Started

### Prerequisites
- Figma Make account
- Supabase project (automatically configured)

### Setup Instructions
1. The application is pre-configured with Supabase
2. No additional database setup required (uses KV store)
3. Authentication is ready to use
4. Simply deploy and start using!

### First Steps
1. Navigate to the landing page
2. Click "Get Started Free"
3. Create your account
4. Add your first metric
5. Start tracking!

## 🧪 Testing Checklist

### Authentication
- ✅ Sign up creates account and auto-logs in
- ✅ Login with valid credentials works
- ✅ Login with invalid credentials shows error
- ✅ Forgot password sends reset email
- ✅ Logout clears session
- ✅ Protected routes redirect when not authenticated

### CRUD Operations
- ✅ Add metric creates new entry
- ✅ Metric appears immediately
- ✅ Edit updates values correctly
- ✅ Delete removes metric after confirmation
- ✅ Users only see their own metrics

### UI/UX
- ✅ All pages responsive
- ✅ Forms validate properly
- ✅ Loading states display
- ✅ Toast notifications work
- ✅ Empty states show correctly
- ✅ Progress bars calculate accurately
- ✅ Filters and sorting work

## 📊 Database Schema (KV Store)

### Metrics
Stored as: `metrics:{user_id}:{metric_id}`

```typescript
{
  id: string (UUID)
  user_id: string (UUID)
  metric_name: string
  current_value: number
  target_value: number
  unit: string
  category: 'Sales' | 'Marketing' | 'Operations' | 'Finance'
  created_at: string (ISO timestamp)
  last_updated: string (ISO timestamp)
}
```

## 🎯 Use Cases

### Small Business Owners
Track revenue, customer acquisition, and other KPIs in one place

### Startups
Monitor growth metrics and progress toward goals

### Freelancers
Keep track of client count, project completion, income targets

### Teams
Share metrics across departments (Sales, Marketing, Finance, Operations)

## 🐛 Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- Try logging out and back in
- Check browser console for session errors

### Metrics Not Loading
- Check internet connection
- Refresh the page
- Verify Supabase connection

### Cannot Delete Metric
- Ensure you own the metric
- Check for active session
- Try refreshing and attempting again

## 🔮 Future Enhancements

Potential features for future versions:
- 📈 Charts and graphs for trend visualization
- 👥 Team collaboration and sharing
- 📱 Native mobile apps (iOS/Android)
- 📧 Email alerts for metrics below threshold
- 📅 Historical data and reporting
- 🎨 Customizable themes
- 📤 Export data to CSV/PDF
- 🔔 Webhook integrations

## 📄 License

This is a demonstration project built for educational purposes.

## 👤 Author

**MetricFlow Team**
Built with Figma Make and Supabase

---

**Ready to track your business metrics?** [Get Started Now](#)
