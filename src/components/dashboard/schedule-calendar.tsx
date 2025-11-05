"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ScheduleCalendarProps {
  onDateTimeSelect?: (date: Date, time: string) => void
  onConfirm?: (date: Date, time: string) => void
  disabledDates?: Date[]
  className?: string
}

export default function ScheduleCalendar({
  onDateTimeSelect,
  onConfirm,
  disabledDates = [],
  className = ""
}: ScheduleCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const totalMinutes = i * 30
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = disabledDates

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (date && onDateTimeSelect) {
      onDateTimeSelect(date, time)
    }
  }

  const handleConfirm = () => {
    if (date && selectedTime && onConfirm) {
      onConfirm(date, selectedTime)
    }
  }

  return (
    <Card className={`gap-0 p-0 ${className}`}>
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            defaultMonth={date}
            disabled={bookedDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("en-US", { weekday: "short" })
              },
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => handleTimeSelect(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Selected:{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              {" "}at{" "}
              <span className="font-medium">{selectedTime}</span>
            </>
          ) : (
            <>Select a date and time</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          onClick={handleConfirm}
          className="w-full md:ml-auto md:w-auto"
        >
          Confirm Selection
        </Button>
      </CardFooter>
    </Card>
  )
}
