import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    // CardTitle,
} from "../ui/card";
import { Calendar } from "../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    User,
    Calendar as CalendarIcon,
    Clock,
    Mail,
    Phone,
    UserCircle2,
    Loader2,
    Star,
    Award,
    BookOpen,
    Heart,
    Brain,
    Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { ImageWithFallback } from "../ImageWithFallback";
import axiosInstance from "@/helper/axiosInstance";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import axios from "axios";
/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
type FormData = {
    name: string;
    email: string;
    whatsapp: string;
    date: Date | undefined;
    sessionTypeId: string;
    timeSlot: Slot | null;
};

type Slot = { start: number; end: number; isAvailable?: boolean };

/* ─────────────────────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────────────────────── */
const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
};

const STEP_LABELS = ["Your Details", "Session Type", "Date & Time"];

const SPECIALTIES = [
    { icon: Brain, label: "Child & Adolescent Issues" },
    { icon: Heart, label: "Marital & Couple Therapy" },
    { icon: Star, label: "Peak Performance Coaching" },
    { icon: Sparkles, label: "Anxiety & Depression Support" },
    { icon: BookOpen, label: "Life Transitions" },
];

const AFFILIATIONS = ["IIT Delhi", "IIT Bombay", "Common Cause", "Amity University"];

/* ─────────────────────────────────────────────────────────────────
   StepIndicator
───────────────────────────────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: total }).map((_, i) => {
                const idx = i + 1;
                const done = idx < current;
                const active = idx === current;
                return (
                    <div key={i} className="flex items-center gap-1">
                        <div
                            className={`
                                flex items-center justify-center rounded-full text-[11px] font-bold
                                transition-all duration-300 shrink-0
                                ${active
                                    ? "w-7 h-7 bg-teal-600 text-white shadow shadow-teal-200"
                                    : done
                                        ? "w-6 h-6 bg-teal-100 text-teal-600 ring-1 ring-teal-300"
                                        : "w-6 h-6 bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                                }
                            `}
                        >
                            {done ? <Check className="w-3 h-3" /> : idx}
                        </div>
                        {i < total - 1 && (
                            <div
                                className={`h-px w-5 rounded transition-colors duration-300 ${done ? "bg-teal-300" : "bg-slate-200"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   IconInput
───────────────────────────────────────────────────────────────── */
function IconInput({
    id, label, type = "text", placeholder, value, onChange, icon: Icon, required,
}: {
    id: string; label: string; type?: string; placeholder: string;
    value: string; onChange: (v: string) => void;
    icon: React.ElementType; required?: boolean;
}) {
    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {label}
                {required && <span className="text-rose-400 ml-0.5">*</span>}
            </Label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Icon className="w-4 h-4" />
                </div>
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-required={required}
                    className="
                        pl-9 h-10 text-sm rounded-lg border-slate-200 bg-white
                        focus-visible:ring-2 focus-visible:ring-teal-500/30
                        focus-visible:border-teal-500 transition-all
                    "
                />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   DoctorProfile  (Left column — profile only, no calendar)
───────────────────────────────────────────────────────────────── */
function DoctorProfile() {
    return (
        <Card className="rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Decorative teal header band */}
            <div className="h-20 bg-gradient-to-br from-teal-600 to-teal-700 relative">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                    }}
                />
            </div>

            <CardContent className="px-5 pb-5 -mt-10">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md mb-3">
                    <ImageWithFallback
                        src="/dr1.webp"
                        alt="Dr. Meera Iyer"
                        className="w-full h-full object-cover  bg-teal-100"
                        // fallback={
                        //     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200">
                        //         <UserCircle2 className="w-10 h-10 text-teal-500" />
                        //     </div>
                        // }
                    />
                </div>

                {/* Name & title */}
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Dr. Meera Iyer</h2>
                <p className="text-xs font-medium text-teal-600 mt-0.5 mb-2">
                    Founder-Director, Inspired Living
                </p>

                {/* Credential badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="secondary" className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-2">
                        RCI-Licensed Psychologist
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2">
                        Motivational Speaker
                    </Badge>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { num: "15+", sub: "Yrs Exp." },
                        { num: "500+", sub: "Clients" },
                        { num: "4.9", sub: "Rating" },
                    ].map(({ num, sub }) => (
                        <div key={sub} className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-2 text-center">
                            <div className="text-sm font-bold text-teal-700">{num}</div>
                            <div className="text-[10px] text-slate-500 leading-tight">{sub}</div>
                        </div>
                    ))}
                </div>

                {/* Short bio */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    15+ years in counselling, psychotherapy, and training — focused on{" "}
                    <span className="font-medium text-slate-700">emotional resilience</span> and{" "}
                    <span className="font-medium text-slate-700">relationship growth</span>.
                </p>

                {/* Specialties list */}
                <div className="space-y-1.5 mb-4">
                    {SPECIALTIES.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-teal-50 flex items-center justify-center shrink-0">
                                <Icon className="w-3 h-3 text-teal-600" />
                            </div>
                            <span className="text-xs text-slate-600">{label}</span>
                        </div>
                    ))}
                </div>

                <Separator className="my-3" />

                {/* Affiliations */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                        Previously at
                    </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {AFFILIATIONS.map((name) => (
                        <span
                            key={name}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────── */
const Booking = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: "", email: "", whatsapp: "",
        date: undefined, sessionTypeId: "", timeSlot: null,
    });
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [sessionTypes, setSessionTypes] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState('');

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    useEffect(() => {
        const fetchSessionTypes = async () => {
            try {
                const response = await axiosInstance.get(
                    `/session-types`
                );
                setSessionTypes(response.data.data.sessionTypes);
            } catch (error: any) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.message as string || "Something went wrong!",
                });
                return;
            }
        };
        fetchSessionTypes();
    }, []);

    useEffect(() => {
        const form = document.getElementById("payment_post") as HTMLFormElement;
        if (form) {
            form.submit()
        }
    }, [form])

    /* ── Fetch slots when date or session type changes ── */
    useEffect(() => {
        if (!formData.date || !formData.sessionTypeId) return;
        const fetchSlots = async () => {
            setLoadingSlots(true);
            setAvailableSlots([]);
            setFormData((prev) => ({ ...prev, timeSlot: null }));
            try {
                const dateString = format(formData.date!, "yyyy-MM-dd");
                const response = await axiosInstance.get(
                    `/bookings/slots?date=${dateString}&sessionTypeId=${formData.sessionTypeId}`
                );
                setAvailableSlots(response.data);
            } catch (error: any) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.message as string || "Something went wrong!",

                });
                alert(error.response?.data?.message ?? "Failed to load slots.");
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [formData.date, formData.sessionTypeId]);

    const updateFormData = (field: keyof FormData, value: any) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const canProceed = () => {
        switch (step) {
            case 1: return !!(formData.name && formData.email && formData.whatsapp);
            case 2: return !!formData.sessionTypeId;
            case 3: return !!(formData.date && formData.timeSlot);
            default: return false;
        }
    };

    const handleSubmit = async () => {
        const { name, email, whatsapp, date, sessionTypeId, timeSlot } = formData;
        if (!name || !email || !whatsapp || !date || !sessionTypeId || !timeSlot) {
            alert("Please fill all the fields");
            return;
        }
        setSubmitting(true);
        try {
            // const res = await axiosInstance.post("/bookings/appointments", {
            //     name, email, whatsapp,
            //     date: format(date, "yyyy-MM-dd"),
            //     startTime: timeSlot.start,
            //     endTime: timeSlot.end,
            //     sessionTypeId,
            // });
            const res = await axiosInstance.post("/payment/create-order", {
                name, email, whatsapp,
                date: format(date, "yyyy-MM-dd"),
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                sessionTypeId,
            })
            console.log(res.data)
            // if (res.data.success) {
            //     alert(res.data.message);
            //     setFormData({ name: "", email: "", whatsapp: "", date: undefined, sessionTypeId: "", timeSlot: null });
            //     setStep(1);
            //     setSubmitting(false);
            //     return;
            // }
            if (res.data) {
                setForm(res.data);
                setStep(4);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response?.data.message as string || "Something went wrong!",
                });
            }
        }
        setSubmitting(false);
        // alert("Appointment booked successfully! We'll contact you shortly to confirm.");
    };

    /* ── Render ─────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-sky-50/40 flex items-start justify-center p-4 py-8 lg:py-12">

            {/* Subtle dot-pattern background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.18]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, #94a3b8 0.5px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="w-full max-w-5xl relative z-10">

                {/* ── Page header ──────────────────────────── */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 border border-teal-200 text-teal-700 text-xs font-semibold tracking-wide uppercase mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Inspired Living · Online Scheduling
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                        Book a Consultation
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Confidential, compassionate care — at your convenience
                    </p>
                </div>

                {/* ── 2-column layout ───────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">

                    {/* LEFT — Doctor profile only */}
                    <DoctorProfile />

                    {/* RIGHT — Multi-step form */}
                    <Card className="rounded-2xl border border-slate-200/80 shadow-sm bg-white">

                        {/* Form header */}
                        <CardHeader className="pb-3 pt-6 px-6 border-b border-slate-100">
                            <StepIndicator current={step} total={totalSteps} />
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                    Step {step} of {totalSteps}
                                </p>
                                <h2 className="text-base font-bold text-slate-800 mt-0.5">
                                    {STEP_LABELS[step - 1]}
                                </h2>
                            </div>
                            <Progress
                                value={progress}
                                className="mt-3 h-1 bg-slate-100 [&>div]:bg-teal-500 [&>div]:transition-all [&>div]:duration-500"
                            />
                        </CardHeader>

                        <CardContent className="px-6 py-5">

                            {/* ── STEP 1: Personal info ───────── */}
                            {step === 1 && (
                                <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm text-slate-500">
                                        We'll use these details to confirm and send reminders for your appointment.
                                    </p>
                                    <IconInput
                                        id="name" label="Full Name" placeholder="Jane Smith"
                                        value={formData.name} onChange={(v) => updateFormData("name", v)}
                                        icon={UserCircle2} required
                                    />
                                    <IconInput
                                        id="email" label="Email Address" type="email" placeholder="jane@example.com"
                                        value={formData.email} onChange={(v) => updateFormData("email", v)}
                                        icon={Mail} required
                                    />
                                    <IconInput
                                        id="whatsapp" label="WhatsApp Number" type="tel" placeholder="+91 98765 43210"
                                        value={formData.whatsapp} onChange={(v) => updateFormData("whatsapp", v)}
                                        icon={Phone} required
                                    />
                                    <div className="flex items-start gap-2 p-3 bg-sky-50 rounded-xl border border-sky-100">
                                        <Heart className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-sky-700 leading-relaxed">
                                            Your information is kept strictly confidential and used only to manage your appointment.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 2: Session type ─────────── */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm text-slate-500">
                                        Choose the type of session that best fits your needs.
                                    </p>
                                    <RadioGroup
                                        value={formData.sessionTypeId}
                                        onValueChange={(v) => updateFormData("sessionTypeId", v)}
                                        className="space-y-3"
                                        aria-label="Session type"
                                    >
                                        {sessionTypes.map((sessionType) => {
                                            const active = formData.sessionTypeId === sessionType.id;
                                            return (
                                                <Label
                                                    key={sessionType.id}
                                                    htmlFor={sessionType.id}
                                                    className={`
                                                        group block rounded-xl border p-4 cursor-pointer
                                                        transition-all duration-200
                                                        ${active
                                                            ? "border-teal-500 bg-teal-50/60 shadow-sm"
                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <RadioGroupItem
                                                            value={sessionType.id}
                                                            id={sessionType.id}
                                                            className="mt-0.5 border-slate-300 text-teal-600"
                                                        />
                                                        <div className={`
                                                            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                            transition-colors duration-200
                                                            ${active
                                                                ? "bg-teal-100 text-teal-600"
                                                                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                                            }
                                                        `}>
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`font-semibold text-sm ${active ? "text-teal-700" : "text-slate-800"}`}>
                                                                {sessionType.title}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-0.5">{sessionType.sub}</div>
                                                            <div className={`text-xs mt-1 font-bold ${active ? "text-teal-600" : "text-slate-500"}`}>
                                                                ₹{sessionType.fee}
                                                            </div>
                                                            <div className={`text-[11px] mt-1 ${active ? "text-teal-600" : "text-slate-400"}`}>
                                                                {sessionType.note}
                                                            </div>
                                                        </div>
                                                        {active && (
                                                            <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </Label>
                                            );
                                        })}
                                    </RadioGroup>
                                </div>
                            )}

                            {/* ── STEP 3: Date picker + Time slots ── */}
                            {step === 3 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                    {/* Date picker */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <CalendarIcon className="w-4 h-4 text-teal-600" />
                                            <span className="text-sm font-semibold text-slate-700">Pick a Date</span>
                                        </div>
                                        <div className="flex justify-center">
                                            <Calendar
                                                mode="single"
                                                selected={formData.date}
                                                onSelect={(d) => updateFormData("date", d)}
                                                disabled={(date) =>
                                                    date <= new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                className="rounded-xl border border-slate-200 shadow-sm p-3 w-full"
                                            />
                                        </div>
                                        {formData.date && (
                                            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg border border-teal-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                                <span className="text-xs font-semibold text-teal-700">
                                                    {format(formData.date, "EEEE, MMMM dd, yyyy")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Time slots (only shown once a date is chosen) */}
                                    {formData.date && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Clock className="w-4 h-4 text-teal-600" />
                                                <span className="text-sm font-semibold text-slate-700">Available Slots</span>
                                            </div>

                                            {loadingSlots ? (
                                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                                                    <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                                                    <span className="text-xs">Fetching available slots…</span>
                                                </div>
                                            ) : availableSlots.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-600">No slots available</p>
                                                    <p className="text-xs text-slate-400">Try selecting a different date</p>
                                                </div>
                                            ) : (
                                                <div
                                                    className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                                                    role="listbox"
                                                    aria-label="Available time slots"
                                                >
                                                    {availableSlots.map((slot, idx) => {
                                                        const selected = formData.timeSlot === slot;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                role="option"
                                                                aria-selected={selected}
                                                                aria-disabled={!slot.isAvailable}
                                                                tabIndex={slot.isAvailable ? 0 : -1}
                                                                disabled={!slot.isAvailable}
                                                                onClick={() => {
                                                                    if (slot.isAvailable) {
                                                                        updateFormData("timeSlot", slot);
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (slot.isAvailable && (e.key === "Enter" || e.key === " ")) {
                                                                        e.preventDefault();
                                                                        updateFormData("timeSlot", slot);
                                                                    }
                                                                }}
                                                                className={`
                                                                    h-[52px] rounded-lg text-xs font-semibold
                                                                    border transition-all duration-150
                                                                    flex flex-col items-center justify-center gap-0.5
                                                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
                                                                    ${!slot.isAvailable
                                                                        ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60 decoration-slate-400/50"
                                                                        : selected
                                                                            ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200 scale-[1.04]"
                                                                            : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/60"
                                                                    }
                                                                `}
                                                            >
                                                                <span className={!slot.isAvailable ? "line-through" : ""}>{formatTime(slot.start)}</span>
                                                                <span className={`text-[10px] font-normal ${!slot.isAvailable ? "line-through" : selected ? "text-teal-100" : "text-slate-400"}`}>
                                                                    – {formatTime(slot.end)}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Summary (shown once date + slot chosen) */}
                                    {formData.date && formData.timeSlot && (
                                        <div className="rounded-xl border border-teal-200 bg-teal-50/60 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2.5 bg-teal-600/10 border-b border-teal-200">
                                                <Check className="w-3.5 h-3.5 text-teal-600" />
                                                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                                                    Appointment Summary
                                                </h4>
                                            </div>
                                            <dl className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                                {[
                                                    { label: "Patient", value: formData.name },
                                                    {
                                                        label: "Session",
                                                        value: sessionTypes.find(st => st.id === formData.sessionTypeId)?.name
                                                    },
                                                    {
                                                        label: "Fee",
                                                        value: `₹${sessionTypes.find(st => st.id === formData.sessionTypeId)?.fee}`
                                                    },
                                                    {
                                                        label: "Date",
                                                        value: format(formData.date, "dd MMM yyyy"),
                                                    },
                                                    {
                                                        label: "Time",
                                                        value: `${formatTime(formData.timeSlot.start)} – ${formatTime(formData.timeSlot.end)}`,
                                                    },
                                                ].map(({ label, value }) => (
                                                    <div key={label}>
                                                        <dt className="text-slate-400 font-medium">{label}</dt>
                                                        <dd className="font-semibold text-slate-800 mt-0.5">{value}</dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                    )}
                                </div>
                            )}

                            {
                                step === 4 && (
                                    <div className=" container mx-auto px-6 max-w-xl">
                                        <div dangerouslySetInnerHTML={{ __html: form }}>

                                        </div>
                                    </div>
                                )
                            }
                        </CardContent>

                        {/* ── Footer navigation ─────────────── */}
                        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                            <Button
                                variant="ghost"
                                onClick={() => step > 1 && setStep((s) => s - 1)}
                                disabled={step === 1}
                                aria-label="Go back"
                                className="gap-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 h-9 px-3 text-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>

                            {step < totalSteps ? (
                                <Button
                                    onClick={() => setStep((s) => s + 1)}
                                    disabled={!canProceed()}
                                    className="
                                        gap-2 bg-teal-600 hover:bg-teal-700 text-white
                                        rounded-lg px-6 h-9 text-sm font-semibold
                                        shadow shadow-teal-200 hover:shadow-teal-300
                                        disabled:opacity-50 disabled:shadow-none
                                        transition-all duration-150
                                    "
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || submitting}
                                    aria-label="Confirm appointment"
                                    className="
                                        gap-2 bg-emerald-600 hover:bg-emerald-700 text-white
                                        rounded-lg px-6 h-9 text-sm font-semibold
                                        shadow shadow-emerald-200 hover:shadow-emerald-300
                                        disabled:opacity-50 disabled:shadow-none
                                        transition-all duration-150
                                    "
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Booking…
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Confirm Booking
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Booking;