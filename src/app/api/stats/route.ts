import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only CMO/Super can view aggregate stats
    const user = session.user as any;
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'CMO_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Aggregate stats
    const hospitals = await prisma.hospital.findMany({
        include: { bed_inventory: true }
    });

    const stats = {
        total_hospitals: hospitals.length,
        active_hospitals: hospitals.filter(h => h.is_active).length,
        beds: {
            icu_total: 0, icu_available: 0,
            general_total: 0, general_available: 0,
            maternity_total: 0, maternity_available: 0
        },
        flagged_hospitals: [] as string[]
    };

    hospitals.forEach(h => {
        if (h.bed_inventory) {
            stats.beds.icu_total += h.bed_inventory.icu_total;
            stats.beds.icu_available += h.bed_inventory.icu_available;
            stats.beds.general_total += h.bed_inventory.general_total;
            stats.beds.general_available += h.bed_inventory.general_available;
            stats.beds.maternity_total += h.bed_inventory.maternity_total;
            stats.beds.maternity_available += h.bed_inventory.maternity_available;
        }

        // Check stale
        const lastUpdated = h.bed_inventory?.updated_at ? new Date(h.bed_inventory.updated_at) : (h.last_updated_at ? new Date(h.last_updated_at) : new Date(0));
        const mins = (new Date().getTime() - lastUpdated.getTime()) / 60000;
        if (mins > 60) {
            stats.flagged_hospitals.push(h.name);
        }
    });

    return NextResponse.json(stats);
}
