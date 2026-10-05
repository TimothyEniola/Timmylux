import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@timmylux.com' },
    update: {},
    create: {
      email: 'superadmin@timmylux.com',
      passwordHash: superAdminPassword,
      name: 'Super Admin',
      role: 'SUPERADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // Create Admin
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@timmylux.com' },
    update: {},
    create: {
      email: 'admin@timmylux.com',
      passwordHash: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create Sample Customer
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      name: 'John Doe',
      phone: '+2348012345678',
      role: 'CUSTOMER',
      isVerified: true,
    },
  });
  console.log('✅ Sample customer created:', customer.email);

  // Load and seed products from JSON file (if exists)
  const productsFilePath = path.join(__dirname, 'products.json');
  
  if (fs.existsSync(productsFilePath)) {
    console.log('📦 Loading products from products.json...');
    
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

    for (const productData of productsData) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          category: productData.category,
          collection: productData.collection,
          price: productData.price,
          originalPrice: productData.originalPrice,
          description: productData.description,
          featured: productData.featured || false,
          featuredExpiry: productData.featuredExpiry 
            ? new Date(productData.featuredExpiry) 
            : null,
          available: productData.available !== false,
          images: productData.images || [],
          variations: productData.variations
            ? {
                create: productData.variations.map((v: any) => ({
                  name: v.name,
                  price: v.price,
                  color: v.color,
                  material: v.material,
                  image: v.image,
                })),
              }
            : undefined,
        },
      });
      console.log(`  ✅ Created product: ${product.name}`);
    }
  } else {
    // Create sample products if no JSON file
    console.log('📦 Creating sample products...');

    const sampleProducts = [
      {
        name: 'Luxury Leather Bag',
        category: 'Bags',
        collection: 'Premium',
        price: 45000,
        originalPrice: 55000,
        description: 'Premium quality leather bag with elegant design',
        featured: true,
        images: [
          'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        ],
        variations: [
          {
            name: 'Black',
            color: 'Black',
            material: 'Genuine Leather',
          },
          {
            name: 'Brown',
            color: 'Brown',
            material: 'Genuine Leather',
          },
        ],
      },
      {
        name: 'Designer Clutch',
        category: 'Bags',
        collection: 'Evening',
        price: 25000,
        description: 'Elegant evening clutch for special occasions',
        featured: false,
        images: [
          'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        ],
      },
      {
        name: 'Classic Tote Bag',
        category: 'Bags',
        collection: 'Casual',
        price: 35000,
        originalPrice: 42000,
        description: 'Spacious tote bag perfect for everyday use',
        featured: true,
        images: [
          'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        ],
      },
    ];

    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          variations: productData.variations
            ? { create: productData.variations }
            : undefined,
        },
      });
      console.log(`  ✅ Created product: ${product.name}`);
    }
  }

  // Create sample coupons
  console.log('🎟️  Creating sample coupons...');
  
  const coupons = [
    {
      code: 'WELCOME10',
      discount: 10,
      type: 'percentage',
      expiryDate: new Date('2024-12-31'),
      active: true,
    },
    {
      code: 'SAVE5000',
      discount: 5000,
      type: 'fixed',
      expiryDate: new Date('2024-12-31'),
      active: true,
    },
  ];

  for (const couponData of coupons) {
    const coupon = await prisma.coupon.upsert({
      where: { code: couponData.code },
      update: {},
      create: couponData,
    });
    console.log(`  ✅ Created coupon: ${coupon.code}`);
  }

  // Create sample event
  console.log('🎉 Creating sample event...');
  
  const event = await prisma.event.create({
    data: {
      title: 'Summer Sale 2024',
      description: 'Get up to 30% off on all items',
      type: 'SALE',
      startDate: new Date(),
      endDate: new Date('2024-08-31'),
      isActive: true,
      discountPercentage: 30,
      promoCode: 'SUMMER30',
    },
  });
  console.log(`  ✅ Created event: ${event.title}`);

  console.log('✅ Database seeding completed!');
  console.log('\n📝 Default Credentials:');
  console.log('Super Admin: superadmin@timmylux.com / SuperAdmin@123');
  console.log('Admin: admin@timmylux.com / Admin@123');
  console.log('Customer: customer@example.com / Customer@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });