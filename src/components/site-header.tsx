import Link from "next/link"
import { Ambulance, Activity } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                <Link className="flex items-center gap-2 font-bold" href="/">
                    <Activity className="h-6 w-6 text-red-600" />
                    <span className="hidden md:inline">District Health Live</span>
                    <span className="md:hidden">Health Live</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link
                        className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                        href="/ambulance"
                    >
                        <Ambulance className="h-4 w-4" />
                        Ambulance Mode
                    </Link>
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="/login"
                    >
                        Admin Login
                    </Link>
                </nav>
            </div>
        </header>
    )
}
