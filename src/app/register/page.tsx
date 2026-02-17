
import { HospitalRegisterForm } from "@/components/forms/hospital-register-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function RegisterPage() {
    return (
        <div className="container px-4 py-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/">
                    <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Hospital Registration</h1>
                <p className="text-muted-foreground">
                    Register a new hospital to the centralized dashboard system.
                </p>
            </div>

            <HospitalRegisterForm />
        </div>
    )
}
