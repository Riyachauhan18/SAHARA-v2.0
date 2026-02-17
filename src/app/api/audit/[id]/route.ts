import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = session.user as any;

    // Authorization: Only allow viewing logs for own entity or if Super/CMO
    const isAuthorized =
        user.role === 'SUPER_ADMIN' ||
        user.role === 'CMO_ADMIN' ||
        (user.role === 'HOSPITAL_ADMIN' && user.hospital_id === id) ||
        (user.role === 'BLOOD_BANK_ADMIN' && user.blood_bank_id === id);

    if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
        where: {
            entity_id: id
        },
        orderBy: {
            timestamp: 'desc'
        },
        take: 50, // Limit to last 50
        include: {
            performed_by: {
                select: { full_name: true, role: true }
            }
        }
    });

    return NextResponse.json(logs);
}
