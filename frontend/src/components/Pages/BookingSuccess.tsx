import { useEffect, useState } from "react"
import { Mail, MessageCircle, ArrowRight, Heart, Check, Calendar, Clock, Shield } from "lucide-react"

const BookingSuccess = () => {
    const [particles, setParticles] = useState<any[]>([])

    useEffect(() => {
        const p = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 1.8,
            dur: 1.6 + Math.random() * 1.4,
            color: ["#0d9488", "#10b981", "#34d399", "#6ee7b7", "#38bdf8", "#bae6fd", "#a7f3d0", "#ecfccb", "#fbbf24"][i % 9],
            w: 5 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            rot: Math.random() * 360,
        }))
        setParticles(p)
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10"
            style={{ background: "linear-gradient(160deg, #f0fdfa 0%, #ecfdf5 40%, #f0f9ff 70%, #fafffe 100%)" }}>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Nunito', sans-serif; }

        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg) scaleX(1); opacity:1; }
          100% { transform: translateY(110vh) rotate(720deg) scaleX(0.5); opacity:0; }
        }
        .particle { position:fixed; top:0; pointer-events:none; z-index:0; animation: fall linear forwards; }

        @keyframes bgPulse {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50%     { transform: scale(1.05); opacity: 0.7; }
        }
        .bg-orb { animation: bgPulse 6s ease-in-out infinite; }

        @keyframes circleDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes popBounce {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          80%  { transform: scale(0.96); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes ripple {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }

        .check-wrap { animation: popBounce 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
        .circle-stroke {
          stroke-dasharray: 280; stroke-dashoffset: 280;
          animation: circleDraw 0.7s cubic-bezier(0.4,0,0.2,1) 0.6s forwards;
        }
        .check-stroke {
          stroke-dasharray: 60; stroke-dashoffset: 60;
          animation: checkDraw 0.4s cubic-bezier(0.4,0,0.2,1) 1.2s forwards;
        }

        .ripple-1 { animation: ripple 2.5s ease-out 1.3s infinite; }
        .ripple-2 { animation: ripple 2.5s ease-out 1.8s infinite; }

        .card-float { animation: float 4s ease-in-out 2s infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #0f766e 0%, #0d9488 30%, #34d399 50%, #0d9488 70%, #0f766e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear 1.5s infinite;
        }

        .su1 { animation: slideUp 0.55s ease-out 0.3s both; opacity:0; }
        .su2 { animation: slideUp 0.55s ease-out 0.5s both; opacity:0; }
        .su3 { animation: slideUp 0.55s ease-out 0.7s both; opacity:0; }
        .su4 { animation: slideUp 0.55s ease-out 0.9s both; opacity:0; }
        .su5 { animation: slideUp 0.55s ease-out 1.1s both; opacity:0; }
        .su6 { animation: slideUp 0.55s ease-out 1.3s both; opacity:0; }
        .su7 { animation: slideUp 0.55s ease-out 1.5s both; opacity:0; }

        .notif-card {
          transition: all 0.2s ease;
          cursor: default;
        }
        .notif-card:hover {
          transform: translateX(5px);
          box-shadow: -4px 0 0 #0d9488, 0 4px 20px rgba(13,148,136,0.12);
        }

        .cta-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(5,150,105,0.4); }
        .cta-btn:hover::before { opacity: 1; }
        .cta-btn:active { transform: translateY(0); }

        .dot-grid {
          background-image: radial-gradient(circle at 1px 1px, #94a3b8 0.5px, transparent 0);
          background-size: 28px 28px;
        }
      `}</style>

            {/* Particles */}
            {particles.map(p => (
                <div key={p.id} className="particle" style={{
                    left: `${p.left}%`, width: p.w, height: p.h,
                    background: p.color, borderRadius: p.id % 4 === 0 ? "50%" : "2px",
                    animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
                    transform: `rotate(${p.rot}deg)`
                }} />
            ))}

            {/* Dot grid */}
            <div className="dot-grid fixed inset-0 pointer-events-none opacity-[0.15]" />

            {/* Ambient orbs */}
            <div className="fixed pointer-events-none inset-0">
                <div className="bg-orb absolute" style={{ top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(153,246,228,0.4) 0%, transparent 65%)" }} />
                <div className="bg-orb absolute" style={{ bottom: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(186,230,253,0.35) 0%, transparent 65%)", animationDelay: "3s" }} />
                <div className="bg-orb absolute" style={{ top: "40%", left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(209,250,229,0.25) 0%, transparent 65%)", animationDelay: "1.5s" }} />
            </div>

            <div className="relative z-10 w-full max-w-lg">

                {/* Top badge */}
                <div className="su1 flex justify-center mb-5">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                        style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)", color: "#0f766e" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Inspired Living
                        <span className="w-px h-3 bg-teal-300" />
                        Booking Confirmed
                    </div>
                </div>

                {/* Main card */}
                <div className="su2 card-float rounded-3xl overflow-hidden"
                    style={{ background: "#ffffff", border: "1px solid rgba(13,148,136,0.12)", boxShadow: "0 0 0 1px rgba(13,148,136,0.06), 0 20px 60px rgba(13,148,136,0.12), 0 4px 16px rgba(0,0,0,0.04)" }}>

                    {/* Header — rich teal gradient with wave */}
                    <div className="relative px-8 pt-10 pb-16 text-center overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)" }}>

                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.07]"
                            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />

                        {/* Decorative circles */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)" }} />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)" }} />

                        {/* Ripple rings + Check icon */}
                        <div className="relative flex justify-center mb-5">
                            <div className="relative">
                                {/* Ripple rings */}
                                <div className="ripple-1 absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.15)", margin: "-20px" }} />
                                <div className="ripple-2 absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.1)", margin: "-20px" }} />

                                {/* SVG check */}
                                <div className="check-wrap">
                                    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                                        <circle cx="44" cy="44" r="44" fill="rgba(255,255,255,0.08)" />
                                        <circle cx="44" cy="44" r="36" fill="rgba(255,255,255,0.1)" />
                                        <circle cx="44" cy="44" r="27" fill="rgba(255,255,255,0.15)" />
                                        <circle className="circle-stroke" cx="44" cy="44" r="42"
                                            stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round"
                                            transform="rotate(-90 44 44)" />
                                        <polyline className="check-stroke"
                                            points="28,44 39,55 62,30"
                                            stroke="white" strokeWidth="4" fill="none"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1.5">
                            Booking Successful!
                        </h1>
                        <p className="text-sm text-teal-100 font-medium leading-relaxed">
                            Your session has been confirmed.<br />
                            Confidential, compassionate care — at your convenience.
                        </p>

                        {/* Wave bottom */}
                        <div className="absolute bottom-0 left-0 right-0">
                            <svg viewBox="0 0 400 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: 32, display: "block" }}>
                                <path d="M0,32 C100,0 300,32 400,8 L400,32 Z" fill="white" />
                            </svg>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 sm:px-8 pt-2 pb-6">

                        {/* Notification cards */}
                        <div className="su3 space-y-3 mb-5">

                            {/* Email */}
                            <div className="notif-card flex items-center gap-4 p-4 rounded-2xl"
                                style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", border: "1px solid #bae6fd" }}>
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", boxShadow: "0 4px 12px rgba(14,165,233,0.35)" }}>
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800">Check your Email</p>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Confirmation &amp; calendar invite sent to your inbox</p>
                                </div>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: "#0ea5e9" }}>
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="notif-card flex items-center gap-4 p-4 rounded-2xl"
                                style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)", border: "1px solid #99f6e4" }}>
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 4px 12px rgba(13,148,136,0.35)" }}>
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800">Check your WhatsApp</p>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Reminder &amp; session link sent to your number</p>
                                </div>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: "#0d9488" }}>
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* 3 status chips */}
                        <div className="su4 grid grid-cols-3 gap-2 mb-5">
                            {[
                                { icon: Calendar, label: "Session", val: "Confirmed", color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" },
                                { icon: Clock, label: "Reminder", val: "Sent", color: "#0891b2", bg: "#f0f9ff", border: "#bae6fd" },
                                { icon: Shield, label: "Payment", val: "Received", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
                            ].map(({ icon: Icon, label, val, color, bg, border }) => (
                                <div key={label} className="flex flex-col items-center gap-1 py-3 rounded-2xl"
                                    style={{ background: bg, border: `1px solid ${border}` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                    <span className="text-[10px] font-black uppercase tracking-wide" style={{ color }}>{label}</span>
                                    <span className="text-[11px] font-bold text-slate-600">{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Shimmer headline */}
                        <div className="su5 text-center mb-5">
                            <p className="text-sm font-black shimmer-text">
                                "A step toward wellbeing is always worth taking."
                            </p>
                        </div>

                        {/* Privacy note */}
                        <div className="su6 flex items-start gap-2.5 p-3.5 rounded-xl mb-5"
                            style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                            <Heart className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-sky-700 font-medium leading-relaxed">
                                Your information is kept strictly confidential and used only to manage your appointment.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="su7">
                            <button
                                onClick={() => window.location.href = "/"}
                                className="cta-btn w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-black text-white"
                                style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)", boxShadow: "0 6px 20px rgba(5,150,105,0.3)" }}>
                                <Check className="w-4 h-4" />
                                Back to Home
                                <ArrowRight className="w-4 h-4 ml-auto" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Below card */}
                <div className="su7 flex items-center justify-center gap-2 mt-4">
                    <span className="text-xs text-slate-400 font-semibold">Need to reschedule?</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-xs font-bold" style={{ color: "#0d9488" }}>Contact us anytime</span>
                </div>
            </div>
        </div>
    )
}

export default BookingSuccess