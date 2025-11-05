"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Search, MapPin, Phone, Mail, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


const specialties = [
    { 
        name: "Cardiology",
        img: "https://www.mayoclinic.org/-/media/kcms/gbs/medical-professionals/images/2025/03/14/20/27/cardio-advances-767x535.jpg",
        color: "bg-red-100" 
    },
    { 
        name: "Neurology", 
        img: "https://www.cnos.net/wp-content/uploads/2022/12/Neurology.jpg",
        color: "bg-purple-100" 
    },
    { 
        name: "Pediatrics",
        img: "https://commonwealthpeds.com/wp-content/uploads/2025/03/ComPed-What-Does-a-Pediatrician-Do-Blog.png",
        color: "bg-blue-100" 
    },
    { 
        name: "Orthopedics",
        img: "https://irp.cdn-website.com/b174dce8/dms3rep/multi/bb-a94f4f13.PNG",
        color: "bg-orange-100" 
    },
    { 
        name: "Dermatology",
        img: "https://plymouthmeetingdermatology.com/wp-content/uploads/2021/12/plym_in_office.jpg",
        color: "bg-pink-100" 
    },
    { 
        name: "Psychiatry",
        img: "https://mb.futurepsychsolutions.com/wp-content/uploads/psychiatrist-2302.jpg",
        color: "bg-indigo-100" 
    },
    { 
        name: "Radiology",
        img: "https://www.cambridgehealth.edu/wp-content/uploads/2021/09/radiation.jpg",
        color: "bg-green-100" 
    },
    { 
        name: "General",
        img: "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/BigBead/general_practitioners_what_to_know_bigbead/1800x1200_general_practitioners_what_to_know_bigbead.jpg",
        color: "bg-teal-100" 
    },
    { 
        name: "Gynecologist",
        img: "https://grandpeaks.org/wp-content/uploads/female-gynecologist-doing-ultrasound-examination-o-2024-10-22-06-13-36-utc-1.jpg",
        color: "bg-rose-100" 
    },
    { 
        name: "Oncologist",
        img: "https://www.excelsior.edu/wp-content/uploads/2022/07/oncology-nursing.jpg",
        color: "bg-amber-100" 
    },
    { 
        name: "Urogynecology",
        img: "https://www.uabmedicine.org/wp-content/uploads/sites/3/2025/02/What-is-a-urogynecologist.png",
        color: "bg-lime-100" 
    },
    { 
        name: "Mastologist",
        img: "https://iqinterquirofanos.com/wp-content/uploads/2024/12/mastologia.jpg",
        color: "bg-violet-100" 
    }
];


const hospitals = [
    {
        id: 1,
        name: "City General Hospital",
        address: "123 Healthcare Ave, Medical District",
        phone: "(555) 123-4567",
        email: "contact@citygeneral.com",
        rating: 4.8,
        reviews: 342,
        specialties: ["Cardiology", "Neurology", "General"],
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVgr34LKvZFo-oNxMqkCY2nQrRB5jGQ-cCg&s",
        verified: true
    },
    {
        id: 2,
        name: "Fauget Medical Center",
        address: "456 Wellness Blvd, Downtown",
        phone: "(555) 234-5678",
        email: "info@metromedical.com",
        rating: 4.9,
        reviews: 428,
        specialties: ["Pediatrics", "Orthopedics", "General"],
        avatar: "https://marketplace.canva.com/EAGKU6t2llU/2/0/1600w/canva-blue-green-white-simple-modern-medical-logo-enoKffV7vWg.jpg",
        verified: true
    },
    {
        id: 3,
        name: "Advanced Care Institute",
        address: "789 Medical Park Dr, Suburbs",
        phone: "(555) 345-6789",
        email: "care@advancedcare.com",
        rating: 4.7,
        reviews: 296,
        specialties: ["Dermatology", "Psychiatry", "Radiology"],
        avatar: "https://www.creativefabrica.com/wp-content/uploads/2018/11/Hospital-logo-by-meisuseno-5.jpg",
        verified: true
    },
    {
        id: 4,
        name: "Regional Health Services",
        address: "321 Hospital Road, Northside",
        phone: "(555) 456-7890",
        email: "contact@regionalhealth.com",
        rating: 4.6,
        reviews: 215,
        specialties: ["Cardiology", "Orthopedics", "General"],
        avatar: "https://img.freepik.com/free-vector/hospital-logo-design-vector-medical-cross_53876-136743.jpg?semt=ais_hybrid&w=740&q=80",
        verified: false
    },
    {
        id: 5,
        name: "Premier Wellness Center",
        address: "654 Health Plaza, Eastside",
        phone: "(555) 567-8901",
        email: "info@premierwellness.com",
        rating: 4.9,
        reviews: 389,
        specialties: ["Neurology", "Pediatrics", "Psychiatry"],
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsFpfi_QIl7--rqZ78_dUf6WSLynnKiziMwA&s",
        verified: true
    },
    {
        id: 6,
        name: "Comprehensive Care Hospital",
        address: "987 Medical Circle, Westend",
        phone: "(555) 678-9012",
        email: "hello@comprehensivecare.com",
        rating: 4.5,
        reviews: 178,
        specialties: ["Radiology", "Dermatology", "General"],
        avatar: "https://images.seeklogo.com/logo-png/39/1/plus-medical-health-logo-png_seeklogo-392154.png",
        verified: true
    },
];

export default function Page() {
    const [selectedSpecialty, setSelectedSpecialty] = React.useState("All");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 6;

    const filteredHospitals = hospitals.filter(hospital => {
        const matchesSpecialty = selectedSpecialty === "All" || hospital.specialties.includes(selectedSpecialty);
        const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSpecialty && matchesSearch;
    });

    const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHospitals = filteredHospitals.slice(startIndex, startIndex + itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedSpecialty, searchQuery]);

    return (
        <div className="flex flex-1 flex-col gap-6 px-4 lg:px-6">
            {/* Hero Section with Background */}
            <div
                className="relative rounded-2xl h-64 md:h-80 flex items-center justify-center overflow-hidden shadow-lg"
                style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.85)), url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><rect fill="%2393c5fd" width="1200" height="400"/><g fill-opacity="0.1"><circle fill="%23fff" cx="200" cy="100" r="80"/><circle fill="%23fff" cx="800" cy="150" r="100"/><circle fill="%23fff" cx="400" cy="300" r="60"/><circle fill="%23fff" cx="1000" cy="250" r="90"/><path fill="%23fff" d="M100 350 Q200 300 300 350 T500 350"/><path fill="%23fff" d="M700 100 Q800 150 900 100 T1100 100"/></g></svg>')}`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Your Health, Our Priority
                    </h1>
                    <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto">
                        Connect with top healthcare providers through our telemedicine platform
                    </p>
                </div>
            </div>

            {/* Specialties Carousel */}
            <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-6xl px-7">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-semibold">Filter by Specialty</h2>
                        <Button
                            variant={selectedSpecialty === "All" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSpecialty("All")}
                        >
                            Clear filter
                        </Button>
                    </div>
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {specialties.map((specialty, index) => (
                                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/7 p-1">
                                    <button
                                        onClick={() => setSelectedSpecialty(specialty.name)}
                                        className={
                                            `w-full transition-all cursor-pointer ml-1 ${selectedSpecialty === specialty.name
                                                ? 'scale-105'
                                                : 'hover:scale-105'
                                            }
                                            `
                                        }
                                    >
                                        <Card className={`border-2 ${selectedSpecialty === specialty.name
                                                ? 'border-blue-500 shadow-lg'
                                                : 'border-transparent hover:border-blue-300'
                                            }`}>
                                            <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
                                                <div className={`text-4xl md:text-5xl mb-2 ${specialty.color} rounded-full w-16 h-16 flex items-center justify-center`}>
                                                    {/* {specialty.icon} */}
                                                    <img
                                                        src={specialty.img || 'https://via.placeholder.com/64'}
                                                        alt={specialty.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <span className="text-xs md:text-sm font-medium text-center mt-2">
                                                    {specialty.name}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex cursor-pointer" />
                        <CarouselNext className="hidden md:flex cursor-pointer" />
                    </Carousel>
                </div>
            </div>

            {/* Hospitals Section */}
            <div className="bg-muted/30 rounded-2xl p-4 md:p-6">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold">
                            {selectedSpecialty === "All" ? "All Hospitals" : `${selectedSpecialty} Specialists`}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search hospitals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Hospital Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {paginatedHospitals.map((hospital) => (
                        <Card key={hospital.id} className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
                            {/* Banner Image */}
                            <div
                                className="h-30 bg-gradient-to-r from-blue-400 to-blue-600"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 197, 253))`,
                                }}
                            />

                            <CardContent className="p-4 pt-0">
                                {/* Avatar */}
                                <div className="flex items-start justify-between -mt-12 mb-4">
                                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg bg-white">
                                        <AvatarImage src={hospital.avatar} alt={hospital.name} />
                                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                                            {hospital.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    {hospital.verified && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                            ✓ Verified
                                        </Badge>
                                    )}
                                </div>

                                {/* Hospital Info */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold line-clamp-1">
                                            {hospital.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{hospital.rating}</span>
                                            <span className="text-sm text-muted-foreground">
                                                ({hospital.reviews} reviews)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-1">{hospital.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                            <span>{hospital.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4 flex-shrink-0" />
                                            <span className="line-clamp-1">{hospital.email}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>

                                    <Button className="w-full mt-4" size="sm">
                                        Book Appointment
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Results Message */}
                {filteredHospitals.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No hospitals found matching your criteria</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSelectedSpecialty("All");
                                setSearchQuery("");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {filteredHospitals.length > 0 && totalPages >= 1 && (
                    <div className="flex items-center justify-between gap-2 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-10"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
