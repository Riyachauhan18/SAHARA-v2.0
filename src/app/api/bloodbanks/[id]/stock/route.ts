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
        (user.role === 'BLOOD_BANK_ADMIN' && user.blood_bank_id === id);

    if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { blood_group, units_available } = body;

    if (!blood_group || units_available === undefined) {
        return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }

    try {
        // Get previous value for audit
        const previousStock = await prisma.bloodInventory.findUnique({
            where: {
                blood_bank_id_blood_group: {
                    blood_bank_id: id,
                    blood_group: blood_group
                }
            }
        });

        const result = await prisma.$transaction(async (tx) => {
            // 1. Upsert Blood Inventory
            const updatedStock = await tx.bloodInventory.upsert({
                where: {
                    blood_bank_id_blood_group: {
                        blood_bank_id: id,
                        blood_group: blood_group
                    }
                },
                update: {
                    units_available: units_available,
                    updated_at: new Date(),
                    updated_by_id: user.id
                },
                create: {
                    blood_bank_id: id,
                    blood_group: blood_group,
                    units_available: units_available,
                    updated_by_id: user.id
                }
            });

            // 2. Update Blood Bank Timestamp
            await tx.bloodBank.update({
                where: { id },
                data: { last_updated_at: new Date() }
            });

            // 3. Audit Log
            await tx.auditLog.create({
                data: {
                    entity_type: 'blood_stock',
                    entity_id: id,
                    action_type: 'UPDATE',
                    performed_by_id: user.id,
                    previous_value: JSON.stringify(previousStock || {}),
                    new_value: JSON.stringify(updatedStock),
                    timestamp: new Date()
                }
            });

            return updatedStock;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Update failed", error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
