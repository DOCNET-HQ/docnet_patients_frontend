"use client";

import { useState } from "react";
import { addDays, setHours, setMinutes, subDays } from "date-fns";

import { EventCalendar, type CalendarEvent } from "@/components/calendar";

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Video Consultation - Robert Chen",
    description: "Annual physical examination - Remote consultation",
    start: subDays(new Date(), 24), // 24 days before today
    end: subDays(new Date(), 23), // 23 days before today
    allDay: false,
    color: "sky",
    location: "Telemedicine Platform"
  },
  {
    id: "2",
    title: "Follow-up - Maria Gonzalez",
    description: "Diabetes management and medication review",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0), // 1:00 PM, 9 days before
    end: setMinutes(setHours(subDays(new Date(), 9), 13), 30), // 1:30 PM, 9 days before
    color: "amber",
    location: "Video Call"
  },
  {
    id: "3",
    title: "Mental Health Session - James Wilson",
    description: "Therapy session - Anxiety management",
    start: subDays(new Date(), 13), // 13 days before today
    end: subDays(new Date(), 13), // 13 days before today
    allDay: false,
    color: "orange",
    location: "Secure Video Chat"
  },
  {
    id: "4",
    title: "New Patient Intake - Sarah Johnson",
    description: "Initial consultation and medical history review",
    start: setMinutes(setHours(new Date(), 10), 0), // 10:00 AM today
    end: setMinutes(setHours(new Date(), 10), 45), // 10:45 AM today
    color: "sky",
    location: "Telehealth Platform"
  },
  {
    id: "5",
    title: "Post-op Check - Michael Brown",
    description: "Remote surgical follow-up and wound assessment",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0), // 12:00 PM, 1 day from now
    end: setMinutes(setHours(addDays(new Date(), 1), 12), 25), // 12:25 PM, 1 day from now
    color: "emerald",
    location: "Video Consultation"
  },
  {
    id: "6",
    title: "Chronic Condition Management - Lisa Thompson",
    description: "Hypertension monitoring and prescription refill",
    start: addDays(new Date(), 3), // 3 days from now
    end: addDays(new Date(), 3), // 3 days from now
    allDay: false,
    color: "violet",
    location: "Remote Consultation"
  },
  {
    id: "7",
    title: "Specialist Consultation - David Miller",
    description: "Dermatology review - Skin condition assessment",
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30), // 2:30 PM, 4 days from now
    end: setMinutes(setHours(addDays(new Date(), 4), 15), 0), // 3:00 PM, 4 days from now
    color: "rose",
    location: "Telemedicine App"
  },
  {
    id: "8",
    title: "Pediatric Consultation - Emma Davis",
    description: "Child wellness check and vaccination advice",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0), // 9:00 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 9), 30), // 9:30 AM, 5 days from now
    color: "orange",
    location: "Video Call"
  },
  {
    id: "9",
    title: "Lab Results Discussion - Jennifer White",
    description: "Review blood test results and next steps",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0), // 2:00 PM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 20), // 2:20 PM, 5 days from now
    color: "sky",
    location: "Secure Telehealth"
  },
  {
    id: "10",
    title: "Medication Management - Richard Lee",
    description: "Prescription adjustment and side effect review",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45), // 9:45 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 15), // 10:15 AM, 5 days from now
    color: "amber",
    location: "Telemedicine Platform"
  },
  {
    id: "11",
    title: "Therapy Session - Maria Garcia",
    description: "Cognitive behavioral therapy - Weekly session",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0), // 10:00 AM, 9 days from now
    end: setMinutes(setHours(addDays(new Date(), 9), 10), 50), // 10:50 AM, 9 days from now
    color: "emerald",
    location: "Video Therapy"
  },
  {
    id: "12",
    title: "Nutrition Counseling - Thomas Clark",
    description: "Diet plan review and nutritional guidance",
    start: addDays(new Date(), 17), // 17 days from now
    end: addDays(new Date(), 17), // 17 days from now
    allDay: false,
    color: "sky",
    location: "Telehealth Consultation"
  },
  {
    id: "13",
    title: "Second Opinion Consultation - Patricia Adams",
    description: "Complex case review and treatment recommendations",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0), // 9:00 AM, 26 days from now
    end: setMinutes(setHours(addDays(new Date(), 26), 9), 45), // 9:45 AM, 26 days from now
    color: "rose",
    location: "Remote Second Opinion"
  }
];

export default function Page() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}
