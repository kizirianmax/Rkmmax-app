# 🧪 Testing the OWNER Authentication System

This document provides testing instructions for the newly implemented OWNER authentication system.

## Prerequisites

Before testing, ensure:

1. ✅ Supabase is configured with proper environment variables
2. ✅ Owner user is created in Supabase Auth (see SETUP_INSTRUCTIONS.md)
3. ✅ Application is running locally or deployed

## Test Cases

### 1. Login Flow

#### Test 1.1: Owner Login
**Steps:**
1. Navigate to `/login`
2. Enter email: `robertokizirianmax@gmail.com`
3. Enter password: `Admin@2026!RKM` (or your changed password)
4. Click "Entrar"

**Expected:**
- ✅ Login successful
- ✅ Redirected to `/owner-dashboard`
- ✅ Owner badge appears in header: "👑 DONO | ILIMITADO ∞"
- ✅ Owner menu appears with 3 links

**If Fails:**
- Check console for errors
- Verify Supabase credentials in environment variables
- Ensure owner user exists in Supabase Auth

#### Test 1.2: Regular User Login
**Steps:**
1. Create a test user in Supabase
2. Login with test user credentials

**Expected:**
- ✅ Login successful
- ✅ Redirected to `/` (home)
- ❌ No owner badge appears
- ❌ No owner menu appears

---

### 2. Owner Dashboard

#### Test 2.1: Access Dashboard
**Steps:**
1. Login as owner
2. Navigate to `/owner-dashboard`

**Expected:**
- ✅ Page loads successfully
- ✅ 4 stat cards visible (Acesso, Mensagens, Custo, Status)
- ✅ Configurations section shows all bypasses active
- ✅ User simulator component visible
- ✅ Quick actions buttons visible

#### Test 2.2: Non-Owner Access Attempt
**Steps:**
1. Login as regular user
2. Try to navigate to `/owner-dashboard`

**Expected:**
- ❌ Access denied
- ✅ Redirected to `/`

---

### 3. User Simulator

#### Test 3.1: Simulate Basic User
**Steps:**
1. On owner dashboard, find User Simulator
2. Select "🟢 Usuário Básico"

**Expected:**
- ✅ Warning message appears
- ✅ Shows limitations:
  - Apenas Serginho disponível
  - 10 mensagens por dia
  - Paywall ativo

#### Test 3.2: Return to Owner Mode
**Steps:**
1. Select "👑 Modo Dono (Atual)"

**Expected:**
- ✅ Returns to owner privileges
- ✅ Shows unlimited access

---

### 4. User Management

#### Test 4.1: View Users
**Steps:**
1. Click "👥 Usuários" in owner menu
2. Or navigate to `/user-management`

**Expected:**
- ✅ Page loads
- ✅ Users table visible
- ✅ Owner user listed with role "👑 Owner"
- ✅ Filter dropdown works

#### Test 4.2: Filter Users
**Steps:**
1. On user management page
2. Change filter dropdown to different roles

**Expected:**
- ✅ Table updates to show filtered users
- ✅ "Nenhum usuário encontrado" message if filter has no results

---

### 5. Change Password

#### Test 5.1: Change Password
**Steps:**
1. Navigate to `/change-password`
2. Enter current password
3. Enter new password (min 8 chars, uppercase, lowercase, numbers)
4. Confirm new password
5. Click "Trocar Senha"

**Expected:**
- ✅ Success message appears
- ✅ Redirected to dashboard after 2 seconds
- ✅ New password works on next login
- ❌ Old password no longer works

#### Test 5.2: Password Validation
**Steps:**
1. Try passwords that don't meet requirements:
   - Less than 8 characters
   - No uppercase letters
   - No numbers

**Expected:**
- ❌ Error message appears
- ❌ Password not changed

---

### 6. Access Control

#### Test 6.1: Owner Access to All Specialists
**Steps:**
1. Login as owner
2. Navigate to `/specialists`

**Expected:**
- ✅ All 54 specialists visible
- ✅ Can click and access any specialist
- ✅ No limit messages

#### Test 6.2: API Access Check
**Steps:**
1. Make API call to `/api/check-access`
2. Body: `{ "email": "robertokizirianmax@gmail.com" }`

**Expected:**
- ✅ Returns status 200
- ✅ Response includes:
  ```json
  {
    "allowed": true,
    "unlimited": true,
    "reason": "OWNER_FULL_ACCESS",
    "role": "OWNER"
  }
  ```

---

### 7. Owner Badge & Menu

#### Test 7.1: Badge Visibility
**Steps:**
1. Login as owner
2. Check header

**Expected:**
- ✅ Golden badge visible with crown icon
- ✅ Text: "DONO | ILIMITADO ∞"
- ✅ Animated glow effect

#### Test 7.2: Menu Links
**Steps:**
1. Check owner menu in header
2. Click each link

**Expected:**
- ✅ "👑 Dashboard" → `/owner-dashboard`
- ✅ "👥 Usuários" → `/user-management`
- ✅ "🔑 Trocar Senha" → `/change-password`

---

### 8. Protected Routes

#### Test 8.1: Owner Route Protection
**Steps:**
1. Logout
2. Try to access `/owner-dashboard` directly

**Expected:**
- ❌ Access denied
- ✅ Redirected to `/`

#### Test 8.2: Regular User Attempt
**Steps:**
1. Login as regular user
2. Try to access `/owner-dashboard`

**Expected:**
- ❌ Access denied
- ✅ Redirected to `/`

---

### 9. API Endpoints

#### Test 9.1: Owner Stats API
**Request:**
```bash
curl -X GET "http://localhost:3000/api/owner/stats?email=robertokizirianmax@gmail.com"
```

**Expected:**
- ✅ Status 200
- ✅ Returns stats object with users, messages, revenue, etc.

#### Test 9.2: Owner Users API
**Request:**
```bash
curl -X GET "http://localhost:3000/api/owner/users?email=robertokizirianmax@gmail.com"
```

**Expected:**
- ✅ Status 200
- ✅ Returns array of users

#### Test 9.3: Unauthorized Access
**Request:**
```bash
curl -X GET "http://localhost:3000/api/owner/stats?email=other@example.com"
```

**Expected:**
- ❌ Status 403
- ✅ Error: "Forbidden"

---

## Console Logs

When testing as owner, check browser console (F12) for:

```javascript
👑 OWNER ACTION: {
  timestamp: "...",
  user: "robertokizirianmax@gmail.com",
  action: "...",
  details: {...}
}
```

---

## Debugging Tips

### If Login Doesn't Work:
1. Check browser console for errors
2. Verify Supabase environment variables
3. Check if user exists in Supabase Auth dashboard
4. Try resetting password in Supabase

### If Badge Doesn't Appear:
1. Hard refresh (Ctrl+Shift+R)
2. Clear localStorage and cookies
3. Check if role is properly set in user metadata

### If Routes Are Not Protected:
1. Check console for authentication errors
2. Verify AuthProvider is wrapping the app
3. Check if user object has correct role

---

## Success Criteria

All tests pass when:

- ✅ Owner can login and see dashboard
- ✅ Owner badge appears correctly
- ✅ All 54 specialists are accessible
- ✅ No message/token limits for owner
- ✅ Cost shows R$ 0,00
- ✅ User management works
- ✅ Password change works
- ✅ Protected routes work
- ✅ API endpoints respond correctly
- ✅ Regular users cannot access owner features

---

## Reporting Issues

If you find bugs, please report:

1. What test failed
2. Expected behavior
3. Actual behavior
4. Browser console errors
5. Screenshots if applicable

---

**Happy Testing! 🧪**
