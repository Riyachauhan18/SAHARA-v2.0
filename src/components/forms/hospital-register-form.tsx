
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function HospitalRegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [facilitiesInput, setFacilitiesInput] = useState("")

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const facilities = facilitiesInput.split(',').map(f => f.trim()).filter(f => f.length > 0)

        const data = {
            name: formData.get("name"),
            district: formData.get("district"),
            type: formData.get("type"),
            image: formData.get("image"),
            website: formData.get("website"),
            email: formData.get("email"),
            phone_emergency: formData.get("phone_emergency"),
            description: formData.get("description"),
            facilities: JSON.stringify(facilities),
            // Default lat/long for demo
            latitude: 26.9124,
            longitude: 75.7873,
        }

        try {
            const response = await fetch("/api/hospitals/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Registration failed")
            }

            // Redirect to dashboard
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to register hospital. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Register Hospital</CardTitle>
                <CardDescription>Enter the details of the new government or private hospital.</CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Hospital Name</Label>
                            <Input id="name" name="name" required placeholder="City General Hospital" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input id="district" name="district" required placeholder="Central" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Hospital Type</Label>
                            <Select name="type" defaultValue="Government">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Government">Government</SelectItem>
                                    <SelectItem value="Private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone_emergency">Emergency Phone</Label>
                            <Input id="phone_emergency" name="phone_emergency" required placeholder="102" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" name="image" placeholder="https://example.com/image.jpg" />
                        <p className="text-xs text-muted-foreground">Ensure this is a publicly accessible URL.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" name="website" type="url" placeholder="https://hospital.gov.in" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="contact@hospital.gov.in" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="facilities">Facilities (comma separated)</Label>
                        <Textarea
                            id="facilities"
                            name="facilities"
                            placeholder="ICU, Ventilator, Trauma Center, Pharmacy"
                            value={facilitiesInput}
                            onChange={(e) => setFacilitiesInput(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" name="description" placeholder="Brief description of the hospital..." />
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Registering..." : "Register Hospital"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
