
import prisma from './src/lib/prisma'

async function main() {
    const hospital = await prisma.hospital.findFirst({
        where: {
            photos: {
                not: "[]"
            }
        }
    })

    console.log('Hospital found:', hospital?.name)
    console.log('Photos:', hospital?.photos)
    console.log('Image:', hospital?.image)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
