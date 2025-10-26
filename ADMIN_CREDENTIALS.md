# Admin Login Credentials

## Default System Credentials

### Super Admin Access
- **Username:** `superadmin`
- **Password:** `superadmin2024!`
- **Access:** Full admin panel access, can manage users and system settings

### Admin Access  
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Dashboard access, can manage donations

## Security Notes

⚠️ **Important:** These are default credentials for initial setup. In production:

1. **Change these passwords immediately** after first login
2. **Create new admin users** through the admin panel
3. **Disable or modify** these default accounts
4. **Use strong passwords** for all accounts

## User Management

- Super admins can create new users through the admin panel
- Users can have different roles: `superadmin`, `admin`, `user`
- Users can have different statuses: `active`, `limited`, `blocked`
- Limited users can only delete donations
- Active users have full access to all features

## Access Levels

### Super Admin (`superadmin`)
- ✅ Admin panel access
- ✅ User management
- ✅ System settings
- ✅ All donation management

### Admin (`admin`) 
- ✅ Dashboard access
- ✅ Donation management
- ❌ User management
- ❌ Admin panel access

### Regular User (`user`)
- ✅ Dashboard access (if active)
- ✅ Limited permissions based on status
- ❌ Admin functions
