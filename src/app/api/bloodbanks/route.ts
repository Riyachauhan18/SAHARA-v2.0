import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const blood_group = searchParams.get('blood_group'); // Filter blood banks having specific group > 0?

    const whereClause: any = {};
    if (district) {
        whereClause.district = { contains: district };
    }

    // If specific blood group requested, we might want to filter banks that have it?
    // For MVP, just return all banks and their inventory.

    const bloodBanks = await prisma.bloodBank.findMany({
        where: whereClause,
        include: {
            inventory: true
        },
        orderBy: {
            last_updated_at: 'desc'
        }
    });

    return NextResponse.json(bloodBanks);
}
