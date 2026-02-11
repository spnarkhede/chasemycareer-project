# 🔐 ChaseMyCareer - Dummy User Credentials

## Test Users Created Successfully! ✅

Three dummy users have been created in the database with complete profiles, 50-day tasks, and sample job applications.

---

## 👤 User Accounts

### 1. Admin User (Full Access)

**Email:** `admin@jobtracker.test`  
**Password:** `AdminTest123!@#`  
**Role:** Admin  
**Access Level:** Full administrative access

**Profile:**
- Full Name: Admin User
- Role: admin
- Tasks Completed: 5/50 (10%)
- Job Applications: 3
  - Google - Senior Software Engineer (Interview)
  - Microsoft - Product Manager (Applied)
  - Apple - Engineering Manager (Screening)

---

### 2. Regular Test User

**Email:** `user@jobtracker.test`  
**Password:** `UserTest123!@#`  
**Role:** User  
**Access Level:** Standard user access

**Profile:**
- Full Name: Test User
- Role: user
- Tasks Completed: 3/50 (6%)
- Job Applications: 3
  - Amazon - Software Development Engineer (Applied)
  - Meta - Frontend Engineer (Rejected)
  - Netflix - Backend Engineer (Interview)

---

### 3. Ashwini Kumar (Easy Password)

**Email:** `ashwini@cmc.com`  
**Password:** `Ashwini123`  
**Role:** User  
**Access Level:** Standard user access

**Profile:**
- Full Name: Ashwini Kumar
- Role: user
- Tasks Completed: 2/50 (4%)
- Job Applications: 3
  - Apple - iOS Developer (Interview)
  - Netflix - Full Stack Engineer (Applied)
  - Spotify - Mobile Developer (Screening)

---

## 📊 Database Summary

### Users Created
- ✅ 3 users in auth.users table
- ✅ 3 profiles in profiles table
- ✅ 150 daily tasks (50 per user)
- ✅ 9 job applications (3 per user)

### Task Completion Status
- Admin: 5 tasks completed (Days 1-5)
- Test User: 3 tasks completed (Days 1-3)
- Ashwini: 2 tasks completed (Days 1-2)

### Application Status Distribution
- Applied: 3 applications
- Interview: 3 applications
- Screening: 2 applications
- Rejected: 1 application

---

## 🚀 How to Login

### Frontend Login

1. Open the application: http://localhost:5173
2. Click "Login" button
3. Enter one of the email/password combinations above
4. Click "Sign In"

### Testing Different Roles

**Admin User:**
- Can access admin dashboard
- Can view all users
- Can manage system settings
- Full access to all features

**Regular Users:**
- Can access personal dashboard
- Can manage own tasks and applications
- Can track job search progress
- Standard user features only

---

## 🧪 Testing Scenarios

### Scenario 1: Admin Workflow
1. Login as `admin@jobtracker.test`
2. View admin dashboard
3. See all users in the system
4. Check analytics and statistics
5. Manage user accounts

### Scenario 2: User Workflow
1. Login as `user@jobtracker.test` or `ashwini@cmc.com`
2. View personal dashboard
3. Complete daily tasks
4. Add/edit job applications
5. Track interview progress
6. View networking contacts

### Scenario 3: Task Completion
1. Login as any user
2. Go to 50-Day Plan page
3. Mark tasks as complete
4. See progress percentage update
5. View completed tasks history

### Scenario 4: Job Application Tracking
1. Login as any user
2. Go to Job Tracker page
3. View existing applications
4. Add new application
5. Update application status
6. Filter by status

---

## 📝 Notes

### Password Requirements
- Admin & Test User: Strong passwords with special characters
- Ashwini: Simple, easy-to-remember password (Ashwini123)

### Data Persistence
- All data is stored in Supabase PostgreSQL database
- Data persists across sessions
- Users can login from any device

### Security
- Passwords are hashed in the database
- JWT tokens used for authentication
- Session management handled by Supabase Auth

---

## 🔄 Reset Instructions

If you need to reset the dummy users:

```bash
cd /workspace/chasemycareer/scripts
npm run create-users
```

Or manually via SQL:

```sql
-- Delete all data for dummy users
DELETE FROM daily_tasks WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '5d398079-fd02-4392-82b5-d656d4a98da7'
);

DELETE FROM job_applications WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '5d398079-fd02-4392-82b5-d656d4a98da7'
);

DELETE FROM profiles WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '5d398079-fd02-4392-82b5-d656d4a98da7'
);
```

---

## ✅ Verification Checklist

- [x] Admin user created with admin role
- [x] Test user created with user role
- [x] Ashwini user created with easy password
- [x] All users have profiles
- [x] Each user has 50 daily tasks
- [x] Some tasks marked as completed
- [x] Each user has 3 job applications
- [x] Applications have different statuses
- [x] All users can login successfully

---

## 🎯 Quick Reference

| User | Email | Password | Role | Tasks | Apps |
|------|-------|----------|------|-------|------|
| Admin | admin@jobtracker.test | AdminTest123!@# | admin | 5/50 | 3 |
| Test User | user@jobtracker.test | UserTest123!@# | user | 3/50 | 3 |
| Ashwini | ashwini@cmc.com | Ashwini123 | user | 2/50 | 3 |

---

**Created:** January 2, 2026  
**Status:** ✅ Active and Ready to Use  
**Database:** Supabase PostgreSQL  
**Application:** ChaseMyCareer Job Tracker

---

## 🔗 Related Documentation

- **Frontend README:** `/workspace/chasemycareer/frontend/README.md`
- **Backend README:** `/workspace/chasemycareer/backend-api/README.md`
- **Setup Guide:** `/workspace/chasemycareer/SETUP_GUIDE.md`
- **Refactoring Complete:** `/workspace/chasemycareer/REFACTORING_COMPLETE.md`

---

**Happy Testing! 🚀**
