"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2, ArrowLeft, Siren, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AmbulancePage() {
    const [filter, setFilter] = useState<string>("all")

    const { data: hospitals, isLoading } = useSWR(
        '/api/hospitals',
        fetcher,
        { refreshInterval: 30000 }
    )

    // Client-side filtering for speed
    const filteredHospitals = hospitals?.filter((h: any) => {
        if (filter === "all") return true;
        if (filter === "icu") return (h.bed_inventory?.icu_available || 0) > 0;
        if (filter === "isolation") return (h.bed_inventory?.isolation_available || 0) > 0;
        if (filter === "maternity") return (h.bed_inventory?.maternity_available || 0) > 0;
        return true;
    })?.sort((a: any, b: any) => {
        // Sort by availability desc
        if (filter === "icu") {
            return (b.bed_inventory?.icu_available || 0) - (a.bed_inventory?.icu_available || 0);
        }
        return 0; // Default sort by updated_at (from API)
    })

    return (
        <div className="min-h-screen bg-black text-white p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/" className="p-2 bg-zinc-800 rounded-full">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div className="flex items-center gap-2 text-red-500 font-bold text-xl uppercase tracking-widest animate-pulse">
                    <Siren className="h-6 w-6" />
                    Ambulance Mode
                </div>
                <div className="w-10"></div>{/* Spacer */}
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                <FilterButton label="ALL" active={filter === "all"} onClick={() => setFilter("all")} />
                <FilterButton label="ICU" active={filter === "icu"} onClick={() => setFilter("icu")} />
                <FilterButton label="MATERNITY" active={filter === "maternity"} onClick={() => setFilter("maternity")} />
                <FilterButton label="ISOLATION" active={filter === "isolation"} onClick={() => setFilter("isolation")} />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredHospitals?.map((h: any) => (
                        <AmbulanceCard key={h.id} hospital={h} filter={filter} />
                    ))}
                    {filteredHospitals?.length === 0 && (
                        <div className="text-center text-zinc-500 py-10">
                            No hospitals match filter.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`py-4 rounded-lg font-bold text-sm transition-colors border-2 ${active ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
        >
            {label}
        </button>
    )
}

function AmbulanceCard({ hospital, filter }: { hospital: any, filter: string }) {
    const inv = hospital.bed_inventory || {};
    const lastUpdated = inv.updated_at ? new Date(inv.updated_at) : new Date(hospital.last_updated_at);
    const isFresh = (new Date().getTime() - lastUpdated.getTime()) < 15 * 60 * 1000;

    // Highlight the filtered metric
    const highlightCount = filter === "icu" ? inv.icu_available :
        filter === "maternity" ? inv.maternity_available :
            filter === "isolation" ? inv.isolation_available :
                inv.general_available;
    const highlightLabel = filter === "all" ? "General" : filter.toUpperCase();

    return (
        <div className={`p-4 rounded-xl border ${isFresh ? 'border-green-900 bg-zinc-900' : 'border-red-900 bg-zinc-950'} flex justify-between items-center`}>
            <div className="flex-1">
                <h3 className="text-lg font-bold truncate">{hospital.name}</h3>
                <p className="text-zinc-400 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {hospital.district}
                </p>
                <div className="text-xs text-zinc-600 mt-1">
                    Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Big Number Display */}
                <div className="text-center px-4">
                    <div className={`text-3xl font-black ${highlightCount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {highlightCount || 0}
                    </div>
                    <div className="text-[10px] uppercase text-zinc-500 font-bold">{highlightLabel}</div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    {hospital.phone_emergency && (
                        <a href={`tel:${hospital.phone_emergency}`} className="p-3 bg-zinc-800 rounded-full text-green-500 hover:bg-green-900/30">
                            <Phone className="h-6 w-6" />
                        </a>
                    )}
                    {hospital.latitude && (
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`} target="_blank" className="p-3 bg-zinc-800 rounded-full text-blue-500 hover:bg-blue-900/30">
                            <MapPin className="h-6 w-6" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
