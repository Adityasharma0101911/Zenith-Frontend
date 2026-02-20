// comprehensive onboarding survey with 5 steps — gsap powered
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
    User, Wallet, GraduationCap, HeartPulse, Brain,
    ChevronRight, ChevronLeft, Rocket, ShieldCheck, Scale, Zap,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import toast from "react-hot-toast";
import PageTransition from "@/components/PageTransition";
import FloatingParticles from "@/components/FloatingParticles";

const TOTAL_STEPS = 5;
const STEP_META = [
    { icon: User, title: "About You", sub: "Let us know who you are" },
    { icon: Wallet, title: "Finances", sub: "Your financial picture" },
    { icon: GraduationCap, title: "Academics", sub: "Your learning profile" },
    { icon: HeartPulse, title: "Health", sub: "Your physical wellness" },
    { icon: Brain, title: "Wellness", sub: "Your mental state" },
];

function OptionCard({ label, description, selected, onClick, icon: Icon, color }: {
    label: string; description?: string; selected: boolean; onClick: () => void; icon?: React.ElementType; color?: string;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.02, y: -2, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.97, duration: 0.1 });
        const up = () => gsap.to(el, { scale: 1.02, duration: 0.15 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        el.addEventListener("mousedown", down); el.addEventListener("mouseup", up);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); el.removeEventListener("mouseup", up); };
    }, []);
    return (
        <button ref={ref} type="button" onClick={onClick}
            className={`w-full text-left px-4 py-3 rounded-m3-lg border-2 transition-colors ${selected ? `${color || "bg-m3-primary-container"} border-m3-primary` : "bg-m3-surface-container border-transparent hover:bg-m3-surface-container-high"}`}>
            <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className={selected ? "text-m3-primary" : "text-m3-on-surface-variant"} />}
                <div className="flex-1">
                    <p className={`text-m3-label-large ${selected ? "text-m3-on-primary-container" : "text-m3-on-surface"}`}>{label}</p>
                    {description && <p className={`text-m3-body-small mt-0.5 ${selected ? "text-m3-on-primary-container/70" : "text-m3-on-surface-variant"}`}>{description}</p>}
                </div>
            </div>
        </button>
    );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void; }) {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.05, duration: 0.15, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.15, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.95, duration: 0.1 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); };
    }, []);
    return (
        <button ref={ref} type="button" onClick={onClick}
            className={`px-3 py-1.5 rounded-m3-full text-m3-label-medium border transition-colors ${selected ? "bg-m3-primary text-m3-on-primary border-m3-primary" : "bg-m3-surface-container text-m3-on-surface-variant border-m3-outline-variant hover:bg-m3-surface-container-high"}`}>
            {label}
        </button>
    );
}

export default function SurveyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [launching, setLaunching] = useState(false);

    const [name, setName] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [occupation, setOccupation] = useState("");
    const [incomeRange, setIncomeRange] = useState("");
    const [spendingProfile, setSpendingProfile] = useState("");
    const [savings, setSavings] = useState("");
    const [financialGoals, setFinancialGoals] = useState<string[]>([]);
    const [balance, setBalance] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [learningStyle, setLearningStyle] = useState("");
    const [studyGoals, setStudyGoals] = useState<string[]>([]);
    const [exerciseFrequency, setExerciseFrequency] = useState("");
    const [sleepQuality, setSleepQuality] = useState("");
    const [dietQuality, setDietQuality] = useState("");
    const [healthGoals, setHealthGoals] = useState<string[]>([]);
    const [stressLevel, setStressLevel] = useState(5);
    const [biggestStressor, setBiggestStressor] = useState("");
    const [wellnessPriorities, setWellnessPriorities] = useState<string[]>([]);

    const dotsRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const stepRef = useRef<HTMLDivElement>(null);
    const rocketRef = useRef<HTMLSpanElement>(null);
    const backBtnRef = useRef<HTMLButtonElement>(null);
    const nextBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => { if (!localStorage.getItem("token")) router.push("/login"); }, [router]);

    function toggleMulti(arr: string[], setter: (v: string[]) => void, val: string) {
        setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    }

    // card entrance
    useEffect(() => {
        if (cardRef.current) gsap.from(cardRef.current, { opacity: 0, y: 24, scale: 0.96, duration: 0.5, ease: "power3.out" });
    }, []);

    // dots animation
    useEffect(() => {
        if (!dotsRef.current) return;
        dotsRef.current.querySelectorAll(".dot").forEach((dot, i) => {
            gsap.to(dot, { width: step === (i + 1) ? 28 : 10, backgroundColor: step >= (i + 1) ? "var(--m3-primary)" : "var(--m3-outline-variant)", duration: 0.3, ease: "back.out(1.5)" });
        });
    }, [step]);

    // step content stagger entrance
    useEffect(() => {
        if (!stepRef.current) return;
        gsap.from(stepRef.current.querySelectorAll(".step-item"), { opacity: 0, y: 16, duration: 0.35, stagger: 0.08, delay: 0.15, ease: "power3.out" });
    }, [step]);

    // nav button hovers
    useEffect(() => {
        const cleanups: (() => void)[] = [];
        [backBtnRef, nextBtnRef].forEach(ref => {
            const el = ref.current;
            if (!el) return;
            const enter = () => gsap.to(el, { scale: 1.03, duration: 0.15, ease: "power3.out" });
            const leave = () => gsap.to(el, { scale: 1, duration: 0.15, ease: "power3.out" });
            const down = () => gsap.to(el, { scale: 0.95, duration: 0.1 });
            el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
            cleanups.push(() => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); });
        });
        return () => cleanups.forEach(fn => fn());
    }, [step]);

    // rocket animation
    useEffect(() => {
        if (launching && rocketRef.current) {
            const tween = gsap.to(rocketRef.current, { y: -3, duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
            return () => { tween.kill(); };
        }
    }, [launching]);

    async function handleFinish() {
        setLaunching(true);
        const token = localStorage.getItem("token");
        const surveyData = {
            name, age_range: ageRange, occupation, income_range: incomeRange, spending_profile: spendingProfile,
            savings, financial_goals: financialGoals, balance: parseFloat(balance) || 0, education_level: educationLevel,
            subjects, learning_style: learningStyle, study_goals: studyGoals, exercise_frequency: exerciseFrequency,
            sleep_quality: sleepQuality, diet_quality: dietQuality, health_goals: healthGoals, stress_level: stressLevel,
            biggest_stressor: biggestStressor, wellness_priorities: wellnessPriorities,
        };
        try {
            const res = await fetch(`${API_URL}/api/survey`, {
                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(surveyData),
            });
            if (res.ok) setTimeout(() => router.push("/dashboard"), 1200);
            else { setLaunching(false); toast.error("Failed to save survey."); }
        } catch { setLaunching(false); toast.error("Network error. Please try again."); }
    }

    return (
        <PageTransition>
            <FloatingParticles count={12} />
            <main className="min-h-screen flex items-center justify-center px-4 py-10 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div ref={dotsRef} className="flex items-center gap-2 mb-6 justify-center">
                        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                            <div key={i} className="dot rounded-full h-[10px]" style={{ width: step === (i + 1) ? 28 : 10, backgroundColor: step >= (i + 1) ? "var(--m3-primary)" : "var(--m3-outline-variant)" }} />
                        ))}
                    </div>
                    <div ref={cardRef} className="bg-m3-surface-container-low rounded-m3-xl p-6 shadow-m3-2">
                        {step === 1 && (
                            <div ref={stepRef} key="s1" className="flex flex-col gap-4">
                                <div className="step-item text-center"><h1 className="text-m3-title-large text-m3-on-surface">{STEP_META[0].title}</h1><p className="text-m3-body-medium text-m3-on-surface-variant mt-1">{STEP_META[0].sub}</p></div>
                                <div className="step-item relative"><input type="text" placeholder=" " value={name} onChange={e => setName(e.target.value)} className="m3-input-outlined peer" required /><label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">Your name</label></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Age Range</p><div className="flex flex-col gap-1.5">{["Under 18","18-24","25-34","35-44","45+"].map(opt => <OptionCard key={opt} label={opt} selected={ageRange===opt} onClick={()=>setAgeRange(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Occupation</p><div className="flex flex-col gap-1.5">{["Student","Employed","Self-employed","Unemployed","Retired"].map(opt => <OptionCard key={opt} label={opt} selected={occupation===opt} onClick={()=>setOccupation(opt)} />)}</div></div>
                            </div>
                        )}
                        {step === 2 && (
                            <div ref={stepRef} key="s2" className="flex flex-col gap-4">
                                <div className="step-item text-center"><h1 className="text-m3-title-large text-m3-on-surface">{STEP_META[1].title}</h1><p className="text-m3-body-medium text-m3-on-surface-variant mt-1">{STEP_META[1].sub}</p></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Monthly Income</p><div className="flex flex-col gap-1.5">{["Under $1,000","$1,000-$3,000","$3,000-$5,000","$5,000-$10,000","$10,000+"].map(opt => <OptionCard key={opt} label={opt} selected={incomeRange===opt} onClick={()=>setIncomeRange(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Spending Style</p><div className="flex flex-col gap-1.5">
                                    <OptionCard label="Cautious Saver" description="Think twice before every purchase" icon={ShieldCheck} selected={spendingProfile==="Cautious Saver"} onClick={()=>setSpendingProfile("Cautious Saver")} color="bg-m3-primary-container" />
                                    <OptionCard label="Balanced Planner" description="Budget wisely and stick to plans" icon={Scale} selected={spendingProfile==="Balanced Planner"} onClick={()=>setSpendingProfile("Balanced Planner")} color="bg-m3-secondary-container" />
                                    <OptionCard label="Impulse Spender" description="Buy now and think later" icon={Zap} selected={spendingProfile==="Impulse Spender"} onClick={()=>setSpendingProfile("Impulse Spender")} color="bg-m3-tertiary-container" />
                                </div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Current Savings</p><div className="flex flex-col gap-1.5">{["None","Under $1,000","$1,000-$10,000","$10,000-$50,000","$50,000+"].map(opt => <OptionCard key={opt} label={opt} selected={savings===opt} onClick={()=>setSavings(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Financial Goals</p><div className="flex flex-wrap gap-2">{["Save more","Pay off debt","Invest","Budget better","Build emergency fund","Reduce spending"].map(g => <Chip key={g} label={g} selected={financialGoals.includes(g)} onClick={()=>toggleMulti(financialGoals,setFinancialGoals,g)} />)}</div></div>
                                <div className="step-item relative"><input type="number" placeholder=" " value={balance} onChange={e=>setBalance(e.target.value)} className="m3-input-outlined peer" /><label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">Starting Balance ($)</label></div>
                            </div>
                        )}
                        {step === 3 && (
                            <div ref={stepRef} key="s3" className="flex flex-col gap-4">
                                <div className="step-item text-center"><h1 className="text-m3-title-large text-m3-on-surface">{STEP_META[2].title}</h1><p className="text-m3-body-medium text-m3-on-surface-variant mt-1">{STEP_META[2].sub}</p></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Education Level</p><div className="flex flex-col gap-1.5">{["High School","Undergraduate","Graduate","Professional","Self-taught"].map(opt => <OptionCard key={opt} label={opt} selected={educationLevel===opt} onClick={()=>setEducationLevel(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Areas of Interest</p><div className="flex flex-wrap gap-2">{["STEM","Business","Arts","Health Sciences","Social Sciences","Technology","Languages","Mathematics"].map(s => <Chip key={s} label={s} selected={subjects.includes(s)} onClick={()=>toggleMulti(subjects,setSubjects,s)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Learning Style</p><div className="flex flex-col gap-1.5">{["Visual","Reading/Writing","Hands-on","Discussion-based","Audio/Lectures"].map(opt => <OptionCard key={opt} label={opt} selected={learningStyle===opt} onClick={()=>setLearningStyle(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Study Goals</p><div className="flex flex-wrap gap-2">{["Improve grades","Learn new skills","Career growth","Personal enrichment","Exam prep","Research"].map(g => <Chip key={g} label={g} selected={studyGoals.includes(g)} onClick={()=>toggleMulti(studyGoals,setStudyGoals,g)} />)}</div></div>
                            </div>
                        )}
                        {step === 4 && (
                            <div ref={stepRef} key="s4" className="flex flex-col gap-4">
                                <div className="step-item text-center"><h1 className="text-m3-title-large text-m3-on-surface">{STEP_META[3].title}</h1><p className="text-m3-body-medium text-m3-on-surface-variant mt-1">{STEP_META[3].sub}</p></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Exercise Frequency</p><div className="flex flex-col gap-1.5">{["Never","1-2 times/week","3-4 times/week","5+ times/week","Daily"].map(opt => <OptionCard key={opt} label={opt} selected={exerciseFrequency===opt} onClick={()=>setExerciseFrequency(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Sleep Quality</p><div className="flex flex-col gap-1.5">{["Poor","Fair","Good","Excellent"].map(opt => <OptionCard key={opt} label={opt} selected={sleepQuality===opt} onClick={()=>setSleepQuality(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Diet Quality</p><div className="flex flex-col gap-1.5">{["Needs improvement","Moderate","Healthy","Very healthy"].map(opt => <OptionCard key={opt} label={opt} selected={dietQuality===opt} onClick={()=>setDietQuality(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Health Goals</p><div className="flex flex-wrap gap-2">{["Lose weight","Build muscle","Improve sleep","Reduce stress","Eat better","More energy","Flexibility"].map(g => <Chip key={g} label={g} selected={healthGoals.includes(g)} onClick={()=>toggleMulti(healthGoals,setHealthGoals,g)} />)}</div></div>
                            </div>
                        )}
                        {step === 5 && (
                            <div ref={stepRef} key="s5" className="flex flex-col gap-4">
                                <div className="step-item text-center"><h1 className="text-m3-title-large text-m3-on-surface">{STEP_META[4].title}</h1><p className="text-m3-body-medium text-m3-on-surface-variant mt-1">{STEP_META[4].sub}</p></div>
                                <div className="step-item">
                                    <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Current Stress Level</p>
                                    <div className="flex items-center gap-4"><span className="text-xs text-m3-on-surface-variant">Low</span><input type="range" min="1" max="10" value={stressLevel} onChange={e=>setStressLevel(parseInt(e.target.value))} className="flex-1" /><span className="text-xs text-m3-on-surface-variant">High</span></div>
                                    <p className="text-center text-lg font-semibold text-m3-primary mt-1">{stressLevel}/10</p>
                                </div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Biggest Stressor</p><div className="flex flex-col gap-1.5">{["Work/School","Finances","Relationships","Health","Uncertainty","Time management"].map(opt => <OptionCard key={opt} label={opt} selected={biggestStressor===opt} onClick={()=>setBiggestStressor(opt)} />)}</div></div>
                                <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Wellness Priorities</p><div className="flex flex-wrap gap-2">{["Stress management","Better sleep","More exercise","Mindfulness","Work-life balance","Social connections"].map(p => <Chip key={p} label={p} selected={wellnessPriorities.includes(p)} onClick={()=>toggleMulti(wellnessPriorities,setWellnessPriorities,p)} />)}</div></div>
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-6 gap-3">
                            {step > 1 ? (
                                <button ref={backBtnRef} onClick={() => setStep(step - 1)} className="m3-btn-outlined flex items-center gap-1 px-4 py-2.5 text-sm"><ChevronLeft size={16} /> Back</button>
                            ) : <div />}
                            {step < TOTAL_STEPS ? (
                                <button ref={nextBtnRef} onClick={() => setStep(step + 1)} className="m3-btn-filled flex items-center gap-1">Continue <ChevronRight size={16} /></button>
                            ) : (
                                <button ref={nextBtnRef} onClick={handleFinish} disabled={launching} className="m3-btn-filled flex items-center gap-2 disabled:opacity-80">
                                    {launching ? (<><span ref={rocketRef}><Rocket size={16} /></span> Launching...</>) : "Launch Zenith"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
