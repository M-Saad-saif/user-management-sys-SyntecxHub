# Employee Management System (MERN Stack)

A complete, production-ready Employee Management System built with MongoDB, Express.js, React.js, and Node.js. Features JWT authentication, role-based authorization, and a clean professional UI built with pure CSS (no Tailwind).

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Change password functionality

### Admin Features
- **Dashboard**: View statistics, recent employees, department-wise data
- **Employee Management**: Add, edit, delete, view employees with profile pictures
- **Department Management**: Create, update, delete departments
- **Leave Management**: Approve/reject employee leave requests
- **Salary Management**: Update employee salaries by department
- **Settings**: Change password and manage profile

### Employee Features
- **Dashboard**: View personal info, salary, leave statistics
- **Apply Leave**: Submit leave applications
- **Leave History**: View all leave applications and their status
- **Settings**: Change password and update personal details

## 📁 Project Structure

```
employee-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── departmentController.js
│   │   ├── leaveController.js
│   │   ├── salaryController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Department.js
│   │   ├── Leave.js
│   │   └── Salary.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── salaryRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── uploadConfig.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── employee/
    │   │   └── Login.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   ├── utils/
    │   │   └── ProtectedRoute.jsx
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── .env
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **Pure CSS** - Styling (no Tailwind)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the content below and update as needed
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development

# Start MongoDB (if not already running)
# On Windows: net start MongoDB
# On Mac/Linux: sudo systemctl start mongod

# Run the backend server
npm run dev
# or
npm start
```

The backend server will start on http://localhost:5000

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
REACT_APP_API_URL=http://localhost:5000/api

# Start the React app
npm start
```

The frontend will start on http://localhost:3000

## 🗄️ Database Setup

### Create Admin User

After starting the backend, you need to create an admin user. You can use MongoDB Compass or mongo shell:

```javascript
// Connect to MongoDB
use employee_management

// Create a department first
db.departments.insertOne({
  name: "Administration",
  description: "Administrative Department",
  createdAt: new Date()
})

// Get the department ID
const deptId = db.departments.findOne({name: "Administration"})._id

// Create admin employee
db.employees.insertOne({
  fullName: "Admin User",
  email: "admin@example.com",
  age: 30,
  gender: "Male",
  phone: "1234567890",
  address: "Admin Address",
  department: deptId,
  salary: 100000,
  profilePicture: "",
  dateJoined: new Date(),
  createdAt: new Date()
})

// Get the employee ID
const empId = db.employees.findOne({email: "admin@example.com"})._id

// Create admin user account
// Password: admin123 (hashed)
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$rZ5qGXQqF3qXqZRYqYQx9.YxGqYqXqZRYqYQx9.YxGqYqXqZRYqYQx9", // admin123
  role: "admin",
  employee: empId,
  createdAt: new Date()
})
```

**Note**: The password hash above is for demonstration. In production, use the actual bcrypt hash. You can also use the API to create users after manually creating the first admin.

### Or Use This Script

Create a file `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create department
    let dept = await Department.findOne({ name: 'Administration' });
    if (!dept) {
      dept = await Department.create({
        name: 'Administration',
        description: 'Administrative Department'
      });
    }

    // Create employee
    let employee = await Employee.findOne({ email: 'admin@example.com' });
    if (!employee) {
      employee = await Employee.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        age: 30,
        gender: 'Male',
        phone: '1234567890',
        address: 'Admin Address',
        department: dept._id,
        salary: 100000
      });
    }

    // Create user
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (!existingUser) {
      await User.create({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        employee: employee._id
      });
      console.log('Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run it with:
```bash
node scripts/createAdmin.js
```

## 🔐 Default Login Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Employee Account:**
- Create through admin panel after logging in as admin

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `PUT /api/auth/update-profile` - Update profile

### Employees
- `GET /api/employees` - Get all employees (Admin)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin)
- `PUT /api/employees/:id` - Update employee (Admin)
- `DELETE /api/employees/:id` - Delete employee (Admin)
- `GET /api/employees/department/:departmentId` - Get employees by department (Admin)

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/:id` - Update department (Admin)
- `DELETE /api/departments/:id` - Delete department (Admin)

### Leaves
- `GET /api/leaves` - Get all leaves (Admin)
- `GET /api/leaves/my-leaves` - Get employee's leaves (Employee)
- `GET /api/leaves/employee/:employeeId` - Get leaves by employee (Admin)
- `POST /api/leaves` - Apply for leave (Employee)
- `PUT /api/leaves/:id/status` - Update leave status (Admin)
- `DELETE /api/leaves/:id` - Delete leave

### Salary
- `GET /api/salary` - Get all salary records (Admin)
- `GET /api/salary/my-salary` - Get employee's salary history (Employee)
- `GET /api/salary/employee/:employeeId` - Get salary history (Admin)
- `POST /api/salary/:employeeId` - Update employee salary (Admin)

### Dashboard
- `GET /api/dashboard/admin` - Get admin dashboard stats (Admin)
- `GET /api/dashboard/employee` - Get employee dashboard (Employee)

## 🎨 UI Features

- Clean, professional design with pure CSS
- Responsive layout (mobile-friendly)
- Smooth transitions and hover effects
- Card-based dashboard
- Table-based data display
- Modal dialogs
- Form validation
- Loading states
- Error handling

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Protected API routes
- Input validation
- Error handling middleware
- CORS enabled
- XSS protection

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is updated
3. Deploy the backend folder

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the production version: `npm run build`
2. Set `REACT_APP_API_URL` to your backend URL
3. Deploy the build folder

### MongoDB Deployment

Use MongoDB Atlas for cloud database:
1. Create a cluster on MongoDB Atlas
2. Get the connection string
3. Update `MONGODB_URI` in backend .env

## 📝 Usage

### Admin Workflow
1. Login as admin
2. Create departments
3. Add employees
4. Manage leave requests
5. Update salaries
6. View dashboard statistics

### Employee Workflow
1. Login with credentials
2. View dashboard
3. Apply for leave
4. Check leave history
5. Update profile
6. Change password

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

**Built with MERN Stack**
