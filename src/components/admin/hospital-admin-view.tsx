"use client"

import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import AuditLogViewer from "@/components/admin/audit-log-viewer"

export default function HospitalAdminView({ hospitalId }: { hospitalId: string }) {
    const [loading, setLoading] = useState(true)
    const [hospital, setHospital] = useState<any>(null)
    const [beds, setBeds] = useState<any>({
        icu_available: 0, icu_total: 0,
        general_available: 0, general_total: 0,
        pediatric_available: 0, pediatric_total: 0,
        maternity_available: 0, maternity_total: 0,
        isolation_available: 0, isolation_total: 0
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetch(`/api/hospitals?id=${hospitalId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    updateLocalState(data[0])
                }
                setLoading(false)
            })
            .catch(err => setLoading(false))
    }, [hospitalId])

    const updateLocalState = (data: any) => {
        setHospital(data)
        if (data.bed_inventory) {
            setBeds(data.bed_inventory)
        }
    }

    const updateBed = (key: string, val: number) => {
        setBeds((prev: any) => ({
            ...prev,
            [key]: val
        }))
    }

    const saveChanges = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/hospitals/${hospitalId}/beds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    icu_available: beds.icu_available,
                    general_available: beds.general_available,
                    pediatric_available: beds.pediatric_available,
                    maternity_available: beds.maternity_available,
                    isolation_available: beds.isolation_available
                })
            })

            if (res.ok) {
                const updatedData = await res.json()
                setMessage("Updates saved successfully at " + new Date().toLocaleTimeString())
                // In real app, we might re-fetch audit logs or rely on SWR revalidating
                // For MVP we just show success message.
            } else {
                setMessage("Error saving changes")
            }
        } catch (e) {
            setMessage("Network error")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div><Loader2 className="animate-spin" /> Loading Hospital Data...</div>
    if (!hospital) return <div className="text-red-500">Hospital not found or access denied.</div>

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-8">
            <div>
                <h2 className="text-xl font-bold mb-4">Update Bed Inventory: {hospital.name}</h2>

                {message && <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{message}</div>}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <BedInput label="ICU Beds Available" value={beds.icu_available} total={beds.icu_total} onChange={(v) => updateBed('icu_available', v)} />
                    <BedInput label="General Beds Available" value={beds.general_available} total={beds.general_total} onChange={(v) => updateBed('general_available', v)} />
                    <BedInput label="Pediatric Beds Available" value={beds.pediatric_available} total={beds.pediatric_total} onChange={(v) => updateBed('pediatric_available', v)} />
                    <BedInput label="Maternity Beds Available" value={beds.maternity_available} total={beds.maternity_total} onChange={(v) => updateBed('maternity_available', v)} />
                    <BedInput label="Isolation Beds Available" value={beds.isolation_available} total={beds.isolation_total} onChange={(v) => updateBed('isolation_available', v)} />
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Saving...' : 'Update & Publish'}
                    </button>
                </div>
            </div>

            <div className="border-t pt-8">
                <AuditLogViewer entityId={hospitalId} />
            </div>
        </div>
    )
}

function BedInput({ label, value, total, onChange }: { label: string, value: number, total: number, onChange: (v: number) => void }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-center gap-3">
                <button
                    className="w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-gray-100 font-bold text-lg"
                    onClick={() => onChange(Math.max(0, value - 1))}
                >-</button>
                <input
                    type="number"
                    className="w-20 text-center text-2xl font-bold p-2 rounded border-gray-300"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                />
                <button
                    className="w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-gray-100 font-bold text-lg"
                    onClick={() => onChange(value + 1)}
                >+</button>
                <span className="text-sm text-gray-500 ml-2"> / {total} Total</span>
            </div>
        </div>
    )
}
