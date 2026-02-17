
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HospitalGallery } from "@/components/hospital-gallery"
import { MapPin, Phone, Globe, Mail, Clock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, differenceInMinutes } from "date-fns"

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

interface PageProps {
    params: {
        id: string
    }
}

export default async function HospitalDetailsPage({ params }: PageProps) {
    // Await params in Next.js 15+ if needed, but for now standard access
    const { id } = await params

    const hospital = await prisma.hospital.findUnique({
        where: { id },
        include: {
            bed_inventory: true
        }
    })

    if (!hospital) {
        notFound()
    }

    const lastUpdated = hospital.bed_inventory?.updated_at ? new Date(hospital.bed_inventory.updated_at) : (hospital.last_updated_at ? new Date(hospital.last_updated_at) : new Date());
    const minutesAgo = differenceInMinutes(new Date(), lastUpdated);
    const isFresh = minutesAgo < 15;

    let facilities: string[] = []
    try {
        facilities = JSON.parse(hospital.facilities)
    } catch (e) { facilities = [] }

    let photos: string[] = []
    try {
        photos = JSON.parse(hospital.photos)
    } catch (e) { photos = [] }

    // If main image exists but no photos, add main image to photos
    if (hospital.image && photos.length === 0) {
        photos.push(hospital.image)
    }

    return (
        <div className="container py-8 max-w-5xl mx-auto px-4">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{hospital.name}</h1>
                            <Badge variant={hospital.type === 'Government' ? 'secondary' : 'outline'} className="w-fit text-md py-1 px-3">
                                {hospital.type}
                            </Badge>
                        </div>
                        <div className="flex items-center text-muted-foreground mb-6">
                            <MapPin className="mr-2 h-5 w-5" />
                            <span className="text-lg">{hospital.address || `${hospital.district} District`}</span>
                        </div>

                        {/* Gallery */}
                        <div className="rounded-xl overflow-hidden border bg-muted/20 relative aspect-video mb-6 group">
                            {hospital.image ? (
                                <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                    <span className="text-muted-foreground">No Image Available</span>
                                </div>
                            )}
                            {photos.length > 0 && (
                                <div className="absolute bottom-4 right-4">
                                    <HospitalGallery photos={photos} title={hospital.name} />
                                </div>
                            )}
                        </div>

                        {/* About */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">About</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {hospital.description || "No description provided for this hospital."}
                            </p>
                        </div>

                        <Separator className="my-8" />

                        {/* Facilities */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Facilities & Departments</h2>
                            <div className="flex flex-wrap gap-2">
                                {facilities.length > 0 ? facilities.map((facility, i) => (
                                    <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                                        {facility}
                                    </Badge>
                                )) : (
                                    <p className="text-muted-foreground">No facilities listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Live Status & Contact */}
                <div className="space-y-6">
                    {/* Live Bed Status Card */}
                    <Card className="shadow-lg border-primary/10 overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${isFresh ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                    Live Bed Status
                                </CardTitle>
                                {isFresh ? (
                                    <span className="text-xs font-medium text-green-600 flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                        <CheckCircle className="h-3 w-3" /> Verified
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium text-yellow-600 flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                                        <AlertCircle className="h-3 w-3" /> Stale Data
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-2 gap-4">
                            <BedStatDetail label="ICU" available={hospital.bed_inventory?.icu_available} total={hospital.bed_inventory?.icu_total} />
                            <BedStatDetail label="General" available={hospital.bed_inventory?.general_available} total={hospital.bed_inventory?.general_total} />
                            <BedStatDetail label="Maternity" available={hospital.bed_inventory?.maternity_available} total={hospital.bed_inventory?.maternity_total} />
                            <BedStatDetail label="Pediatric" available={hospital.bed_inventory?.pediatric_available} total={hospital.bed_inventory?.pediatric_total} />
                            <BedStatDetail label="Isolation" available={hospital.bed_inventory?.isolation_available} total={hospital.bed_inventory?.isolation_total} />

                            <div className="col-span-2 mt-4 pt-4 border-t text-center text-xs text-muted-foreground flex justify-center items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {hospital.phone_emergency && (
                                <Button asChild className="w-full gap-2 text-md py-6" size="lg">
                                    <a href={`tel:${hospital.phone_emergency}`}>
                                        <Phone className="h-5 w-5" />
                                        Emergency: {hospital.phone_emergency}
                                    </a>
                                </Button>
                            )}

                            {hospital.website && (
                                <a href={hospital.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                    <div className="bg-primary/10 p-2 rounded-md">
                                        <Globe className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium">Website</p>
                                        <p className="text-xs text-muted-foreground truncate">{hospital.website.replace(/^https?:\/\//, '')}</p>
                                    </div>
                                </a>
                            )}

                            {hospital.email && (
                                <a href={`mailto:${hospital.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                    <div className="bg-primary/10 p-2 rounded-md">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-xs text-muted-foreground truncate">{hospital.email}</p>
                                    </div>
                                </a>
                            )}

                            {hospital.latitude && hospital.longitude && (
                                <Button asChild variant="outline" className="w-full gap-2">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Get Directions
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function BedStatDetail({ label, available, total }: { label: string, available?: number, total?: number }) {
    const safeAvailable = available ?? 0
    const safeTotal = total ?? 0
    const isAvailable = safeAvailable > 0

    return (
        <div className={`p-3 rounded-lg border text-center ${isAvailable ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900' : 'bg-red-50/50 border-red-100'}`}>
            <div className={`text-2xl font-bold font-mono ${isAvailable ? 'text-green-600 dark:text-green-500' : 'text-red-500'}`}>
                {safeAvailable}
            </div>
            <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">{label}</div>
            <div className="text-xs text-muted-foreground border-t pt-1 mt-1 border-dashed border-foreground/10">
                Total: {safeTotal}
            </div>
        </div>
    )
}
