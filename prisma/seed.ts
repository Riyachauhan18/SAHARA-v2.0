import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Create Hospitals
  const hospital1 = await prisma.hospital.create({
    data: {
      name: 'City General Hospital',
      district: 'Central',
      latitude: 26.9124,
      longitude: 75.7873,
      address: 'Station Road, Central District',
      phone_emergency: '102',
      is_active: true,
      last_updated_at: new Date(),
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b9af9ef?q=80&w=1000&auto=format&fit=crop',
      facilities: JSON.stringify(["ICU", "Ventilator", "Trauma Center", "MRI", "CT Scan"]),
      type: 'Government',
      website: 'https://health.rajasthan.gov.in',
      email: 'contact@cgh.gov.in',
      description: 'The largest government hospital in the district, fully equipped with modern amenities.',
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000",
        "https://images.unsplash.com/photo-1587351021759-3e566b9af9ef?q=80&w=1000",
        "https://plus.unsplash.com/premium_photo-1682130157004-057c137d96d5?q=80&w=1000",
        "https://images.unsplash.com/photo-1516574187841-693083f69802?q=80&w=1000"
      ]),
      bed_inventory: {
        create: {
          icu_total: 20,
          icu_available: 5,
          general_total: 100,
          general_available: 32,
          pediatric_total: 15,
          pediatric_available: 2,
          maternity_total: 30,
          maternity_available: 10,
          isolation_total: 10,
          isolation_available: 4,
          updated_at: new Date()
        }
      }
    }
  })

  const hospital2 = await prisma.hospital.create({
    data: {
      name: 'District Memorial Hospital',
      district: 'North',
      latitude: 26.9500,
      longitude: 75.8000,
      address: 'Main Highway, North District',
      phone_emergency: '108',
      is_active: true,
      last_updated_at: new Date(),
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop',
      facilities: JSON.stringify(["Emergency", "General Ward", "Pharmacy"]),
      type: 'Government',
      website: 'https://health.rajasthan.gov.in',
      email: 'info@dmh.gov.in',
      description: 'Serving the northern district residents with dedicated care.',
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000",
        "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=1000",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000"
      ]),
      bed_inventory: {
        create: {
          icu_total: 10,
          icu_available: 0, // Full
          general_total: 50,
          general_available: 15,
          pediatric_total: 5,
          pediatric_available: 1,
          maternity_total: 10,
          maternity_available: 3,
          isolation_total: 5,
          isolation_available: 5, // Empty
          updated_at: new Date()
        }
      }
    }
  })

  const hospital3 = await prisma.hospital.create({
    data: {
      name: 'Community Health Center',
      district: 'South',
      latitude: 26.8800,
      longitude: 75.7500,
      address: 'Village Road, South District',
      phone_emergency: '108',
      is_active: true,
      last_updated_at: new Date(), // Stale data can be simulated by setting this to past? No, keep fresh for now.
      image: 'https://images.unsplash.com/photo-1516574187841-693083f69802?q=80&w=1000&auto=format&fit=crop',
      facilities: JSON.stringify(["OPD", "Vaccination", "Basic Lab"]),
      type: 'Government',
      website: 'https://health.rajasthan.gov.in',
      email: 'chc.south@gov.in',
      description: 'Primary health care center for the rural population.',
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1516574187841-693083f69802?q=80&w=1000",
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000"
      ]),
      bed_inventory: {
        create: {
          icu_total: 5,
          icu_available: 1,
          general_total: 30,
          general_available: 20,
          pediatric_total: 0,
          pediatric_available: 0,
          maternity_total: 5,
          maternity_available: 2,
          isolation_total: 2,
          isolation_available: 0,
          updated_at: new Date()
        }
      }
    }
  })

  // 2. Create Blood Banks
  const bloodBank1 = await prisma.bloodBank.create({
    data: {
      name: 'Red Cross Blood Bank',
      district: 'Central',
      latitude: 26.9150,
      longitude: 75.7900,
      phone: '0141-2222222',
      last_updated_at: new Date(),
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1000&auto=format&fit=crop',
      website: 'https://redcross.org',
      email: 'bloodbank@redcross.org',
      operating_hours: '24/7',
      inventory: {
        createMany: {
          data: [
            { blood_group: 'A+', units_available: 10 },
            { blood_group: 'A-', units_available: 2 }, // Low
            { blood_group: 'B+', units_available: 15 },
            { blood_group: 'B-', units_available: 0 }, // Out
            { blood_group: 'AB+', units_available: 5 },
            { blood_group: 'AB-', units_available: 1 }, // Low
            { blood_group: 'O+', units_available: 20 },
            { blood_group: 'O-', units_available: 3 }, // Low
          ]
        }
      }
    }
  })

  // 3. Create Users
  // Passwords are NOT hashed here for simplicity of the prototype/seed. 
  // In a real app, use bcrypt. For now, we assume standard auth flow handles hashing or we use a simple check.
  // Actually, let's just store a placeholder hash "hashed_password" for all.
  const commonPassword = "hashed_password_123"

  await prisma.user.create({
    data: {
      email: 'super_admin@gov.in',
      encrypted_password: commonPassword,
      full_name: 'System Administrator',
      role: 'SUPER_ADMIN'
    }
  })

  await prisma.user.create({
    data: {
      email: 'cmo@district.gov.in',
      encrypted_password: commonPassword,
      full_name: 'Dr. CMO',
      role: 'CMO_ADMIN'
    }
  })

  await prisma.user.create({
    data: {
      email: 'admin@cityhosp.gov.in',
      encrypted_password: commonPassword,
      full_name: 'City Hospital Admin',
      role: 'HOSPITAL_ADMIN',
      hospital_id: hospital1.id
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
