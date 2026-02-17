
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const json = await request.json()

        // Create a new hospital with empty default inventory
        const hospital = await prisma.hospital.create({
            data: {
                ...json,
                // Ensure default bed inventory is created
                bed_inventory: {
                    create: {
                        icu_total: 0,
                        icu_available: 0,
                        general_total: 0,
                        general_available: 0,
                        pediatric_total: 0,
                        pediatric_available: 0,
                        maternity_total: 0,
                        maternity_available: 0,
                        isolation_total: 0,
                        isolation_available: 0
                    }
                }
            },
        })

        return NextResponse.json(hospital)
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Failed to register hospital' }, { status: 500 })
    }
}
