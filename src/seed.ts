import dotenv from 'dotenv';
import { connectDatabase } from './config';
import Permission from './models/Permission';
import User from './models/User';
import ContentPage from './models/ContentPage';
import LoginHistory from './models/LoginHistory';
import ActivityLog from './models/ActivityLog';
import { hashPassword } from './utils/password';

dotenv.config();

async function seed() {
  await connectDatabase();

  const permissions = [
    { key: 'user-management', name: 'User Management', description: 'Access user management module' },
    { key: 'permission-management', name: 'Permission Management', description: 'Manage permissions' },
    { key: 'content-management', name: 'Content Management', description: 'Edit content pages' },
    { key: 'login-history', name: 'Login History', description: 'View login history' },
    { key: 'activity-logs', name: 'Activity Logs', description: 'View activity logs' },
  ];

  await Promise.all(
    permissions.map((permission) =>
      Permission.findOneAndUpdate({ key: permission.key }, permission, { upsert: true, new: true })
    )
  );

  const [adminPassword, subPassword] = await Promise.all([
    hashPassword('Admin123'),
    hashPassword('SubAdmin123'),
  ]);

  const [superAdmin, subAdmin] = await Promise.all([
    User.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      {
        email: 'admin@gmail.com',
        name: 'Super Admin',
        role: 'super-admin',
        passwordHash: adminPassword,
        permissions: permissions.map((perm) => perm.key),
        active: true,
      },
      { upsert: true, new: true }
    ),
    User.findOneAndUpdate(
      { email: 'subadmin@gmail.com' },
      {
        email: 'subadmin@gmail.com',
        name: 'Sub Admin',
        role: 'sub-admin',
        passwordHash: subPassword,
        permissions: ['content-management', 'login-history'],
        active: true,
      },
      { upsert: true, new: true }
    ),
  ]);

  const contentPages = [
    {
      slug: 'home-content',
      title: 'Home Content',
      body: 'Welcome to the admin dashboard. Use the sidebar to manage users, permissions, and website content from one place.',
    },
    {
      slug: 'about-content',
      title: 'About Content',
      body: 'This section holds the public about page content. Update it to explain what your organization does and who is responsible.',
    },
    {
      slug: 'product-content',
      title: 'Product Content',
      body: 'Use this area to manage product details, descriptions, and pricing information that appears on your public site.',
    },
  ];

  await Promise.all(
    contentPages.map((page) =>
      ContentPage.findOneAndUpdate({ slug: page.slug }, { ...page, updatedBy: 'system' }, { upsert: true, new: true })
    )
  );

  await LoginHistory.deleteMany({});
  await ActivityLog.deleteMany({});

  await LoginHistory.insertMany([
    {
      user: superAdmin._id,
      email: superAdmin.email,
      status: 'success',
      device: 'MacBook Pro',
      browser: 'Safari 17',
      loginAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      user: subAdmin._id,
      email: subAdmin.email,
      status: 'success',
      device: 'Windows 11 Laptop',
      browser: 'Chrome 125',
      loginAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      email: 'unknown@example.com',
      status: 'failed',
      device: 'Android Phone',
      browser: 'Chrome Mobile',
      loginAt: new Date(Date.now() - 1000 * 60 * 10),
    },
  ]);

  await ActivityLog.insertMany([
    {
      user: superAdmin._id,
      email: superAdmin.email,
      action: 'seed-data',
      target: 'dashboard',
      details: 'Seeded initial dashboard users, permissions, and content',
    },
    {
      user: subAdmin._id,
      email: subAdmin.email,
      action: 'seed-data',
      target: 'login-history',
      details: 'Seeded initial login history and demo content pages',
    },
  ]);

  console.log('Seed completed.');
  console.log('Super Admin: admin@gmail.com / Admin123');
  console.log('Sub Admin: subadmin@gmail.com / SubAdmin123');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
