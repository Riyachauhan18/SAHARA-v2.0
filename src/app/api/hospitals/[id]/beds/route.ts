import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+, params is a Promise
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = session.user as any;

    // Authorization Check
    const isAuthorized =
        user.role === 'SUPER_ADMIN' ||
        user.role === 'CMO_ADMIN' ||
        (user.role === 'HOSPITAL_ADMIN' && user.hospital_id === id);

    if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validation (Simple)
    // We expect partial updates or full updates.
    // body = { icu_available: 5, general_available: 10, ... }

    try {
        // Determine previous values for audit log
        const previousInventory = await prisma.bedInventory.findUnique({
            where: { hospital_id: id }
        });

        // Transaction: Update Inventory + Update Hospital Timestamp + Create Audit Log
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Inventory
            const updatedInventory = await tx.bedInventory.update({
                where: { hospital_id: id },
                data: {
                    ...body,
                    updated_at: new Date(),
                    updated_by_id: user.id
                }
            });

            // 2. Update Hospital Timestamp
            await tx.hospital.update({
                where: { id },
                data: { last_updated_at: new Date() }
            });

            // 3. Create Audit Log
            await tx.auditLog.create({
                data: {
                    entity_type: 'hospital_bed',
                    entity_id: id,
                    action_type: 'UPDATE',
                    performed_by_id: user.id,
                    previous_value: JSON.stringify(previousInventory),
                    new_value: JSON.stringify(updatedInventory),
                    timestamp: new Date(),
                    // ip_address: headers().get('x-forwarded-for') // Optional
                }
            });

            return updatedInventory;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Update failed", error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
