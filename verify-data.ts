
import prisma from './src/lib/prisma'

async function main() {
    console.log('Verifying new database fields...')
    try {
        const hospital = await prisma.hospital.findFirst({
            where: { name: 'City General Hospital' }
        })

        if (hospital) {
            console.log('Hospital found:', hospital.name)
            console.log('Image URL:', hospital.image)
            console.log('Facilities:', hospital.facilities)
            console.log('Type:', hospital.type)
        } else {
            console.log('Hospital not found!')
        }

        const bloodBank = await prisma.bloodBank.findFirst({
            where: { name: 'Red Cross Blood Bank' }
        })

        if (bloodBank) {
            console.log('Blood Bank found:', bloodBank.name)
            console.log('Image URL:', bloodBank.image)
            console.log('Operating Hours:', bloodBank.operating_hours)
        }

    } catch (e) {
        console.error('Verification failed:', e)
    }
}

main()
