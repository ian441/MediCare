import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seed.');
    return;
  }

  // Hash the default admin password
  const passwordHash = await hashPassword('admin123!');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medicare.com',
      firstName: 'System',
      lastName: 'Administrator',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);
  console.log('   Default password: admin123!');
  console.log('   Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });