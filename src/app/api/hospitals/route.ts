import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure live data

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const type = searchParams.get('type'); // 'icu', 'general', etc. (not strictly used in prisma query via generic filter, but can filter in code or smart query)

    // Build query
    const whereClause: any = { is_active: true };
    if (district) {
        whereClause.district = { contains: district }; // SQLite contains is case-sensitive usually? Prisma handles it.
    }
    const id = searchParams.get('id');
    if (id) {
        whereClause.id = id;
    }

    // Optimize query to fetch relations
    const hospitals = await prisma.hospital.findMany({
        where: whereClause,
        include: {
            bed_inventory: true
        },
        orderBy: {
            last_updated_at: 'desc'
        }
    });

    // Calculate generic availability status for simplified list?
    // We return raw data, frontend handles display logic (Available/Full).

    return NextResponse.json(hospitals);
}
