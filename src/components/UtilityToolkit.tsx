// utility toolkit — interactive calculators and tools for each ai section
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import {
    Calculator, Home, Clock, Scale, Droplets, Flame, Coffee, HeartPulse,
    GraduationCap, BookOpen, Ruler, Volume2, ChevronDown, ChevronUp,
    Dumbbell,
} from "lucide-react";

// collapsible section wrapper with gsap animation
function ToolSection({ title, icon: Icon, children, accentText }: {
    title: string; icon: React.ElementType; children: React.ReactNode; accentText: string;
}) {
    const [open, setOpen] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bodyRef.current || !contentRef.current) return;
        if (open) {
            const h = contentRef.current.scrollHeight;
            gsap.fromTo(bodyRef.current, { height: 0, opacity: 0 }, { height: h, opacity: 1, duration: 0.35, ease: "power3.out" });
        } else {
            gsap.to(bodyRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power3.in" });
        }
    }, [open]);

    return (
        <div className="bg-m3-surface-container-low rounded-m3-lg border border-m3-outline-variant/20 overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-m3-surface-container transition-colors">
                <Icon size={16} className={accentText} />
                <span className="text-m3-label-large text-m3-on-surface flex-1 text-left">{title}</span>
                {open ? <ChevronUp size={16} className="text-m3-on-surface-variant" /> : <ChevronDown size={16} className="text-m3-on-surface-variant" />}
            </button>
            <div ref={bodyRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
                <div ref={contentRef} className="px-4 pb-4 pt-1 space-y-3">
                    {children}
                </div>
            </div>
        </div>
    );
}

// shared input style
function ToolInput({ label, value, onChange, type = "number", placeholder }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
    return (
        <div>
            <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full bg-m3-surface-container rounded-m3-lg px-3 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none focus:border-m3-primary transition-colors" />
        </div>
    );
}

// shared result display
function ToolResult({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className={`rounded-m3-lg px-3 py-2.5 ${accent ? "bg-m3-primary-container" : "bg-m3-surface-container"}`}>
            <p className="text-m3-label-small text-m3-on-surface-variant">{label}</p>
            <p className={`text-m3-title-small ${accent ? "text-m3-on-primary-container" : "text-m3-on-surface"}`}>{value}</p>
        </div>
    );
}

// === guardian tools ===

function CompoundInterestCalc({ accentText }: { accentText: string }) {
    const [principal, setPrincipal] = useState(""); const [rate, setRate] = useState(""); const [years, setYears] = useState(""); const [monthly, setMonthly] = useState("");
    const p = parseFloat(principal) || 0; const r = (parseFloat(rate) || 0) / 100; const y = parseFloat(years) || 0; const m = parseFloat(monthly) || 0;
    const monthlyRate = r / 12; const months = y * 12;
    const futureValue = months > 0 ? p * Math.pow(1 + monthlyRate, months) + m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : p;
    const totalContributed = p + (m * months); const interestEarned = futureValue - totalContributed;
    return (
        <ToolSection title="Compound Interest Calculator" icon={Calculator} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Starting amount ($)" value={principal} onChange={setPrincipal} />
                <ToolInput label="Annual rate (%)" value={rate} onChange={setRate} />
                <ToolInput label="Years" value={years} onChange={setYears} />
                <ToolInput label="Monthly add ($)" value={monthly} onChange={setMonthly} />
            </div>
            {p > 0 && y > 0 && <div className="grid grid-cols-2 gap-2">
                <ToolResult label="Future Value" value={`$${futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} accent />
                <ToolResult label="Interest Earned" value={`$${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
            </div>}
        </ToolSection>
    );
}

function RentVsBuyAnalyzer({ accentText }: { accentText: string }) {
    const [rent, setRent] = useState(""); const [homePrice, setHomePrice] = useState(""); const [downPct, setDownPct] = useState("20"); const [mortgageRate, setMortgageRate] = useState("6.5");
    const r = parseFloat(rent) || 0; const hp = parseFloat(homePrice) || 0; const dp = (parseFloat(downPct) || 20) / 100; const mr = (parseFloat(mortgageRate) || 6.5) / 100 / 12;
    const loan = hp * (1 - dp); const n = 360;
    const monthlyMortgage = loan > 0 && mr > 0 ? (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : 0;
    const totalRent5yr = r * 60; const totalBuy5yr = monthlyMortgage * 60 + hp * dp;
    return (
        <ToolSection title="Rent vs. Buy Analyzer" icon={Home} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Monthly rent ($)" value={rent} onChange={setRent} />
                <ToolInput label="Home price ($)" value={homePrice} onChange={setHomePrice} />
                <ToolInput label="Down payment (%)" value={downPct} onChange={setDownPct} />
                <ToolInput label="Mortgage rate (%)" value={mortgageRate} onChange={setMortgageRate} />
            </div>
            {r > 0 && hp > 0 && <div className="space-y-2">
                <ToolResult label="Monthly mortgage" value={`$${monthlyMortgage.toFixed(2)}`} />
                <div className="grid grid-cols-2 gap-2">
                    <ToolResult label="5-year rent cost" value={`$${totalRent5yr.toLocaleString()}`} />
                    <ToolResult label="5-year buy cost" value={`$${totalBuy5yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} accent />
                </div>
                <p className="text-m3-body-small text-m3-on-surface-variant">{totalBuy5yr < totalRent5yr * 1.2 ? "Buying could make sense at this price point." : "Renting may be more cost-effective for now."}</p>
            </div>}
        </ToolSection>
    );
}

function TrueCostConverter({ accentText }: { accentText: string }) {
    const [price, setPrice] = useState(""); const [wage, setWage] = useState("");
    const p = parseFloat(price) || 0; const w = parseFloat(wage) || 0;
    const hours = w > 0 ? p / w : 0;
    return (
        <ToolSection title="True Cost Hourly Converter" icon={Clock} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Item price ($)" value={price} onChange={setPrice} />
                <ToolInput label="Hourly wage ($)" value={wage} onChange={setWage} />
            </div>
            {p > 0 && w > 0 && <ToolResult label="Hours of your life" value={`${hours.toFixed(1)} hours`} accent />}
        </ToolSection>
    );
}

// === vitals tools ===

function BMICalculator({ accentText }: { accentText: string }) {
    const [weight, setWeight] = useState(""); const [heightFt, setHeightFt] = useState(""); const [heightIn, setHeightIn] = useState("");
    const w = parseFloat(weight) || 0; const totalIn = ((parseFloat(heightFt) || 0) * 12) + (parseFloat(heightIn) || 0);
    const bmi = totalIn > 0 ? (w / (totalIn * totalIn)) * 703 : 0;
    const bf = bmi > 0 ? (1.2 * bmi + 0.23 * 25 - 5.4 - 10.8 * 1) : 0; // rough estimate assuming male age 25
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    return (
        <ToolSection title="BMI & Body Fat Estimator" icon={Scale} accentText={accentText}>
            <div className="grid grid-cols-3 gap-2">
                <ToolInput label="Weight (lbs)" value={weight} onChange={setWeight} />
                <ToolInput label="Height (ft)" value={heightFt} onChange={setHeightFt} />
                <ToolInput label="Height (in)" value={heightIn} onChange={setHeightIn} />
            </div>
            {bmi > 0 && <div className="grid grid-cols-3 gap-2">
                <ToolResult label="BMI" value={bmi.toFixed(1)} accent />
                <ToolResult label="Category" value={category} />
                <ToolResult label="Est. Body Fat" value={`~${Math.max(0, bf).toFixed(0)}%`} />
            </div>}
        </ToolSection>
    );
}

function TDEECalculator({ accentText }: { accentText: string }) {
    const [age, setAge] = useState(""); const [weight, setWeight] = useState(""); const [heightCm, setHeightCm] = useState(""); const [activity, setActivity] = useState("1.55");
    const [gender, setGender] = useState("male");
    const w = (parseFloat(weight) || 0) * 0.453592; const h = parseFloat(heightCm) || 0; const a = parseFloat(age) || 0; const af = parseFloat(activity);
    const bmr = gender === "male" ? (10 * w + 6.25 * h - 5 * a + 5) : (10 * w + 6.25 * h - 5 * a - 161);
    const tdee = bmr * af;
    return (
        <ToolSection title="TDEE & Calorie Calculator" icon={Flame} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Age" value={age} onChange={setAge} />
                <ToolInput label="Weight (lbs)" value={weight} onChange={setWeight} />
                <ToolInput label="Height (cm)" value={heightCm} onChange={setHeightCm} />
                <div>
                    <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">Activity</label>
                    <select value={activity} onChange={e => setActivity(e.target.value)}
                        className="w-full bg-m3-surface-container rounded-m3-lg px-3 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none">
                        <option value="1.2">Sedentary</option>
                        <option value="1.375">Light</option>
                        <option value="1.55">Moderate</option>
                        <option value="1.725">Active</option>
                        <option value="1.9">Very Active</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setGender("male")} className={`flex-1 py-1.5 rounded-m3-full text-m3-label-medium border transition-colors ${gender === "male" ? "bg-m3-primary text-m3-on-primary border-m3-primary" : "border-m3-outline-variant text-m3-on-surface-variant"}`}>Male</button>
                <button onClick={() => setGender("female")} className={`flex-1 py-1.5 rounded-m3-full text-m3-label-medium border transition-colors ${gender === "female" ? "bg-m3-primary text-m3-on-primary border-m3-primary" : "border-m3-outline-variant text-m3-on-surface-variant"}`}>Female</button>
            </div>
            {a > 0 && w > 0 && h > 0 && <div className="grid grid-cols-3 gap-2">
                <ToolResult label="BMR" value={`${bmr.toFixed(0)} cal`} />
                <ToolResult label="TDEE" value={`${tdee.toFixed(0)} cal`} accent />
                <ToolResult label="RMR" value={`${(bmr * 0.95).toFixed(0)} cal`} />
            </div>}
        </ToolSection>
    );
}

function WaterIntakeCalc({ accentText }: { accentText: string }) {
    const [weight, setWeight] = useState(""); const [exercise, setExercise] = useState("30"); const [temp, setTemp] = useState("72");
    const w = parseFloat(weight) || 0; const ex = parseFloat(exercise) || 0; const t = parseFloat(temp) || 72;
    const baseOz = w * 0.5; const exerciseOz = (ex / 30) * 12; const heatOz = t > 85 ? (t - 85) * 0.5 : 0;
    const totalOz = baseOz + exerciseOz + heatOz; const liters = totalOz * 0.0296;
    return (
        <ToolSection title="Water Intake & Deficit Planner" icon={Droplets} accentText={accentText}>
            <div className="grid grid-cols-3 gap-2">
                <ToolInput label="Weight (lbs)" value={weight} onChange={setWeight} />
                <ToolInput label="Exercise (min)" value={exercise} onChange={setExercise} />
                <ToolInput label="Temp (°F)" value={temp} onChange={setTemp} />
            </div>
            {w > 0 && <div className="grid grid-cols-2 gap-2">
                <ToolResult label="Daily Water" value={`${totalOz.toFixed(0)} oz`} accent />
                <ToolResult label="In Liters" value={`${liters.toFixed(1)} L`} />
            </div>}
        </ToolSection>
    );
}

function CaffeineTracker({ accentText }: { accentText: string }) {
    const [mg, setMg] = useState(""); const [hour, setHour] = useState("8");
    const caffeine = parseFloat(mg) || 0; const startHr = parseFloat(hour) || 8;
    // caffeine half-life ~5 hours
    const hoursUntil10pm = 22 - startHr; const remaining = caffeine * Math.pow(0.5, hoursUntil10pm / 5);
    const at6pm = caffeine * Math.pow(0.5, (18 - startHr) / 5);
    return (
        <ToolSection title="Caffeine & Heart Rate Zones" icon={Coffee} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Caffeine (mg)" value={mg} onChange={setMg} />
                <ToolInput label="Time consumed (24h)" value={hour} onChange={setHour} />
            </div>
            {caffeine > 0 && <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <ToolResult label="At 6 PM" value={`${at6pm.toFixed(0)} mg left`} />
                    <ToolResult label="At 10 PM" value={`${remaining.toFixed(0)} mg left`} accent />
                </div>
                <p className="text-m3-body-small text-m3-on-surface-variant">{remaining > 100 ? "High caffeine at bedtime — may disrupt sleep." : remaining > 50 ? "Moderate caffeine remaining — sleep may be affected." : "Low caffeine by bedtime — you should sleep fine."}</p>
            </div>}
        </ToolSection>
    );
}

function HeartRateZones({ accentText }: { accentText: string }) {
    const [age, setAge] = useState(""); const [restHr, setRestHr] = useState("70");
    const a = parseFloat(age) || 0; const rhr = parseFloat(restHr) || 70;
    const maxHr = 220 - a; const hrReserve = maxHr - rhr;
    const z2Low = Math.round(rhr + hrReserve * 0.6); const z2High = Math.round(rhr + hrReserve * 0.7);
    const z5Low = Math.round(rhr + hrReserve * 0.9); const z5High = maxHr;
    return (
        <ToolSection title="Target Heart Rate Zones" icon={HeartPulse} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Age" value={age} onChange={setAge} />
                <ToolInput label="Resting HR (bpm)" value={restHr} onChange={setRestHr} />
            </div>
            {a > 0 && <div className="space-y-2">
                <ToolResult label="Zone 2 (Fat Burn)" value={`${z2Low}–${z2High} bpm`} accent />
                <ToolResult label="Zone 5 (VO2 Max)" value={`${z5Low}–${z5High} bpm`} />
                <ToolResult label="Max Heart Rate" value={`${maxHr} bpm`} />
            </div>}
        </ToolSection>
    );
}

function FitnessCreator({ accentText }: { accentText: string }) {
    const [goal, setGoal] = useState("lose"); const [days, setDays] = useState("4"); const [level, setLevel] = useState("beginner");
    const plans: Record<string, Record<string, string[]>> = {
        lose: { beginner: ["30 min walk", "20 min bodyweight circuit", "Rest", "30 min bike", "20 min HIIT", "Rest", "Active recovery yoga"], intermediate: ["40 min run", "30 min strength", "Rest", "45 min bike", "30 min HIIT", "Rest", "Active recovery"], advanced: ["60 min run", "45 min heavy lifts", "30 min HIIT", "60 min bike", "45 min strength", "30 min swimming", "Rest"] },
        gain: { beginner: ["Upper body push", "Rest", "Lower body", "Rest", "Upper body pull", "Rest", "Rest"], intermediate: ["Chest/Tris", "Back/Bis", "Rest", "Legs/Shoulders", "Full body", "Rest", "Rest"], advanced: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"] },
        maintain: { beginner: ["Full body workout", "Rest", "30 min cardio", "Rest", "Full body workout", "Rest", "Active recovery"], intermediate: ["Upper body", "Cardio", "Lower body", "Rest", "Full body", "Cardio", "Rest"], advanced: ["Push+Cardio", "Pull", "Legs+HIIT", "Push", "Pull+Cardio", "Legs", "Rest"] },
    };
    const daysN = Math.min(7, Math.max(1, parseInt(days) || 4));
    const plan = plans[goal]?.[level] || plans.maintain.beginner;
    return (
        <ToolSection title="AI Fitness Plan Creator" icon={Dumbbell} accentText={accentText}>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">Goal</label>
                    <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-m3-surface-container rounded-m3-lg px-2 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none">
                        <option value="lose">Lose Fat</option><option value="gain">Build Muscle</option><option value="maintain">Maintain</option>
                    </select>
                </div>
                <ToolInput label="Days/week" value={days} onChange={setDays} />
                <div>
                    <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">Level</label>
                    <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-m3-surface-container rounded-m3-lg px-2 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none">
                        <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>
            <div className="space-y-1">
                {plan.slice(0, daysN).map((day, i) => (
                    <div key={i} className="flex items-center gap-2 bg-m3-surface-container rounded-m3-lg px-3 py-1.5">
                        <span className="text-m3-label-small text-m3-on-surface-variant w-14">Day {i + 1}</span>
                        <span className="text-m3-body-small text-m3-on-surface">{day}</span>
                    </div>
                ))}
            </div>
        </ToolSection>
    );
}

// === scholar tools ===

function GPACalculator({ accentText }: { accentText: string }) {
    const [currentGrade, setCurrentGrade] = useState(""); const [finalWeight, setFinalWeight] = useState("30"); const [targetGrade, setTargetGrade] = useState("90");
    const current = parseFloat(currentGrade) || 0; const fw = (parseFloat(finalWeight) || 30) / 100; const target = parseFloat(targetGrade) || 90;
    const neededOnFinal = fw > 0 ? (target - current * (1 - fw)) / fw : 0;
    return (
        <ToolSection title="GPA & Final Exam Calculator" icon={GraduationCap} accentText={accentText}>
            <div className="grid grid-cols-3 gap-2">
                <ToolInput label="Current grade (%)" value={currentGrade} onChange={setCurrentGrade} />
                <ToolInput label="Final weight (%)" value={finalWeight} onChange={setFinalWeight} />
                <ToolInput label="Target grade (%)" value={targetGrade} onChange={setTargetGrade} />
            </div>
            {current > 0 && <div className="space-y-2">
                <ToolResult label="Score needed on final" value={`${neededOnFinal.toFixed(1)}%`} accent />
                <p className="text-m3-body-small text-m3-on-surface-variant">{neededOnFinal > 100 ? "Mathematically impossible — consider extra credit or adjusting your target." : neededOnFinal > 90 ? "You'll need an A on the final. Study hard!" : neededOnFinal > 70 ? "Very achievable with solid preparation." : "You're in great shape — just don't skip the final."}</p>
            </div>}
        </ToolSection>
    );
}

function CitationGenerator({ accentText }: { accentText: string }) {
    const [author, setAuthor] = useState(""); const [title, setTitle] = useState(""); const [year, setYear] = useState(""); const [source, setSource] = useState(""); const [url, setUrl] = useState("");
    const lastName = author.split(" ").pop() || author;
    const firstName = author.split(" ").slice(0, -1).join(" ");
    const firstInitial = firstName ? firstName[0] + "." : "";
    const apa = author && title ? `${lastName}, ${firstInitial} (${year || "n.d."}). ${title}. ${source}${url ? `. ${url}` : ""}` : "";
    const mla = author && title ? `${lastName}, ${firstName}. "${title}." ${source}, ${year || "n.d."}${url ? `, ${url}` : ""}.` : "";
    return (
        <ToolSection title="Citation Generator" icon={BookOpen} accentText={accentText}>
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Author (full name)" value={author} onChange={setAuthor} type="text" />
                <ToolInput label="Year" value={year} onChange={setYear} type="text" />
            </div>
            <ToolInput label="Title" value={title} onChange={setTitle} type="text" />
            <div className="grid grid-cols-2 gap-2">
                <ToolInput label="Source / Journal" value={source} onChange={setSource} type="text" />
                <ToolInput label="URL (optional)" value={url} onChange={setUrl} type="text" />
            </div>
            {apa && <div className="space-y-2">
                <div className="rounded-m3-lg px-3 py-2.5 bg-m3-primary-container"><p className="text-m3-label-small text-m3-on-surface-variant">APA</p><p className="text-m3-body-small text-m3-on-primary-container break-all">{apa}</p></div>
                <div className="rounded-m3-lg px-3 py-2.5 bg-m3-surface-container"><p className="text-m3-label-small text-m3-on-surface-variant">MLA</p><p className="text-m3-body-small text-m3-on-surface break-all">{mla}</p></div>
            </div>}
        </ToolSection>
    );
}

function UnitConverter({ accentText }: { accentText: string }) {
    const [value, setValue] = useState(""); const [fromUnit, setFromUnit] = useState("km"); const [toUnit, setToUnit] = useState("mi");
    const conversions: Record<string, Record<string, number | ((v: number) => number)>> = {
        km: { mi: 0.621371, m: 1000, ft: 3280.84, ly: 1.057e-13 }, mi: { km: 1.60934, m: 1609.34, ft: 5280, ly: 1.7011e-13 },
        m: { km: 0.001, mi: 0.000621371, ft: 3.28084, ly: 1.057e-16 }, ft: { km: 0.0003048, mi: 0.000189394, m: 0.3048, ly: 3.222e-17 },
        kg: { lbs: 2.20462, oz: 35.274, g: 1000 }, lbs: { kg: 0.453592, oz: 16, g: 453.592 },
        J: { cal: 0.239006, BTU: 0.000947817, kWh: 2.778e-7 }, cal: { J: 4.184, BTU: 0.003968, kWh: 1.163e-6 },
        C: { F: (v: number) => v * 9/5 + 32, K: (v: number) => v + 273.15 }, F: { C: (v: number) => (v - 32) * 5/9, K: (v: number) => (v - 32) * 5/9 + 273.15 },
    };
    const v = parseFloat(value) || 0;
    let result = 0;
    const conv = conversions[fromUnit]?.[toUnit];
    if (typeof conv === "function") result = conv(v);
    else if (typeof conv === "number") result = v * conv;
    const units = ["km", "mi", "m", "ft", "kg", "lbs", "J", "cal", "BTU", "C", "F", "K"];
    return (
        <ToolSection title="Unit Converter" icon={Ruler} accentText={accentText}>
            <ToolInput label="Value" value={value} onChange={setValue} />
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">From</label>
                    <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-m3-surface-container rounded-m3-lg px-3 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none">
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">To</label>
                    <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-m3-surface-container rounded-m3-lg px-3 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none">
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            {v !== 0 && conv && <ToolResult label={`${v} ${fromUnit} =`} value={`${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}`} accent />}
        </ToolSection>
    );
}

function TextToSpeechReader({ accentText }: { accentText: string }) {
    const [text, setText] = useState(""); const [speaking, setSpeaking] = useState(false);
    function speak() {
        if (!text.trim() || typeof window === "undefined") return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }
    function stop() { if (typeof window !== "undefined") { window.speechSynthesis.cancel(); setSpeaking(false); } }
    return (
        <ToolSection title="Text-to-Speech Reader" icon={Volume2} accentText={accentText}>
            <div>
                <label className="text-m3-label-small text-m3-on-surface-variant block mb-1">Paste your text</label>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Paste your essay or notes here..."
                    className="w-full bg-m3-surface-container rounded-m3-lg px-3 py-2 text-m3-body-medium text-m3-on-surface border border-m3-outline-variant/20 outline-none focus:border-m3-primary transition-colors resize-none" />
            </div>
            <div className="flex gap-2">
                <button onClick={speak} disabled={!text.trim() || speaking}
                    className="flex-1 py-2 rounded-m3-full bg-m3-primary text-m3-on-primary text-m3-label-medium disabled:opacity-40 transition-opacity">
                    {speaking ? "Reading..." : "Read Aloud"}
                </button>
                {speaking && <button onClick={stop} className="px-4 py-2 rounded-m3-full bg-m3-error-container text-m3-on-error-container text-m3-label-medium">Stop</button>}
            </div>
        </ToolSection>
    );
}

// === exported toolkit components for each section ===

export function GuardianUtilities({ accentText }: { accentText: string }) {
    return (
        <div className="space-y-2">
            <p className="text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider px-1">Financial Tools</p>
            <CompoundInterestCalc accentText={accentText} />
            <RentVsBuyAnalyzer accentText={accentText} />
            <TrueCostConverter accentText={accentText} />
        </div>
    );
}

export function VitalsUtilities({ accentText }: { accentText: string }) {
    return (
        <div className="space-y-2">
            <p className="text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider px-1">Health Tools</p>
            <BMICalculator accentText={accentText} />
            <TDEECalculator accentText={accentText} />
            <WaterIntakeCalc accentText={accentText} />
            <CaffeineTracker accentText={accentText} />
            <HeartRateZones accentText={accentText} />
            <FitnessCreator accentText={accentText} />
        </div>
    );
}

export function ScholarUtilities({ accentText }: { accentText: string }) {
    return (
        <div className="space-y-2">
            <p className="text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider px-1">Study Tools</p>
            <GPACalculator accentText={accentText} />
            <CitationGenerator accentText={accentText} />
            <UnitConverter accentText={accentText} />
            <TextToSpeechReader accentText={accentText} />
        </div>
    );
}
