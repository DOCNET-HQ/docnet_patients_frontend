"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Eye, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useGetDoctorsQuery } from "@/lib/api/apiSlice"
import { Loader } from "@/components/dashboard/loader"
import Link from "next/link"
import { toast } from "sonner"

// Define your data type based on API response
interface DoctorData {
    id: string
    name: string
    email: string
    phone_number: string
    gender?: string
    specialty?: string
    state: string
    country: string
    city: string
    is_active: boolean
    is_visible: boolean
    kyc_status: string
    website: string
    address: string
    license_number?: string
    license_expiry_date?: string
    created_at: string
    updated_at: string
}

// Helper function to get initials from name
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export default function DoctorsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [searchQuery, setSearchQuery] = useState("")

    const {
        data: doctorsResponse,
        isLoading,
        error: fetchError,
    } = useGetDoctorsQuery({
        page: currentPage,
        limit: pageSize
    })

    // Handle fetch errors
    if (fetchError) {
        toast.error("Failed to load doctors list")
        console.error("Fetch error:", fetchError)
    }

    // Filter doctors based on search query
    const filteredDoctors = doctorsResponse?.results?.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    // Pagination calculations
    const totalDoctors = doctorsResponse?.count || 0
    const totalPages = Math.ceil(totalDoctors / pageSize)
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalDoctors)

    const handleMessage = (doctor: DoctorData) => {
        toast.success(`Opening chat with Dr. ${doctor.name.split(' ')[1]}`)
    }

    const handleViewProfile = (doctor: DoctorData) => {
        toast.info(`Opening profile of Dr. ${doctor.name.split(' ')[1]}`)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setCurrentPage(1) // Reset to first page when page size changes
    }

    return (
        <div className="flex flex-1 flex-col gap-6 px-10">
            {/* Clean Header with Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Medical Team</h1>
                    <p className="mt-1">
                        Connect with your colleagues
                    </p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                        placeholder="Search doctors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Results Count and Page Size Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-muted-foreground">
                    Showing {startItem}-{endItem} of {totalDoctors} doctors
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <select 
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="border rounded-md px-2 py-1 text-sm"
                    >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                    </select>
                </div>
            </div>

            {/* Clean Doctors Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader />
                </div>
            ) : (
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <Card key={doctor.id} className="hover:shadow-md transition-shadow border">
                                <CardContent className="p-6 pb-4">
                                    {/* Centered Avatar Section */}
                                    <div className="flex flex-col items-center text-center mb-4">
                                        <Avatar className="h-20 w-20 mb-3 border-2 border-gray-100">
                                            <AvatarImage
                                                src={doctor.photo || ""}
                                                alt={doctor.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-gray-100 font-medium text-black">
                                                {getInitials(doctor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        
                                        {/* Name and Specialty */}
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg">
                                                {doctor.name}
                                            </h3>
                                            <p className="text-sm text-blue-600 font-medium">
                                                {doctor.specialty || "Medical Specialist"}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        {/* <div className="mt-2">
                                            <Badge 
                                                variant={doctor.kyc_status === 'VERIFIED' ? "default" : "secondary"}
                                                className={doctor.kyc_status === 'VERIFIED' ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                            >
                                                {doctor.kyc_status}
                                            </Badge>
                                        </div> */}
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{doctor.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            <span>{doctor.phone_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            <span className="truncate">
                                                {doctor.city}, {doctor.state}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {/* e.g 10th january, 2025 */}
                                            <span>
                                                Joined On {" "}
                                                {new Date(doctor.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                </CardContent>

                                {/* Action Buttons */}
                                <CardFooter className="p-6 pt-4">
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            variant="outline"
                                            className="flex-1 gap-2 hover cursor-pointer"
                                            onClick={() => handleViewProfile(doctor)}
                                            size="sm"
                                        >
                                            <Link
                                                href={`/doctors/${doctor.id}`}
                                                className="flex items-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Link>
                                        </Button>

                                        <Button
                                            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                            size="sm"
                                        >
                                            <Link
                                                href={`/messages/${doctor.id}`}
                                                className="flex items-center gap-2 text-white"
                                            >
                                                <MessageCircle className="h-4 w-4 text-white" />
                                                Message
                                            </Link>
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages == 1 && (
                        <div className="">
                            <div className="text-sm text-muted-foreground mt-4">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                
                                {/* Page Numbers */}
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className="w-10 h-10 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredDoctors.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="rounded-full bg-gray-100 p-4 mb-4">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                    <p className="max-w-md">
                        {searchQuery ? "No doctors match your search criteria." 
                                   : "No doctors are currently available."}
                    </p>
                </div>
            )}
        </div>
    )
}