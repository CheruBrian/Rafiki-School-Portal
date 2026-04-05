# School Portal - Role-Based Access System

## Overview

The School Website has been upgraded with a comprehensive role-based access control system. Different user types (Administrator, Accountant, Teachers, and Parents) can now login with their respective credentials and access dashboards with specific permissions.

## Features Implemented

### 1. **Authentication System**
- Custom authentication context using React Context API
- Secure login mechanism with role-based access
- User session management with login/logout functionality

### 2. **User Roles & Permissions**

#### **Administrator (All Rights)**
- View all students with complete details
- Manage teacher information
- Oversee accountant staff
- Access comprehensive financial reports
- View and analyze all school data

**Demo Credentials:**
- User Type: Administrator
- Password: admin123

#### **Accountant (Fee Management)**
- View all students' classes
- Track school fee collection
- Monitor outstanding balances
- Filter students by class
- Generate fee status reports

**Demo Credentials:**
- User Type: Accountant
- Password: accountant123

#### **Teachers (Student Management)**
- View assigned students and their grades
- Access student performance metrics
- Monitor school fee status for their students
- View grade distribution and analytics
- Track fee collection by class

**Demo Credentials:**
- User Type: Teacher
- Password: teacher123

#### **Parents (Student Monitoring)**
- View children's academic performance
- Access grades in all subjects
- Monitor school fee balance
- Receive fee payment notifications
- Track multiple children (if applicable)

**Demo Credentials:**
- User Type: Parent
- Password: parent123

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx           # Authentication context and login logic
├── componets/
│   ├── Login.jsx                 # Login page for all users
│   ├── Login.css                 # Login page styling
│   ├── AdminDashboard.jsx        # Administrator dashboard
│   ├── AccountantDashboard.jsx   # Accountant dashboard
│   ├── TeacherDashboard.jsx      # Teacher dashboard
│   ├── ParentDashboard.jsx       # Parent dashboard
│   ├── ProtectedRoute.jsx        # Protected route component
│   ├── Unauthorized.jsx          # Access denied page
│   ├── Dashboard.css             # Shared dashboard styling
│   ├── Unauthorized.css          # Unauthorized page styling
│   └── [other existing components]
├── App.jsx                       # Updated with new routing
└── main.jsx                      # Updated with BrowserRouter setup
```

## How to Use

### Installation
1. Install the required dependencies:
```bash
npm install
```

### Running the Application
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port).

### Accessing Different Dashboards

1. **Home Page**: Visit `/` for the public home page
2. **Login**: Visit `/login` to access the login page
3. **Admin Dashboard**: Login as Administrator → Access `/admin-dashboard`
4. **Accountant Dashboard**: Login as Accountant → Access `/accountant-dashboard`
5. **Teacher Dashboard**: Login as Teacher → Access `/teacher-dashboard`
6. **Parent Dashboard**: Login as Parent → Access `/parent-dashboard`

### Available Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/about` | Public | About page |
| `/contact` | Public | Contact page |
| `/login` | Public | Login page |
| `/admin-dashboard` | Admin Only | Administrator dashboard with all features |
| `/accountant-dashboard` | Accountant Only | Fee collection and student balance tracking |
| `/teacher-dashboard` | Teacher Only | Student grades and fee status |
| `/parent-dashboard` | Parent Only | Child performance and fee status |
| `/unauthorized` | All Users | Access denied page |

## Mock Data

The application currently uses **mock data** for demonstration purposes. The following data is available:

### Students Data
- Student names, classes, and marks
- School fee amounts (KES 5000)
- Fee payment information
- Grade assessments

### Teachers Data
- Teacher names and subjects
- Class assignments

### Accountants Data
- Accountant staff information
- Status tracking

> **Note**: In a production environment, this should be replaced with actual backend API calls.

## Technology Stack

- **React 19.2.0** - UI Library
- **React Router DOM 6.20.0** - Client-side routing
- **React Context API** - State management for authentication
- **CSS3** - Styling

## Styling Features

- Modern gradient-based color scheme (Purple to Blue)
- Responsive design for mobile devices
- Interactive dashboards with data visualization
- Smooth transitions and hover effects
- Color-coded status indicators
- Progress bars for performance metrics

## Security Notes

⚠️ **Important**: This is a demonstration application using hardcoded credentials in the frontend. For production use:

1. Move authentication to a secure backend server
2. Use proper password hashing and verification
3. Implement JWT tokens for session management
4. Use HTTPS for all communications
5. Add rate limiting to prevent brute force attacks
6. Implement proper access control on the backend
7. Use environment variables for sensitive data

## Password Reset & Account Management

Currently, the application uses demo credentials. To implement actual user management:

1. Create a backend API for user authentication
2. Implement password reset functionality
3. Add user account management features
4. Store user data securely in a database

## Future Enhancements

- [ ] Backend integration with actual database
- [ ] Payment gateway integration for school fees
- [ ] Email notifications for fee payments
- [ ] Real-time grade updates
- [ ] Advanced reporting and analytics
- [ ] Mobile app version
- [ ] Attendance tracking
- [ ] Leave management system
- [ ] Parent-teacher communication portal
- [ ] Document upload and storage

## Troubleshooting

### Issue: "Access Denied" message
- Ensure you're logged in with the correct role
- Check that your credentials match the role requirements

### Issue: Blank Dashboard
- Clear browser cache and reload
- Ensure JavaScript is enabled

### Issue: Routes not working
- Verify that `react-router-dom` is installed
- Check that BrowserRouter is properly set up in main.jsx

## Support

For issues or questions about the role-based access system, please contact the development team or refer to the React Router documentation.

---

**Last Updated**: April 2026
**Version**: 1.0.0
