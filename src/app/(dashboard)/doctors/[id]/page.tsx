'use client';

import React from 'react';
import { useState } from 'react';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Link2, 
    Menu, 
    Video, 
    MessageSquare, 
    FileText, 
    ChevronDown,
    X,
    CalendarIcon,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import ScheduleCalendar from '@/components/dashboard/schedule-calendar';

const DoctorProfilePage = () => {
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [appointmentData, setAppointmentData] = useState({
        appointment_type: '',
        reason: '',
        notes: '',
        scheduled_start_time: '',
        scheduled_end_time: ''
    });
    const [selectedDateTime, setSelectedDateTime] = useState<{date: Date | null, time: string}>({
        date: null,
        time: ''
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handleBookAppointment = () => {
        setShowBookingDialog(true);
        setBookingStep(1);
        setAppointmentData({
            appointment_type: '',
            reason: '',
            notes: '',
            scheduled_start_time: '',
            scheduled_end_time: ''
        });
        setSelectedDateTime({ date: null, time: '' });
    };

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (appointmentData.appointment_type && appointmentData.reason) {
            setBookingStep(2);
        }
    };

    const handleDateTimeSelect = (date: Date, time: string) => {
        setSelectedDateTime({ date, time });
        
        // Calculate end time (30 minutes after start time)
        const startDateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        startDateTime.setHours(hours, minutes, 0, 0);
        
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Add 30 minutes
        
        setAppointmentData(prev => ({
            ...prev,
            scheduled_start_time: startDateTime.toISOString(),
            scheduled_end_time: endDateTime.toISOString()
        }));
    };

    const handleCalendarConfirm = (date: Date, time: string) => {
        handleDateTimeSelect(date, time);
        setBookingStep(3); // Move to preview step after confirming date/time
    };

    const handleConfirmBooking = () => {
        // Here you would send the appointmentData to your API
        console.log('Booking data:', appointmentData);
        
        // Reset and close dialog
        setShowBookingDialog(false);
        setBookingStep(1);
        setAppointmentData({
            appointment_type: '',
            reason: '',
            notes: '',
            scheduled_start_time: '',
            scheduled_end_time: ''
        });
        
        // Show success message or redirect
        toast('Appointment booked successfully!');
    };

    const appointments = [
        { type: 'Video Consultation', date: '12/10/2025', status: 'scheduled', reason: 'Routine check-up' },
        { type: 'Follow-up', date: '11/28/2025', status: 'completed', reason: 'Post-surgery review' },
        { type: 'Initial Consultation', date: '11/25/2025', status: 'completed', reason: 'New patient intake' },
        { type: 'Video Consultation', date: '11/20/2025', status: 'cancelled', reason: 'Flu symptoms' },
        { type: 'Prescription Renewal', date: '11/15/2025', status: 'completed', reason: 'Medication refill' },
        { type: 'Follow-up', date: '11/10/2025', status: 'completed', reason: 'Chronic condition management' },
        { type: 'Emergency', date: '11/05/2025', status: 'completed', reason: 'Acute pain' },
        { type: 'Consultation', date: '11/01/2025', status: 'completed', reason: 'Second opinion' },
        { type: 'Checkup', date: '10/28/2025', status: 'completed', reason: 'Annual physical' },
        { type: 'Follow-up', date: '10/25/2025', status: 'completed', reason: 'Test results review' },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(appointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(page);
    };
    
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-600 hover:bg-green-600';
            case 'scheduled': return 'bg-blue-600 hover:bg-blue-600';
            case 'cancelled': return 'bg-red-600 hover:bg-red-600';
            default: return 'bg-gray-600 hover:bg-gray-600';
        }
    };

    // Timeline steps
    const steps = [
        { number: 1, title: 'Details', active: bookingStep === 1, completed: bookingStep > 1 },
        { number: 2, title: 'Schedule', active: bookingStep === 2, completed: bookingStep > 2 },
        { number: 3, title: 'Confirm', active: bookingStep === 3, completed: bookingStep > 3 },
    ];

    const SidebarContent = () => (
        <div className="space-y-6">
            {/* Profile Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-4">
                            <AvatarImage 
                                className="object-center object-cover" 
                                src="https://uhlbd.com/unitedhospitalapi/public/DoctorProfileImg/202412221209Haridash%20Saha%20copy.jpg" 
                            />
                            <AvatarFallback>DM</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 mb-1 flex-wrap justify-center">
                            <h2 className="text-lg sm:text-xl font-semibold text-center">Dr. Michael Anderson</h2>
                            <Badge className="bg-blue-600 hover:bg-blue-600 text-xs text-white">Verified</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-6">Internal Medicine Specialist</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full py-4 sm:py-6 border-t border-b">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold">847</div>
                                <div className="text-muted-foreground text-xs sm:text-sm">Patients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold">1.2K</div>
                                <div className="text-muted-foreground text-xs sm:text-sm">Consults</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold">4.9</div>
                                <div className="text-muted-foreground text-xs sm:text-sm">Rating</div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="w-full mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-left">
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="break-words">dr.anderson@healthcarepro.com</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span>(+1-555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span>New York, USA</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="break-words">dranderson-health.com</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <ChevronDown className="w-4 h-4 text-blue-600 cursor-pointer flex-shrink-0" />
                                <span className='text-xs text-blue-600 cursor-pointer'>View More</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground -mt-5">
            {/* Header */}
            <div className="-mb-6">
                <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                                <div className="mt-4 sm:mt-6">
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="hidden lg:block">
                        <SidebarContent />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <div className="grid">
                            <Card className="xl:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 px-4 sm:px-6">
                                    <CardTitle className="text-base sm:text-lg">Appointment History</CardTitle>

                                    <Button 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs sm:text-sm"
                                        onClick={handleBookAppointment}
                                    >
                                        <PlusCircle />
                                        Book Appointment
                                    </Button>
                                </CardHeader>
                                <CardContent className="px-3 sm:px-6">
                                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Reason</th>
                                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Date</th>
                                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentAppointments.map((appointment, index) => (
                                                        <tr key={index} className="border-b last:border-0">
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs text-muted-foreground">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium sm:font-normal">{appointment.reason}</span>
                                                                    <span className="sm:hidden text-xs text-gray-500 mt-1">{appointment.type}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs text-muted-foreground hidden sm:table-cell">
                                                                {appointment.type}
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs text-muted-foreground">
                                                                {appointment.date}
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <Badge className={`${getStatusColor(appointment.status)} text-xs text-white whitespace-nowrap`}>
                                                                    {appointment.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            
                                            {/* Pagination Controls */}
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2 sm:px-0">
                                                <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
                                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, appointments.length)} of {appointments.length}
                                                    </div>
                                                    
                                                    <Select
                                                        value={itemsPerPage.toString()}
                                                        onValueChange={(value) => {
                                                            setItemsPerPage(Number(value));
                                                            setCurrentPage(1);
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-16 h-7 sm:w-20 sm:h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="5" className="text-xs">5</SelectItem>
                                                            <SelectItem value="10" className="text-xs">10</SelectItem>
                                                            <SelectItem value="20" className="text-xs">20</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={prevPage}
                                                        disabled={currentPage === 1}
                                                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs cursor-pointer"
                                                    >
                                                        <ChevronLeft />
                                                    </Button>
                                                    
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <Button
                                                                key={page}
                                                                variant={currentPage === page ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => goToPage(page)}
                                                                className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs"
                                                            >
                                                                {page}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={nextPage}
                                                        disabled={currentPage === totalPages}
                                                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs cursor-pointer"
                                                    >
                                                        <ChevronRight />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Booking Dialog */}
                <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                    <DialogContent 
                        className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6 overflow-x-hidden"
                    >
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                Book Appointment
                            </DialogTitle>
                            <DialogDescription className="text-sm sm:text-base">
                                Complete the steps below to book your appointment
                            </DialogDescription>
                            
                            {/* Timeline */}
                            <div className="w-full mt-4 ml-[10%] md:mx-[15%] overflow-x-hidden">
                                <div className="flex items-center justify-between">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                                                    ${step.active ? 'bg-blue-600 text-white' : 
                                                    step.completed ? 'bg-green-600 text-white' : 
                                                    'bg-gray-200 text-gray-500'}`}>
                                                    {step.completed ? <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> : step.number}
                                                </div>
                                                <span className={`text-xs mt-1 ${step.active ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                                    {step.title}
                                                </span>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Step 1: Appointment Details */}
                        {bookingStep === 1 && (
                            <form onSubmit={handleStep1Submit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="appointment_type" className="text-sm sm:text-base">Appointment Type</Label>
                                    <Select 
                                        value={appointmentData.appointment_type} 
                                        onValueChange={(value) => setAppointmentData(prev => ({...prev, appointment_type: value}))}
                                    >
                                        <SelectTrigger className="w-full text-sm sm:text-base">
                                            <SelectValue placeholder="Select appointment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="consultation" className="text-sm sm:text-base">Consultation</SelectItem>
                                            <SelectItem value="follow_up" className="text-sm sm:text-base">Follow-up</SelectItem>
                                            <SelectItem value="checkup" className="text-sm sm:text-base">Checkup</SelectItem>
                                            <SelectItem value="emergency" className="text-sm sm:text-base">Emergency</SelectItem>
                                            <SelectItem value="other" className="text-sm sm:text-base">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason" className="text-sm sm:text-base">Reason for Visit *</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Please describe the reason for your appointment"
                                        value={appointmentData.reason}
                                        onChange={(e) => setAppointmentData(prev => ({...prev, reason: e.target.value}))}
                                        required
                                        className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-sm sm:text-base">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any additional information you'd like to share"
                                        value={appointmentData.notes}
                                        onChange={(e) => setAppointmentData(prev => ({...prev, notes: e.target.value}))}
                                        className="min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowBookingDialog(false)}
                                        className="text-sm sm:text-base"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={!appointmentData.appointment_type || !appointmentData.reason}
                                        className="text-sm sm:text-base"
                                    >
                                        Continue to Schedule
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Schedule Date & Time */}
                        {bookingStep === 2 && (
                            <div className="space-y-4 mt-4">
                                <ScheduleCalendar
                                    onDateTimeSelect={handleDateTimeSelect}
                                    onConfirm={handleCalendarConfirm}
                                    className="border-0 shadow-none"
                                />

                                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBookingStep(1)}
                                        className="text-sm sm:text-base cursor-pointer"
                                    >
                                        <ChevronLeft />
                                        Back
                                    </Button>
                                    <Button 
                                        onClick={() => setBookingStep(3)}
                                        disabled={!appointmentData.scheduled_start_time}
                                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-sm sm:text-base"
                                    >
                                        Continue to Review
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preview & Confirm */}
                        {bookingStep === 3 && (
                            <div className="space-y-6 mt-4">
                                <div className="p-4 sm:p-6 border rounded-lg bg-muted/50">
                                    <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Appointment Summary</h4>
                                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                            <span className="font-medium">Appointment Type:</span>
                                            <span className="capitalize">{appointmentData.appointment_type.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                            <span className="font-medium">Reason:</span>
                                            <span className="text-right sm:text-left">{appointmentData.reason}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                            <span className="font-medium">Date & Time:</span>
                                            <span>
                                                {
                                                    selectedDateTime.date ? selectedDateTime.date.toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) 
                                                    : 
                                                    ''
                                                }
                                                {" "}
                                                at
                                                {" "}
                                                {selectedDateTime.time}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                            <span className="font-medium">Duration:</span>
                                            <span>30 minutes</span>
                                        </div>
                                        {appointmentData.notes && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                                <span className="font-medium">Additional Notes:</span>
                                                <span className="text-right sm:text-left max-w-xs break-words">{appointmentData.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBookingStep(2)}
                                        className="text-sm sm:text-base cursor-pointer"
                                    >
                                        <ChevronLeft />
                                        Back
                                    </Button>
                                    <Button 
                                        onClick={handleConfirmBooking}
                                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-sm sm:text-base"
                                    >
                                        Confirm Booking
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
