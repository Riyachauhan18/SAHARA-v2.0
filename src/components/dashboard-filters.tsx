"use client"

import { Input } from "@/components/ui/input"
// Will implement simple input in place or assume basic input component exists. 
// Actually I'll implement Input component quickly in component section or use raw input.
// I'll use raw input for now to avoid complexity without shadcn.

import { Search } from "lucide-react"

export function DashboardFilters({
    onSearchChange,
    districtFilter,
    setDistrictFilter
}: {
    onSearchChange: (val: string) => void,
    districtFilter: string,
    setDistrictFilter: (val: string) => void
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Search hospitals by district or name..."
                    className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={districtFilter}
                    onChange={(e) => {
                        setDistrictFilter(e.target.value)
                        onSearchChange(e.target.value)
                    }}
                />
            </div>
            <div className="flex gap-2">
                {/* Could add Bed Type Dropdown here later */}
            </div>
        </div>
    )
}
