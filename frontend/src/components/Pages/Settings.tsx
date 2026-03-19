import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

import axiosInstance from "@/helper/axiosInstance"
import {
    User,
    Mail,
    // Phone,
    DollarSign,
    Clock,
    CalendarDays,
    Lock,
    Shield,
    Save,
    CheckCircle2,
    AlertCircle,
    Settings,
    Loader2,
    Eye,
    EyeOff,
    CalendarClock,
    RefreshCw,
    Info,
} from "lucide-react"
import { ConnectToGoogleCalendar } from "@/helper/helper"

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
type DoctorProfile = {
    name: string
    email: string
    fee: number | ""
    minAdvanceMinutes: number | ""
    maxAdvanceDays: number | ""
}

type PasswordForm = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

type SaveState = "idle" | "saving" | "success" | "error"

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
const minutesToHours = (min: number) => {
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m ? `${h}h ${m}m` : `${h}h`
}

/* ─────────────────────────────────────────────────────────────────
   Reusable field wrapper
───────────────────────────────────────────────────────────────── */
function FieldRow({
    label, hint, icon: Icon, children,
}: {
    label: string; hint?: string; icon: React.ElementType; children: React.ReactNode
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 items-start py-4">
            <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        {label}
                    </Label>
                </div>
                {hint && <p className="text-[11px] text-slate-400 leading-relaxed">{hint}</p>}
            </div>
            <div>{children}</div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────
   Styled Input
───────────────────────────────────────────────────────────────── */
function StyledInput({
    id, type = "text", placeholder, value, onChange, prefix, suffix, disabled,
}: {
    id: string; type?: string; placeholder?: string; value: any;
    onChange: (v: any) => void; prefix?: React.ReactNode;
    suffix?: React.ReactNode; disabled?: boolean;
}) {
    return (
        <div className="relative flex items-center">
            {prefix && (
                <div className="pointer-events-none absolute left-3 text-slate-400 flex items-center">
                    {prefix}
                </div>
            )}
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(type === "number" ? Number(e.target.value) || "" : e.target.value)}
                disabled={disabled}
                className={`
                    h-10 text-sm rounded-lg border-slate-200 bg-white
                    focus-visible:ring-2 focus-visible:ring-teal-500/30
                    focus-visible:border-teal-500 transition-all
                    ${prefix ? "pl-9" : ""}
                    ${suffix ? "pr-10" : ""}
                    ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}
                `}
            />
            {suffix && (
                <div className="absolute right-3 text-slate-400 flex items-center">
                    {suffix}
                </div>
            )}
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────
   Save feedback banner
───────────────────────────────────────────────────────────────── */
function SaveFeedback({ state, message }: { state: SaveState; message?: string }) {
    if (state === "idle") return null
    return (
        <div className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            animate-in fade-in slide-in-from-top-1 duration-200
            ${state === "saving" ? "bg-slate-50 border border-slate-200 text-slate-600" : ""}
            ${state === "success" ? "bg-teal-50 border border-teal-200 text-teal-700" : ""}
            ${state === "error" ? "bg-rose-50 border border-rose-200 text-rose-700" : ""}
        `}>
            {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
            {state === "success" && <CheckCircle2 className="w-4 h-4" />}
            {state === "error" && <AlertCircle className="w-4 h-4" />}
            <span>
                {state === "saving" && "Saving changes…"}
                {state === "success" && (message ?? "Changes saved successfully.")}
                {state === "error" && (message ?? "Something went wrong. Please try again.")}
            </span>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────
   Section card wrapper
───────────────────────────────────────────────────────────────── */
function Section({
    title, description, icon: Icon, accent = "teal", children,
}: {
    title: string; description: string; icon: React.ElementType;
    accent?: "teal" | "violet" | "rose" | "sky"; children: React.ReactNode
}) {
    const accentMap = {
        teal: { band: "from-teal-500 to-teal-600", badge: "bg-teal-50 text-teal-700 border-teal-100" },
        violet: { band: "from-violet-500 to-violet-600", badge: "bg-violet-50 text-violet-700 border-violet-100" },
        rose: { band: "from-rose-500 to-rose-600", badge: "bg-rose-50 text-rose-700 border-rose-100" },
        sky: { band: "from-sky-500 to-sky-600", badge: "bg-sky-50 text-sky-700 border-sky-100" },
    }
    const colors = accentMap[accent]
    return (
        <Card className="rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Section header */}
            <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors.band} flex items-center justify-center shadow-sm shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-bold text-slate-800">{title}</CardTitle>
                        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 py-0 divide-y divide-slate-100">
                {children}
            </CardContent>
        </Card>
    )
}

/* ─────────────────────────────────────────────────────────────────
   Main Settings Page
───────────────────────────────────────────────────────────────── */
const DoctorSettings = () => {
    /* ── Profile state ──────────────────────────── */
    const [profile, setProfile] = useState<DoctorProfile>({
        name: "", email: "", fee: "",
        minAdvanceMinutes: "", maxAdvanceDays: "",
    })
    const [profileSave, setProfileSave] = useState<SaveState>("idle")
    const [profileMsg, setProfileMsg] = useState("")

    /* ── Password state ─────────────────────────── */
    const [passwords, setPasswords] = useState<PasswordForm>({ currentPassword: "", newPassword: "", confirmPassword: "" })
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
    const [passwordSave, setPasswordSave] = useState<SaveState>("idle")
    const [passwordMsg, setPasswordMsg] = useState("")

    // advance settings
    const [advanceSettingSave,setAdvanceSettingSave] = useState<SaveState>("idle")
    const [advanceSettingMsg,setAdvanceSettingMsg] = useState("")

    /* ── Google Calendar state ──────────────────── */
    const [googleConnected, setGoogleConnected] = useState(false)
    const [googleSave, setGoogleSave] = useState<SaveState>("idle")

    /* ── Load profile ✅ ───────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosInstance.get("/doctor/me")
                const d = res.data.doctor
                console.log(d)
                setProfile({
                    name: d.name ?? "",
                    email: d.email ?? "",
                    fee: d.fee ?? "",
                    minAdvanceMinutes: d.minAdvanceMinutes ?? "",
                    maxAdvanceDays: d.maxAdvanceDays ?? "",
                })
                setGoogleConnected(!!(d.accessToken))
            } catch (e) {
                console.error(e)
            }
        }
        load()
    }, [])

    /* ── Save profile ✅ ───────────────────────────── */
    const handleSaveProfile = async () => {
        setProfileSave("saving")
        setProfileMsg("")
        try {
            await axiosInstance.patch("/doctor/update", profile)
            setProfileSave("success")
            setProfileMsg("Profile updated successfully.")
        } catch (error: any) {
            setProfileSave("error")
            setProfileMsg(error.response?.data?.message ?? "Failed to update profile.")
        } finally {
            setTimeout(() => setProfileSave("idle"), 3500)
        }
    }

    /* ── Save password ✅──────────────────────────── */
    const handleSavePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordSave("error")
            setPasswordMsg("New passwords do not match.")
            setTimeout(() => setPasswordSave("idle"), 3500)
            return
        }
        if (passwords.newPassword.length < 8) {
            setPasswordSave("error")
            setPasswordMsg("Password must be at least 8 characters.")
            setTimeout(() => setPasswordSave("idle"), 3500)
            return
        }
        setPasswordSave("saving")
        try {
            await axiosInstance.patch("/doctor/updatePassword", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            })
            setPasswordSave("success")
            setPasswordMsg("Password changed successfully.")
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error: any) {
            setPasswordSave("error")
            setPasswordMsg(error.response?.data?.message ?? "Failed to change password.")
        } finally {
            setTimeout(() => setPasswordSave("idle"), 3500)
        }
    }

    /* ── Connect / disconnect Google ✅ ────────────── */
    const handleGoogleConnect = async () => {
        setGoogleSave("saving")
        try {
            // const res = await axiosInstance.get("/doctor/google/auth-url")
            // window.location.href = res.data.url
            ConnectToGoogleCalendar()
        } catch {
            setGoogleSave("error")
            setTimeout(() => setGoogleSave("idle"), 3000)
        }
    }

    const handleGoogleDisconnect = async () => {
        setGoogleSave("saving")
        try {
            await axiosInstance.post("/doctor/google/disconnect")
            setGoogleConnected(false)
            setGoogleSave("idle")
        } catch {
            setGoogleSave("error")
            setTimeout(() => setGoogleSave("idle"), 3000)
        }
    }

    const SaveAdvanceSettings = async() =>{
        setAdvanceSettingSave("saving")
        try{
             await axiosInstance.patch("/doctor/updateAdvanceSettings", profile)
            setAdvanceSettingSave("success")
            setAdvanceSettingMsg("Advance settings updated successfully.")
        }catch(error: any){
            console.log(error)
        }
        finally{
            setTimeout(() => setAdvanceSettingSave("idle"), 3500)
        }
    }

    /* ── Password strength ──────────────────────── */
    const pwStrength = (pw: string) => {
        if (!pw) return null
        if (pw.length < 6) return { label: "Weak", color: "bg-rose-400", w: "w-1/4" }
        if (pw.length < 8) return { label: "Fair", color: "bg-amber-400", w: "w-2/4" }
        if (pw.length < 12) return { label: "Good", color: "bg-teal-400", w: "w-3/4" }
        return { label: "Strong", color: "bg-emerald-500", w: "w-full" }
    }
    const strength = pwStrength(passwords.newPassword)

    /* ── Booking window preview ─────────────────── */
    const minAdv = Number(profile.minAdvanceMinutes) || 0
    const maxAdv = Number(profile.maxAdvanceDays) || 0

    const profileValid = !!(profile.name && profile.email && profile.fee)
    const passwordValid = !!(passwords.currentPassword && passwords.newPassword && passwords.confirmPassword)

    /* ── Render ─────────────────────────────────── */
    return (
        <div className="min-h-screen  to-sky-50/30 p-5 lg:p-8">

            {/* ── Page header ──────────────────────────── */}
            <div className="flex items-start gap-4 mb-7 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-200 shrink-0">
                    <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight">Account Settings</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage your profile, booking preferences, security, and integrations.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">

                {/* ══ SECTION 1 — Profile ════════════════ */}
                <Section
                    title="Personal Information"
                    description="Update your public profile details."
                    icon={User}
                    accent="teal"
                >
                    <FieldRow label="Full Name" icon={User} hint="Shown to patients on the booking page.">
                        <StyledInput
                            id="name" placeholder="Dr. Meera Iyer"
                            value={profile.name}
                            onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
                            prefix={<User className="w-3.5 h-3.5" />}
                        />
                    </FieldRow>

                    <FieldRow label="Email Address" icon={Mail} hint="Used for login and notifications.">
                        <StyledInput
                            id="email" type="email" placeholder="doctor@example.com"
                            value={profile.email}
                            onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                            prefix={<Mail className="w-3.5 h-3.5" />}
                        />
                    </FieldRow>

                    <FieldRow label="Consultation Fee" icon={DollarSign} hint="Amount patients pay per session (₹).">
                        <StyledInput
                            id="fee" type="number" placeholder="1500"
                            value={profile.fee}
                            onChange={(v) => setProfile((p) => ({ ...p, fee: v }))}
                            prefix={<span className="text-xs font-bold">₹</span>}
                        />
                    </FieldRow>

                    {/* Save row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
                        <SaveFeedback state={profileSave} message={profileMsg} />
                        <div className="sm:ml-auto">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={!profileValid || profileSave === "saving"}
                                className="
                                    gap-2 bg-teal-600 hover:bg-teal-700 text-white
                                    rounded-lg px-5 h-9 text-sm font-semibold
                                    shadow shadow-teal-200 disabled:opacity-50
                                    transition-all duration-150
                                "
                            >
                                {profileSave === "saving"
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                                    : <><Save className="w-4 h-4" /> Save Profile</>
                                }
                            </Button>
                        </div>
                    </div>
                </Section>

                {/* ══ SECTION 2 — Booking Rules ══════════ */}
                <Section
                    title="Booking Window"
                    description="Control how far in advance patients can book appointments."
                    icon={CalendarClock}
                    accent="sky"
                >
                    <FieldRow
                        label="Min. Advance Notice"
                        icon={Clock}
                        hint="Minimum time before a slot that a booking can be made."
                    >
                        <div className="space-y-2">
                            <StyledInput
                                id="minAdv" type="number" placeholder="120"
                                value={profile.minAdvanceMinutes}
                                onChange={(v) => setProfile((p) => ({ ...p, minAdvanceMinutes: v }))}
                                suffix={<span className="text-[11px] font-medium">min</span>}
                            />
                            {minAdv > 0 && (
                                <div className="flex items-center gap-1.5 text-[11px] text-sky-600">
                                    <Info className="w-3 h-3" />
                                    Patients must book at least <strong>{minutesToHours(minAdv)}</strong> in advance
                                </div>
                            )}
                        </div>
                    </FieldRow>

                    <FieldRow
                        label="Max. Advance Days"
                        icon={CalendarDays}
                        hint="How many days ahead a patient can schedule."
                    >
                        <div className="space-y-2">
                            <StyledInput
                                id="maxDays" type="number" placeholder="7"
                                value={profile.maxAdvanceDays}
                                onChange={(v) => setProfile((p) => ({ ...p, maxAdvanceDays: v }))}
                                suffix={<span className="text-[11px] font-medium">days</span>}
                            />
                            {maxAdv > 0 && (
                                <div className="flex items-center gap-1.5 text-[11px] text-sky-600">
                                    <Info className="w-3 h-3" />
                                    Patients can book up to <strong>{maxAdv} day{maxAdv > 1 ? "s" : ""}</strong> from today
                                </div>
                            )}
                        </div>
                    </FieldRow>

                    {/* Preview chip */}
                    {minAdv > 0 && maxAdv > 0 && (
                        <div className="py-4">
                            <div className="flex items-start gap-2 p-3 bg-sky-50 rounded-xl border border-sky-100">
                                <CalendarDays className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-sky-700 leading-relaxed">
                                    Patients can book appointments between{" "}
                                    <strong>{minutesToHours(minAdv)} from now</strong> and up to{" "}
                                    <strong>{maxAdv} days ahead</strong>.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
                        <SaveFeedback state={advanceSettingSave} message={advanceSettingMsg} />
                        <div className="sm:ml-auto">
                            <Button
                                onClick={SaveAdvanceSettings}
                                disabled={profileSave === "saving"}
                                className="
                                gap-2 bg-sky-600 hover:bg-sky-700 text-white
                                rounded-lg px-5 h-9 text-sm font-semibold
                                shadow shadow-sky-200 disabled:opacity-50
                                transition-all duration-150
                            "
                            >

                                {advanceSettingSave === "saving"
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                                    : <><Save className="w-4 h-4" />
                                        Save Preferences</>
                                }
                            </Button>
                        </div>
                        
                    </div>
                </Section>

                {/* ══ SECTION 3 — Password ═══════════════ */}
                <Section
                    title="Security & Password"
                    description="Change your login password to keep your account secure."
                    icon={Lock}
                    accent="violet"
                >
                    <FieldRow label="Current Password" icon={Lock}>
                        <div className="relative">
                            <Input
                                id="current-pw"
                                type={showPasswords.current ? "text" : "password"}
                                placeholder="Enter current password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                                className="h-10 text-sm rounded-lg border-slate-200 pr-10 focus-visible:ring-2 focus-visible:ring-violet-400/30 focus-visible:border-violet-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords((s) => ({ ...s, current: !s.current }))}
                                className="absolute right-3 inset-y-0 text-slate-400 hover:text-slate-600 flex items-center"
                                aria-label="Toggle visibility"
                            >
                                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </FieldRow>

                    <FieldRow label="New Password" icon={Shield} hint="Minimum 8 characters.">
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="new-pw"
                                    type={showPasswords.new ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                                    className="h-10 text-sm rounded-lg border-slate-200 pr-10 focus-visible:ring-2 focus-visible:ring-violet-400/30 focus-visible:border-violet-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}
                                    className="absolute right-3 inset-y-0 text-slate-400 hover:text-slate-600 flex items-center"
                                >
                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {strength && (
                                <div className="space-y-1">
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                                    </div>
                                    <p className={`text-[11px] font-medium ${strength.label === "Weak" ? "text-rose-500" :
                                        strength.label === "Fair" ? "text-amber-500" :
                                            strength.label === "Good" ? "text-teal-600" : "text-emerald-600"
                                        }`}>
                                        {strength.label} password
                                    </p>
                                </div>
                            )}
                        </div>
                    </FieldRow>

                    <FieldRow label="Confirm Password" icon={Shield}>
                        <div className="space-y-1">
                            <div className="relative">
                                <Input
                                    id="confirm-pw"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    placeholder="Re-enter new password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                                    className={`h-10 text-sm rounded-lg border-slate-200 pr-10 focus-visible:ring-2 focus-visible:ring-violet-400/30 focus-visible:border-violet-400
                                        ${passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword
                                            ? "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-400/30"
                                            : passwords.confirmPassword && passwords.confirmPassword === passwords.newPassword
                                                ? "border-teal-300" : ""
                                        }
                                    `}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))}
                                    className="absolute right-3 inset-y-0 text-slate-400 hover:text-slate-600 flex items-center"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword && (
                                <p className="text-[11px] text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Passwords do not match
                                </p>
                            )}
                            {passwords.confirmPassword && passwords.confirmPassword === passwords.newPassword && (
                                <p className="text-[11px] text-teal-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                                </p>
                            )}
                        </div>
                    </FieldRow>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
                        <SaveFeedback state={passwordSave} message={passwordMsg} />
                        <div className="sm:ml-auto">
                            <Button
                                onClick={handleSavePassword}
                                disabled={!passwordValid || passwordSave === "saving"}
                                className="
                                    gap-2 bg-violet-600 hover:bg-violet-700 text-white
                                    rounded-lg px-5 h-9 text-sm font-semibold
                                    shadow shadow-violet-200 disabled:opacity-50
                                    transition-all duration-150
                                "
                            >
                                {passwordSave === "saving"
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                                    : <><Lock className="w-4 h-4" /> Update Password</>
                                }
                            </Button>
                        </div>
                    </div>
                </Section>

                {/* ══ SECTION 4 — Google Calendar ════════ */}
                <Section
                    title="Google Calendar Integration"
                    description="Sync appointments automatically with your Google Calendar and generate Meet links."
                    icon={CalendarDays}
                    accent="rose"
                >
                    <div className="py-5 space-y-4">
                        {/* Status indicator */}
                        <div className={`
                            flex items-center justify-between p-4 rounded-xl border
                            ${googleConnected
                                ? "bg-teal-50 border-teal-200"
                                : "bg-slate-50 border-slate-200"
                            }
                        `}>
                            <div className="flex items-center gap-3">
                                {/* Google icon */}
                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-800">Google Calendar</div>
                                    <div className={`text-xs font-medium flex items-center gap-1 mt-0.5 ${googleConnected ? "text-teal-600" : "text-slate-400"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${googleConnected ? "bg-teal-500" : "bg-slate-300"}`} />
                                        {googleConnected ? "Connected" : "Not connected"}
                                    </div>
                                </div>
                            </div>

                            {googleConnected ? (
                                <Button
                                    variant="outline"
                                    onClick={handleGoogleDisconnect}
                                    disabled={googleSave === "saving"}
                                    className="gap-2 h-9 px-4 text-xs font-semibold border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 rounded-lg"
                                >
                                    {googleSave === "saving"
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <RefreshCw className="w-3.5 h-3.5" />
                                    }
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleGoogleConnect}
                                    disabled={googleSave === "saving"}
                                    className="gap-2 h-9 px-4 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-sm"
                                >
                                    {googleSave === "saving"
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <span className="text-base leading-none">+</span>
                                    }
                                    Connect
                                </Button>
                            )}
                        </div>

                        {/* Feature list */}
                        <div className="space-y-2">
                            {[
                                "New appointments automatically added to your Google Calendar",
                                "Google Meet links generated and sent to patients",
                                "Cancellations synced in real time",
                            ].map((text) => (
                                <div key={text} className="flex items-start gap-2">
                                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${googleConnected ? "text-teal-500" : "text-slate-300"}`} />
                                    <span className={`text-xs ${googleConnected ? "text-slate-600" : "text-slate-400"}`}>{text}</span>
                                </div>
                            ))}
                        </div>

                        {!googleConnected && (
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-700 leading-relaxed">
                                    Connect your Google account to enable calendar sync and automatic Meet link generation for appointments.
                                </p>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Bottom spacer */}
                <div className="h-4" />
            </div>
        </div>
    )
}

export default DoctorSettings