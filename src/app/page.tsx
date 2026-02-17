"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardFilters } from "@/components/dashboard-filters"
import { HospitalCard } from "@/components/hospital-card"
import { Loader2 } from "lucide-react"

// Fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
    const [district, setDistrict] = useState("")

    // Construct URL with query params
    const { data: hospitals, error, isLoading } = useSWR(
        `/api/hospitals?district=${encodeURIComponent(district)}`,
        fetcher,
        { refreshInterval: 60000 } // Refresh every minute
    )

    return (
        <div className="container px-4 md:px-6 py-6">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">District Bed Availability</h1>
                <p className="text-muted-foreground">
                    Real-time verified data from government hospitals.
                </p>
            </div>

            <DashboardFilters
                districtFilter={district}
                setDistrictFilter={setDistrict}
                onSearchChange={(val) => { }} // handled by state effectively
            />

            {error && <div className="text-red-500">Failed to load data.</div>}

            {isLoading && (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {hospitals?.map((hospital: any) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                ))}

                {hospitals?.length === 0 && !isLoading && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        No hospitals found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    )
}
