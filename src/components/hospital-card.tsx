import { formatDistanceToNow, differenceInMinutes } from "date-fns"
import { MapPin, Phone, AlertCircle, CheckCircle, Clock, Globe, Mail, Building2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import Link from "next/link"

interface BedInventory {
    icu_available: number
    general_available: number
    pediatric_available: number
    maternity_available: number
    isolation_available: number
    updated_at: string
}

interface Hospital {
    id: string
    name: string
    district: string
    address: string | null
    phone_emergency: string | null
    last_updated_at: string
    bed_inventory: BedInventory | null
    latitude: number | string | null
    longitude: number | string | null
    image: string | null
    facilities: string // JSON string
    type: string
    website: string | null
    email: string | null
    description: string | null
    photos: string | null // JSON string of URLs
}

export function HospitalCard({ hospital }: { hospital: Hospital }) {
    const lastUpdated = hospital.bed_inventory?.updated_at ? new Date(hospital.bed_inventory.updated_at) : (hospital.last_updated_at ? new Date(hospital.last_updated_at) : new Date());
    const minutesAgo = differenceInMinutes(new Date(), lastUpdated);

    // Clean Data Freshness Logic
    const isFresh = minutesAgo < 15;
    const isStale = minutesAgo > 60;

    const freshnessColor = isFresh ? "text-green-600 border-green-200 bg-green-50" : isStale ? "text-red-600 border-red-200 bg-red-50" : "text-yellow-600 border-yellow-200 bg-yellow-50";
    const freshnessLabel = isFresh ? "Verified" : isStale ? "Data Stale" : "Warning";

    // Parse facilities
    let facilitiesList: string[] = []
    try {
        facilitiesList = JSON.parse(hospital.facilities)
    } catch (e) {
        // Fallback or empty if invalid JSON
        facilitiesList = []
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted group flex flex-col h-full">
            <Link href={`/hospitals/${hospital.id}`} className="block relative h-48 w-full bg-muted overflow-hidden cursor-pointer">
                {hospital.image ? (
                    <img
                        src={hospital.image}
                        alt={hospital.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                        <Building2 className="h-12 w-12 opacity-20" />
                    </div>
                )}

                <div className="absolute top-2 right-2">
                    <Badge variant={isFresh ? "default" : "destructive"} className={`${isFresh ? "bg-green-600 hover:bg-green-700" : ""} shadow-sm`}>
                        {isFresh ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                        {freshnessLabel}
                    </Badge>
                </div>

                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-black/50 shadow-sm text-foreground">
                        {hospital.type}
                    </Badge>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" className="pointer-events-none">
                        View Details
                    </Button>
                </div>
            </Link>

            <CardHeader className="pb-2 space-y-1">
                <div className="flex justify-between items-start">
                    <div>
                        <Link href={`/hospitals/${hospital.id}`} className="hover:underline decoration-primary decoration-2 underline-offset-2">
                            <h3 className="font-bold text-xl leading-tight text-foreground line-clamp-1">{hospital.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" /> {hospital.district}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-2 flex-grow">
                {/* Facilities Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {facilitiesList.slice(0, 4).map((facility, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] px-2 py-0 h-5 font-normal">
                            {facility}
                        </Badge>
                    ))}
                    {facilitiesList.length > 4 && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-normal">
                            +{facilitiesList.length - 4} more
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    <BedStat label="ICU" count={hospital.bed_inventory?.icu_available ?? 0} />
                    <BedStat label="General" count={hospital.bed_inventory?.general_available ?? 0} />
                    <BedStat label="Maternity" count={hospital.bed_inventory?.maternity_available ?? 0} />
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-2 border-t bg-muted/20">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    {hospital.phone_emergency && (
                        <Button asChild variant="default" size="sm" className="flex-1 bg-primary/95 hover:bg-primary shadow-sm">
                            <a href={`tel:${hospital.phone_emergency}`}>
                                <Phone className="h-3.5 w-3.5 mr-2" />
                                Call
                            </a>
                        </Button>
                    )}
                    <Button asChild variant="outline" size="sm" className="flex-1 border-input hover:bg-accent hover:text-accent-foreground shadow-sm">
                        <Link href={`/hospitals/${hospital.id}`}>
                            <ExternalLink className="h-3.5 w-3.5 mr-2" />
                            Details
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-2 w-full justify-between items-center text-xs text-muted-foreground mt-1 px-1">
                    <div className="flex gap-2">
                        {hospital.website && (
                            <a href={hospital.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                <Globe className="h-3.5 w-3.5" />
                            </a>
                        )}
                        {hospital.email && (
                            <a href={`mailto:${hospital.email}`} className="hover:text-primary transition-colors">
                                <Mail className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

function BedStat({ label, count }: { label: string, count: number }) {
    const isAvailable = count > 0;
    return (
        <div className={`flex flex-col justify-center items-center rounded-md p-2 border ${isAvailable ? 'bg-green-50/50 border-green-100 dark:bg-green-950/20 dark:border-green-900' : 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900'}`}>
            <span className={`text-lg font-bold font-mono leading-none ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {isAvailable ? count : 'Full'}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-1">{label}</span>
        </div>
    )
}
