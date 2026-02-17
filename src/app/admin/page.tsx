"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, AlertTriangle, TrendingUp, Activity } from "lucide-react"

// Admin Components
import HospitalAdminView from "@/components/admin/hospital-admin-view"

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    // Fetch stats for CMO
    useEffect(() => {
        if (session?.user && ((session.user as any).role === 'CMO_ADMIN' || (session.user as any).role === 'SUPER_ADMIN')) {
            fetch('/api/stats')
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(console.error)
        }
    }, [session])

    if (status === "loading") {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
    }

    if (!session?.user) return null

    const role = (session.user as any).role

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Welcome, {session.user.name} ({role})</p>
                </div>
                <button
                    onClick={() => router.push("/api/auth/signout")}
                    className="text-sm text-red-600 hover:underline"
                >
                    Sign Out
                </button>
            </div>

            {role === "HOSPITAL_ADMIN" && (
                <HospitalAdminView hospitalId={(session.user as any).hospital_id} />
            )}

            {(role === "CMO_ADMIN" || role === "SUPER_ADMIN") && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Total District ICU Beds" value={stats?.beds?.icu_available + " / " + stats?.beds?.icu_total} icon={<Activity />} />
                        <StatCard label="General Beds Available" value={stats?.beds?.general_available} icon={<TrendingUp />} />
                        <StatCard label="Non-Compliant Hospitals" value={stats?.flagged_hospitals?.length} icon={<AlertTriangle className="text-red-500" />} />
                    </div>

                    {stats?.flagged_hospitals?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <h3 className="font-bold text-red-800 mb-2">Action Required: Stale Data</h3>
                            <ul className="list-disc pl-5 text-red-700">
                                {stats.flagged_hospitals.map((h: string) => (
                                    <li key={h}>{h} (Update overdue &gt; 60 mins)</li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Send WhatsApp Reminders</button>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 border p-12 text-center text-gray-500 rounded-lg">
                        Detailed Analytics & Reporting Module coming in Phase 2
                    </div>
                </div>
            )}

            {role === "BLOOD_BANK_ADMIN" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
                    Blood Bank Inventory Management - Check Public Dashboard for current status.
                </div>
            )}
        </div>
    )
}

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <p className="text-3xl font-bold mt-2">{value ?? '-'}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                {icon}
            </div>
        </div>
    )
}
