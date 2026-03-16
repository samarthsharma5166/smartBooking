// import FullCalendar from "@fullcalendar/react"
// import dayGridPlugin from "@fullcalendar/daygrid"
// import timeGridPlugin from "@fullcalendar/timegrid"
// import interactionPlugin from "@fullcalendar/interaction"
// import { useState, useEffect } from "react"
// import axiosInstance from "@/helper/axiosInstance"
// import { Button } from "../ui/button"
// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Calendar } from "../ui/calendar"
// import { Label } from "../ui/label"
// import { Input } from "../ui/input"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { format } from "date-fns"
// import { timeToMinutes } from "@/helper/helper"
// import {
//   CalendarDays,
//   Clock,
//   ShieldAlert,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   X,
//   CalendarClock,
//   LayoutGrid,
//   AlarmClock,
// } from "lucide-react"


// /* ─── Utility ─────────────────────────────────────────────────── */
// const formatTime = (minutes: number) => {
//   const h = Math.floor(minutes / 60).toString().padStart(2, "0")
//   const m = (minutes % 60).toString().padStart(2, "0")
//   return `${h}:${m}`
// }

// /* ─── Step indicator (reused from Booking style) ─────────────── */
// function StepIndicator({ current, total }: { current: number; total: number }) {
//   return (
//     <div className="flex items-center justify-center gap-1.5">
//       {Array.from({ length: total }).map((_, i) => {
//         const idx = i + 1
//         const done = idx < current
//         const active = idx === current
//         return (
//           <div key={i} className="flex items-center gap-1.5">
//             <div
//               className={`
//                                 flex items-center justify-center rounded-full text-[11px] font-bold
//                                 transition-all duration-300 shrink-0
//                                 ${active
//                   ? "w-7 h-7 bg-rose-500 text-white shadow shadow-rose-200"
//                   : done
//                     ? "w-6 h-6 bg-rose-100 text-rose-600 ring-1 ring-rose-300"
//                     : "w-6 h-6 bg-slate-100 text-slate-400 ring-1 ring-slate-200"
//                 }
//                             `}
//             >
//               {done ? <Check className="w-3 h-3" /> : idx}
//             </div>
//             {i < total - 1 && (
//               <div className={`h-px w-6 rounded transition-colors duration-300 ${done ? "bg-rose-300" : "bg-slate-200"}`} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// /* ─── Block modal ──────────────────────────────────────────────── */
// export function AlertModel({ onBlocked }: { onBlocked?: () => void }) {
//   const [open, setOpen] = useState(false)
//   const [step, setStep] = useState(1)
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>()
//   const [startTime, setStartTime] = useState("")
//   const [endTime, setEndTime] = useState("")
//   const [submitting, setSubmitting] = useState(false)

//   const totalSteps = 2
//   const progressValue = (step / totalSteps) * 100

//   const isStep1Valid = !!selectedDate
//   const isStep2Valid = !!(startTime && endTime && startTime < endTime)

//   const handleClose = () => {
//     setOpen(false)
//     setStep(1)
//     setSelectedDate(undefined)
//     setStartTime("")
//     setEndTime("")
//   }

//   const handleSubmit = async () => {
//     setSubmitting(true)
//     try {
//       await axiosInstance.post("/doctor/markBlock", {
//         date: format(selectedDate!, "yyyy-MM-dd"),
//         startTimeInMinutes: timeToMinutes(startTime),
//         endTimeInMinutes: timeToMinutes(endTime),
//       })
//       onBlocked?.()
//       handleClose()
//     } catch (error: any) {
//       alert(error.response?.data?.message ?? "Failed to block slot.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const STEP_META = [
//     { label: "Select Date", icon: CalendarDays },
//     { label: "Set Time Range", icon: AlarmClock },
//   ]

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogTrigger asChild>
//         <Button
//           className="
//                         gap-2 bg-rose-500 hover:bg-rose-600 text-white
//                         rounded-xl px-5 h-10 text-sm font-semibold
//                         shadow-md shadow-rose-200 hover:shadow-rose-300
//                         transition-all duration-150
//                     "
//         >
//           <ShieldAlert className="w-4 h-4" />
//           Block Time Slot
//         </Button>
//       </AlertDialogTrigger>

//       <AlertDialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-xl">

//         {/* ── Modal header band ──────────────────── */}
//         <div className="bg-gradient-to-br from-rose-500 to-rose-600 px-5 py-4 relative">
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//               backgroundSize: "18px 18px",
//             }}
//           />
//           <div className="relative flex items-start justify-between">
//             <div>
//               <div className="flex items-center gap-2 mb-0.5">
//                 <ShieldAlert className="w-4 h-4 text-rose-200" />
//                 <span className="text-xs font-semibold text-rose-200 uppercase tracking-wide">
//                   Availability Block
//                 </span>
//               </div>
//               <h2 className="text-lg font-bold text-white">
//                 {STEP_META[step - 1].label}
//               </h2>
//             </div>
//             <AlertDialogCancel
//               onClick={handleClose}
//               className="
//                                 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30
//                                 border-0 p-0 flex items-center justify-center
//                                 text-white transition-colors mt-0.5
//                             "
//               aria-label="Close"
//             >
//               <X className="w-3.5 h-3.5" />
//             </AlertDialogCancel>
//           </div>

//           {/* Step indicators + progress */}
//           <div className="mt-4 space-y-2">
//             <StepIndicator current={step} total={totalSteps} />
//             <Progress
//               value={progressValue}
//               className="h-1 bg-rose-400/40 [&>div]:bg-white [&>div]:transition-all [&>div]:duration-500"
//             />
//           </div>
//         </div>

//         {/* ── Modal body ─────────────────────────── */}
//         <div className="px-5 py-5">

//           {/* STEP 1 — Date */}
//           {step === 1 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
//               <p className="text-xs text-slate-500">
//                 Choose the date you want to mark as unavailable.
//               </p>
//               <div className="flex justify-center">
//                 <Calendar
//                   mode="single"
//                   selected={selectedDate}
//                   onSelect={setSelectedDate}
//                   disabled={(date) =>
//                     date < new Date(new Date().setHours(0, 0, 0, 0))
//                   }
//                   className="rounded-xl border border-slate-200 p-2 shadow-sm w-full"
//                 />
//               </div>
//               {selectedDate && (
//                 <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 rounded-lg border border-rose-100">
//                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
//                   <span className="text-xs font-semibold text-rose-700">
//                     {format(selectedDate, "EEEE, MMMM dd, yyyy")}
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* STEP 2 — Time range */}
//           {step === 2 && (
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
//               {/* Date recap chip */}
//               <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 rounded-lg border border-rose-100">
//                 <CalendarDays className="w-3.5 h-3.5 text-rose-500 shrink-0" />
//                 <span className="text-xs font-semibold text-rose-700">
//                   {selectedDate && format(selectedDate, "EEEE, MMMM dd, yyyy")}
//                 </span>
//               </div>

//               <p className="text-xs text-slate-500">
//                 Set the time range to block. Appointments won't be allowed in this window.
//               </p>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1">
//                     <Clock className="w-3 h-3" /> Start
//                   </Label>
//                   <Input
//                     type="time"
//                     step="60"
//                     value={startTime}
//                     onChange={(e) => setStartTime(e.target.value)}
//                     className="h-10 text-sm rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-rose-400/40 focus-visible:border-rose-400"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1">
//                     <Clock className="w-3 h-3" /> End
//                   </Label>
//                   <Input
//                     type="time"
//                     step="60"
//                     value={endTime}
//                     onChange={(e) => setEndTime(e.target.value)}
//                     className="h-10 text-sm rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-rose-400/40 focus-visible:border-rose-400"
//                   />
//                 </div>
//               </div>

//               {/* Duration preview */}
//               {startTime && endTime && startTime < endTime && (
//                 <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
//                   <CalendarClock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
//                   <span className="text-xs text-slate-600">
//                     Blocking{" "}
//                     <span className="font-semibold text-slate-800">
//                       {startTime} – {endTime}
//                     </span>
//                     {" "}·{" "}
//                     {(() => {
//                       const diff = timeToMinutes(endTime) - timeToMinutes(startTime)
//                       return `${diff} min`
//                     })()}
//                   </span>
//                 </div>
//               )}

//               {startTime && endTime && startTime >= endTime && (
//                 <p className="text-xs text-rose-500 flex items-center gap-1.5">
//                   <X className="w-3.5 h-3.5" />
//                   End time must be later than start time.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── Modal footer ───────────────────────── */}
//         <div className="flex justify-between items-center px-5 py-4 border-t border-slate-100 bg-slate-50/60">
//           {step === 1 ? (
//             <AlertDialogCancel
//               onClick={handleClose}
//               className="h-9 px-4 text-sm rounded-lg text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100"
//             >
//               Cancel
//             </AlertDialogCancel>
//           ) : (
//             <Button
//               variant="ghost"
//               onClick={() => setStep((s) => s - 1)}
//               className="gap-1.5 h-9 px-3 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Back
//             </Button>
//           )}

//           {step < totalSteps ? (
//             <Button
//               onClick={() => setStep((s) => s + 1)}
//               disabled={!isStep1Valid}
//               className="
//                                 gap-2 bg-rose-500 hover:bg-rose-600 text-white
//                                 rounded-lg px-5 h-9 text-sm font-semibold
//                                 shadow shadow-rose-200 disabled:opacity-50 disabled:shadow-none
//                                 transition-all duration-150
//                             "
//             >
//               Continue
//               <ChevronRight className="w-4 h-4" />
//             </Button>
//           ) : (
//             <Button
//               onClick={handleSubmit}
//               disabled={!isStep2Valid || submitting}
//               className="
//                                 gap-2 bg-rose-500 hover:bg-rose-600 text-white
//                                 rounded-lg px-5 h-9 text-sm font-semibold
//                                 shadow shadow-rose-200 disabled:opacity-50 disabled:shadow-none
//                                 transition-all duration-150
//                             "
//             >
//               {submitting ? (
//                 <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
//               ) : (
//                 <><Check className="w-4 h-4" /> Confirm Block</>
//               )}
//             </Button>
//           )}
//         </div>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

// /* ─── Calendar view legend item ───────────────────────────────── */
// function LegendDot({ color, label }: { color: string; label: string }) {
//   return (
//     <div className="flex items-center gap-1.5">
//       <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
//       <span className="text-xs text-slate-500">{label}</span>
//     </div>
//   )
// }
// const EVENT_COLORS: Record<string, { bg: string; border: string }> = {
//   BLOCKED: { bg: "#F43F5E", border: "#E11D48" },   // red
//   BOOKED: { bg: "#0EA5E9", border: "#0284C7" },    // blue
//   AVAILABLE: { bg: "#10B981", border: "#059669" }, // green
// }
// /* ─── Main dashboard ──────────────────────────────────────────── */
// const DoctorAvaliability = () => {
//   const [events, setEvents] = useState([])
//   const [stats, setStats] = useState({
//     todaysAppointments: 0,
//     blockedToday: 0,
//     nextAppointment: null,
//     thisWeekBookings: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await axiosInstance.get("/stats");
//         setStats(res.data.stats);
//       } catch (error) {
//         console.error("Failed to fetch stats", error);
//       }
//     };
//     fetchStats();
//   }, []);

//   const { todaysAppointments, blockedToday, nextAppointment, thisWeekBookings } = stats;

//   const nextAppointmentTime = nextAppointment
//     ? formatTime(nextAppointment.startTime)
//     : "N/A";

//   const fetchBlocks = async (start: string, end: string) => {
//     try {
//       const res = await axiosInstance.get("/doctor/blocks", {
//         params: { start, end },
//       })

//       console.log(res.data[0])

//       const formatted = res.data.map((item: any) => {
//         const year = new Date(start).getFullYear()
//         const month = new Date(start).getMonth()
//         const eventDate = new Date(year, month, item.date)

//         const startDT = new Date(eventDate)
//         startDT.setMinutes(item.start)

//         const endDT = new Date(eventDate)
//         endDT.setMinutes(item.end)

//         const colors = EVENT_COLORS[item.type === "BLOCK"? "BLOCKED" : "AVAILABLE"] || {
//           bg: "#64748B",     // fallback gray
//           border: "#475569",
//         }

//         return {
//           title: item.type,
//           start: startDT.toISOString(),
//           end: endDT.toISOString(),
//           backgroundColor: colors.bg,
//           borderColor: colors.border,
//           textColor: "white",
//           classNames: ["fc-blocked-event"],
//         }
//       })

//       setEvents(formatted)
//     } catch (error: any) {
//       alert(error.response?.data?.message)
//     }
//   }

//   const statsData = [
//     { icon: CalendarDays, label: "Today's Slots", value: todaysAppointments, sub: "appointments", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100" },
//     { icon: ShieldAlert, label: "Blocked Today", value: blockedToday, sub: "slots", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
//     { icon: Clock, label: "Next Appointment", value: nextAppointmentTime, sub: nextAppointmentTime === 'N/A' ? '' : "PM today", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
//     { icon: CalendarClock, label: "This Week", value: thisWeekBookings, sub: "bookings", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
//   ]
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-sky-50/30 p-5 lg:p-7">

//       {/* ── Page header ────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
//         <div className="flex items-start gap-4">
//           {/* Icon badge */}
//           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-200 shrink-0">
//             <LayoutGrid className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-900 leading-tight">
//               Doctor Availability
//             </h1>
//             <p className="text-sm text-slate-500 mt-0.5">
//               Manage your schedule and block unavailable time slots.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 shrink-0">
//           {/* Legend */}
//           <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
//             <LegendDot color="bg-teal-400" label="Available" />
//             <LegendDot color="bg-rose-400" label="Blocked" />
//             <LegendDot color="bg-sky-400" label="Booked" />
//           </div>
//           <AlertModel onBlocked={() => fetchBlocks(
//             new Date().toISOString(),
//             new Date(Date.now() + 7 * 86400000).toISOString()
//           )} />
//         </div>
//       </div>

//       {/* ── Stats strip ───────────────────────────── */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
//         {statsData.map(({ icon: Icon, label, value, sub, color, bg, border }) => (
//           <div key={label} className={`flex items-center gap-3 p-4 rounded-xl border ${border} ${bg} bg-white shadow-sm`}>
//             <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0`}>
//               <Icon className={`w-4 h-4 ${color}`} />
//             </div>
//             <div>
//               <div className={`text-lg font-bold ${color}`}>{value}
//                 <span className="text-xs font-normal text-slate-400 ml-1">{sub}</span>
//               </div>
//               <div className="text-[11px] text-slate-500 font-medium">{label}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Calendar card ──────────────────────────── */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 lg:p-6">
//         {/* Custom FullCalendar styles scoped via wrapper */}
//         <style>{`
//                     .fc { font-family: inherit; }
//                     .fc .fc-toolbar-title { font-size: 1rem; font-weight: 700; color: #0f172a; }
//                     .fc .fc-button {
//                         background: white !important;
//                         border: 1px solid #e2e8f0 !important;
//                         color: #475569 !important;
//                         border-radius: 8px !important;
//                         font-size: 0.75rem !important;
//                         font-weight: 600 !important;
//                         padding: 6px 12px !important;
//                         box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
//                         transition: all 0.15s !important;
//                     }
//                     .fc .fc-button:hover {
//                         background: #f8fafc !important;
//                         border-color: #cbd5e1 !important;
//                         color: #0f172a !important;
//                     }
//                     .fc .fc-button-active, .fc .fc-button-primary:not(:disabled).fc-button-active {
//                         background: #0f766e !important;
//                         border-color: #0f766e !important;
//                         color: white !important;
//                     }
//                     .fc .fc-col-header-cell-cushion { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
//                     .fc .fc-timegrid-slot-label-cushion { font-size: 0.68rem; color: #94a3b8; font-weight: 500; }
//                     .fc .fc-daygrid-day-number { font-size: 0.78rem; font-weight: 600; color: #475569; }
//                     .fc .fc-event { border-radius: 6px !important; font-size: 0.7rem !important; font-weight: 600 !important; border: none !important; }
//                     .fc .fc-timegrid-now-indicator-line { border-color: #0d9488 !important; }
//                     .fc .fc-timegrid-now-indicator-arrow { border-top-color: #0d9488 !important; }
//                     .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9 !important; }
//                     .fc-theme-standard .fc-scrollgrid { border-color: #f1f5f9 !important; }
//                 `}</style>

//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView="timeGridWeek"
//           events={events}
//           selectable={true}
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,timeGridWeek,timeGridDay",
//           }}
//           datesSet={(info) => fetchBlocks(info.startStr, info.endStr)}
//           height="auto"
//           slotMinTime="07:00:00"
//           slotMaxTime="22:00:00"
//           slotLabelInterval="01:00"
//           allDaySlot={false}
//           nowIndicator={true}
//           eventDisplay="block"
//         />
//       </div>
//     </div>
//   )
// }

// export default DoctorAvaliability

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import scrollGridPlugin from "@fullcalendar/scrollgrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useState, useEffect } from "react"
import axiosInstance from "@/helper/axiosInstance"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { timeToMinutes } from "@/helper/helper"
import {
  CalendarDays,
  Clock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  CalendarClock,
  Brain,
  Sparkles,
  HeartPulse,
  BookOpen,
} from "lucide-react"

/* ─── Utility ──────────────────────────────────────────────────── */
const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0")
  const m = (minutes % 60).toString().padStart(2, "0")
  return `${h}:${m}`
}

/* ─── Step indicator ───────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1
        const done = idx < current
        const active = idx === current
        return (
          <div key={`step-${idx}`} className="flex items-center gap-2">
            <div className={`flex items-center justify-center rounded-full text-[11px] font-bold transition-all duration-500 shrink-0
              ${active ? "w-8 h-8 bg-white text-violet-700 shadow-lg" : done ? "w-7 h-7 bg-white/40 text-white ring-1 ring-white/60" : "w-7 h-7 bg-white/20 text-white/50 ring-1 ring-white/20"}`}>
              {done ? <Check className="w-3.5 h-3.5" /> : idx}
            </div>
            {i < total - 1 && (
              <div className={`h-px w-8 rounded transition-all duration-500 ${done ? "bg-white/70" : "bg-white/25"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Block modal ───────────────────────────────────────────────── */
export function AlertModel({ onBlocked }: { onBlocked?: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const totalSteps = 2
  const isStep1Valid = !!selectedDate
  const isStep2Valid = !!(startTime && endTime && startTime < endTime)

  const handleClose = () => {
    setOpen(false)
    setStep(1)
    setSelectedDate(undefined)
    setStartTime("")
    setEndTime("")
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await axiosInstance.post("/doctor/markBlock", {
        date: format(selectedDate!, "yyyy-MM-dd"),
        startTimeInMinutes: timeToMinutes(startTime),
        endTimeInMinutes: timeToMinutes(endTime),
      })
      onBlocked?.()
      handleClose()
    } catch (error: any) {
      alert(error.response?.data?.message ?? "Failed to block slot.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2.5 sm:px-5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)", boxShadow: "0 4px 16px rgba(244,63,94,0.28)" }}
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Block Time Slot</span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* Content — bottom sheet on mobile, centered dialog on sm+ */}
        <DialogPrimitive.Content
          onEscapeKeyDown={handleClose}
          onInteractOutside={handleClose}
          className="
            fixed z-50 overflow-hidden bg-white outline-none
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0

            /* ── Mobile: bottom sheet ── */
            bottom-0 left-0 right-0 w-full rounded-t-3xl
            data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom
            duration-300

            /* ── sm+: centered dialog ── */
            sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2
            sm:-translate-x-1/2 sm:-translate-y-1/2
            sm:w-full sm:max-w-sm sm:rounded-3xl
            sm:data-[state=closed]:slide-out-to-left-1/2
            sm:data-[state=closed]:slide-out-to-top-[48%]
            sm:data-[state=open]:slide-in-from-left-1/2
            sm:data-[state=open]:slide-in-from-top-[48%]
          "
          style={{ boxShadow: "0 -8px 40px rgba(109,40,217,0.18), 0 0 0 1px rgba(109,40,217,0.1)" }}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          {/* Header */}
          <div
            className="relative px-5 pt-4 pb-5 sm:px-6 sm:pt-6 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)" }}
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #c4b5fd, transparent)" }} />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />

            <div className="relative flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold text-violet-200 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3" /> Availability Block
                </p>
                <DialogPrimitive.Title className="text-lg sm:text-xl font-bold text-white">
                  {step === 1 ? "Choose a Date" : "Set Time Range"}
                </DialogPrimitive.Title>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <StepIndicator current={step} total={totalSteps} />
            <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-5 sm:px-6 bg-white">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-medium">Select the date you want to mark as unavailable.</p>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-2xl border border-violet-100 p-2 w-full max-w-xs shadow-sm"
                  />
                </div>
                {selectedDate && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shrink-0" />
                    <span className="text-sm font-semibold text-violet-700 break-words">
                      {format(selectedDate, "EEEE, MMMM dd, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100">
                  <CalendarDays className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="text-sm font-semibold text-violet-700 break-words min-w-0">
                    {selectedDate && format(selectedDate, "EEEE, MMMM dd, yyyy")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">No sessions will be scheduled during this window.</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Start", value: startTime, onChange: setStartTime },
                    { label: "End", value: endTime, onChange: setEndTime },
                  ].map(({ label, value, onChange }) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {label}
                      </label>
                      <input
                        type="time"
                        step="60"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-11 px-3 text-sm font-medium rounded-xl text-slate-800 outline-none transition-all duration-200 bg-slate-50 border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>
                  ))}
                </div>

                {startTime && endTime && startTime < endTime && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <CalendarClock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-700 font-medium break-words">
                      Blocking <span className="font-bold">{startTime} – {endTime}</span>
                      {" · "}{timeToMinutes(endTime) - timeToMinutes(startTime)} min
                    </span>
                  </div>
                )}

                {startTime && endTime && startTime >= endTime && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <p className="text-xs text-rose-500 font-medium">End time must be later than start time.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-5 py-4 sm:px-6 bg-slate-50 border-t border-slate-100">
            {step === 1 ? (
              <button
                onClick={handleClose}
                className="h-10 px-4 text-sm rounded-xl text-slate-400 hover:text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 h-10 px-4 text-sm rounded-xl text-slate-400 hover:text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!isStep1Valid}
                className="flex items-center gap-2 px-5 h-10 text-sm font-bold rounded-xl text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: isStep1Valid ? "0 4px 14px rgba(109,40,217,0.35)" : "none" }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStep2Valid || submitting}
                className="flex items-center gap-2 px-5 h-10 text-sm font-bold rounded-xl text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)", boxShadow: isStep2Valid ? "0 4px 14px rgba(244,63,94,0.35)" : "none" }}
              >
                {submitting ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><Check className="w-4 h-4" /> Confirm Block</>
                )}
              </button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/* ─── Stat card ─────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent, bgFrom, bgTo }: any) {
  return (
    <div
      className="group relative rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default bg-white"
      style={{ border: `1px solid ${accent}22`, boxShadow: `0 2px 16px ${accent}10` }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 rounded-bl-[60px] sm:rounded-bl-[70px] opacity-30 transition-opacity duration-300 group-hover:opacity-50"
        style={{ background: `linear-gradient(225deg, ${bgFrom}, ${bgTo})` }}
      />
      <div className="relative">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
          style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})`, boxShadow: `0 4px 12px ${accent}28` }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 truncate" style={{ color: accent }}>{label}</p>
        <p className="text-2xl sm:text-3xl font-black text-slate-800 leading-none">{value}</p>
        {sub && <p className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium truncate">{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Legend pill ───────────────────────────────────────────────── */
function LegendPill({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{label}</span>
    </div>
  )
}

const EVENT_COLORS: Record<string, { bg: string; border: string }> = {
  BLOCKED: { bg: "#f43f5e", border: "#e11d48" },
  BOOKED: { bg: "#8b5cf6", border: "#7c3aed" },
  AVAILABLE: { bg: "#10b981", border: "#059669" },
}

/* ─── Main dashboard ────────────────────────────────────────────── */
const DoctorAvailability = () => {
  const [events, setEvents] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    blockedToday: 0,
    nextAppointment: null,
    thisWeekBookings: 0,
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/stats")
        setStats(res.data.stats)
      } catch (error) {
        console.error("Failed to fetch stats", error)
      }
    }
    fetchStats()
  }, [])

  const { todaysAppointments, blockedToday, nextAppointment, thisWeekBookings } = stats
  const nextAppointmentTime = nextAppointment ? formatTime((nextAppointment as any).startTime) : "N/A"

  const fetchBlocks = async (start: string, end: string) => {
    try {
      const res = await axiosInstance.get("/doctor/blocks", { params: { start, end } })
      console.log(res.data[0])
      const formatted = res.data.map((item: any) => {
        const year = new Date(start).getFullYear()
        const month = new Date(start).getMonth()
        const eventDate = new Date(year, month, item.date)
        const startDT = new Date(eventDate)
        startDT.setMinutes(item.start)
        const endDT = new Date(eventDate)
        endDT.setMinutes(item.end)
        const colors = EVENT_COLORS[item.type === "BLOCK" ? "BLOCKED" : "AVAILABLE"] || { bg: "#94a3b8", border: "#64748b" }
        return {
          title: item.type,
          start: startDT.toISOString(),
          end: endDT.toISOString(),
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: "white",
          classNames: ["fc-blocked-event"],
        }
      })
      setEvents(formatted)
    } catch (error: any) {
      alert(error.response?.data?.message)
    }
  }

  const statsData = [
    { icon: CalendarDays, label: "Today's Sessions", value: todaysAppointments, sub: "appointments booked", accent: "#0891b2", bgFrom: "#38bdf8", bgTo: "#0ea5e9" },
    { icon: ShieldAlert, label: "Blocked Today", value: blockedToday, sub: "slots unavailable", accent: "#e11d48", bgFrom: "#fb7185", bgTo: "#f43f5e" },
    { icon: Clock, label: "Next Session", value: nextAppointmentTime, sub: nextAppointmentTime === "N/A" ? "No upcoming" : "today", accent: "#7c3aed", bgFrom: "#a78bfa", bgTo: "#8b5cf6" },
    { icon: HeartPulse, label: "This Week", value: thisWeekBookings, sub: "total sessions", accent: "#059669", bgFrom: "#34d399", bgTo: "#10b981" },
  ]

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-8">

      {/* Ambient blobs */}
      <div
        className="hidden sm:block fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 10%, rgba(221,214,254,0.5) 0%, transparent 55%)" }}
      />
      <div
        className="hidden sm:block fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 10% 90%, rgba(187,247,208,0.4) 0%, transparent 55%)" }}
      />

      {/* ── Page header ──────────────────────────────────────────── */}
      <div
        className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-7 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white overflow-hidden"
        style={{ boxShadow: "0 4px 30px rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.09)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl sm:rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, #8b5cf6 0%, #06b6d4 40%, #10b981 70%, #f59e0b 100%)" }}
        />

        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", boxShadow: "0 6px 20px rgba(124,58,237,0.28)" }}
          >
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight">
                Availability Manager
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-100 whitespace-nowrap">
                Psychologist
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-snug">
              Manage your session schedule and unavailable windows
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <LegendPill color="#10b981" label="Available" />
            <LegendPill color="#f43f5e" label="Blocked" />
            <LegendPill color="#8b5cf6" label="Booked" />
          </div>
          <AlertModel onBlocked={() => fetchBlocks(
            new Date().toISOString(),
            new Date(Date.now() + 7 * 86400000).toISOString()
          )} />
        </div>
      </div>

      {/* ── Stats grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {statsData.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Wellness quote strip ─────────────────────────────────── */}
      <div
        className="flex items-start sm:items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 mb-5 sm:mb-6 rounded-xl sm:rounded-2xl"
        style={{ background: "linear-gradient(135deg, #ede9fe 0%, #faf5ff 100%)", border: "1px solid #ddd6fe" }}
      >
        <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs font-semibold text-violet-500 italic leading-relaxed flex-1">
          "Each session is an opportunity to guide someone toward healing."
        </p>
        <BookOpen className="w-4 h-4 text-violet-300 shrink-0 hidden sm:block" />
      </div>

      {/* ── Calendar card ────────────────────────────────────────── */}
      <div
        className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white"
        style={{ boxShadow: "0 4px 30px rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.08)" }}
      >
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #faf9ff 0%, #f5f3ff 100%)", borderBottom: "1px solid #ede9fe" }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}
            >
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-700 leading-tight">Session Calendar</p>
              <p className="text-[11px] text-slate-400 font-semibold hidden sm:block">Your weekly overview</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-600">Live</span>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
          .fc { font-family: 'Nunito', sans-serif !important; }
          .fc .fc-toolbar {
            flex-wrap: wrap !important;
            gap: 8px !important;
            padding: 12px 14px 10px !important;
          }
          @media (max-width: 480px) {
            .fc .fc-toolbar {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .fc .fc-toolbar-chunk {
              display: flex !important;
              justify-content: center !important;
            }
          }
          .fc .fc-toolbar-title {
            font-size: 0.9rem !important;
            font-weight: 900 !important;
            color: #1e1b4b !important;
            letter-spacing: -0.02em;
          }
          @media (min-width: 640px) {
            .fc .fc-toolbar-title { font-size: 1rem !important; }
            .fc .fc-toolbar { padding: 16px 20px 12px !important; }
          }
          .fc .fc-button {
            background: white !important;
            border: 1.5px solid #e5e7eb !important;
            color: #6b7280 !important;
            border-radius: 10px !important;
            font-size: 0.65rem !important;
            font-weight: 800 !important;
            padding: 5px 9px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
            transition: all 0.15s !important;
            text-transform: uppercase !important;
            letter-spacing: 0.06em !important;
          }
          @media (min-width: 640px) {
            .fc .fc-button { border-radius: 12px !important; font-size: 0.69rem !important; padding: 6px 12px !important; }
          }
          .fc .fc-button:hover {
            background: #faf5ff !important;
            border-color: #c4b5fd !important;
            color: #7c3aed !important;
            box-shadow: 0 2px 8px rgba(124,58,237,0.14) !important;
          }
          .fc .fc-button-active,
          .fc .fc-button-primary:not(:disabled).fc-button-active {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
            border-color: transparent !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(124,58,237,0.32) !important;
          }
          .fc .fc-col-header-cell-cushion {
            font-size: 0.6rem !important; font-weight: 900 !important;
            color: #9ca3af !important; text-transform: uppercase !important;
            letter-spacing: 0.08em !important; padding: 8px 2px !important;
          }
          @media (min-width: 640px) {
            .fc .fc-col-header-cell-cushion { font-size: 0.67rem !important; letter-spacing: 0.1em !important; padding: 10px 4px !important; }
          }
          .fc .fc-timegrid-slot-label-cushion {
            font-size: 0.6rem !important; color: #d1d5db !important; font-weight: 700 !important;
          }
          @media (min-width: 640px) {
            .fc .fc-timegrid-slot-label-cushion { font-size: 0.64rem !important; }
          }
          .fc .fc-daygrid-day-number { font-size: 0.72rem !important; font-weight: 800 !important; color: #6b7280 !important; }
          @media (min-width: 640px) {
            .fc .fc-daygrid-day-number { font-size: 0.78rem !important; }
          }
          .fc .fc-event {
            border-radius: 8px !important; font-size: 0.6rem !important;
            font-weight: 800 !important; border: none !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; padding: 1px 4px !important;
          }
          @media (min-width: 640px) {
            .fc .fc-event { border-radius: 10px !important; font-size: 0.68rem !important; padding: 2px 6px !important; }
          }
          .fc .fc-timegrid-now-indicator-line { border-color: #8b5cf6 !important; border-width: 2px !important; }
          .fc .fc-timegrid-now-indicator-arrow { border-top-color: #8b5cf6 !important; }
          .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6 !important; }
          .fc-theme-standard .fc-scrollgrid { border-color: #f3f4f6 !important; }
          .fc-day-today { background: rgba(139,92,246,0.03) !important; }
          .fc .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion { color: #7c3aed !important; }
          .fc .fc-highlight { background: rgba(139,92,246,0.07) !important; border-radius: 8px !important; }
          .fc .fc-timegrid-axis { min-width: 40px !important; }
          @media (min-width: 640px) {
            .fc .fc-timegrid-axis { min-width: 50px !important; }
          }
        `}</style>

        <div className="p-2 sm:p-3">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, scrollGridPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            events={events}
            selectable={true}
            headerToolbar={
              isMobile
                ? { left: "prev,next", center: "title", right: "today" }
                : { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }
            }
            footerToolbar={
              isMobile
                ? { center: "dayGridMonth,timeGridWeek,timeGridDay" }
                : undefined
            }
            datesSet={(info) => fetchBlocks(info.startStr, info.endStr)}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            slotLabelInterval="01:00"
            allDaySlot={false}
            nowIndicator={true}
            eventDisplay="block"
            dayMinWidth={isMobile ? undefined : 80}
          />
        </div>
      </div>
    </div>
  )
}

export default DoctorAvailability