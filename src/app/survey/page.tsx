// comprehensive onboarding survey with 5 steps
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Wallet,
    GraduationCap,
    HeartPulse,
    Brain,
    ChevronRight,
    ChevronLeft,
    Rocket,
    ShieldCheck,
    Scale,
    Zap,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import PageTransition from "@/components/PageTransition";

const m3Ease = [0.2, 0, 0, 1] as const;

// stagger animation for step content
const stepStagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};
const stepItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: m3Ease } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

// total number of steps
const TOTAL_STEPS = 5;

// step icons and titles
const STEP_META = [
    { icon: User, title: "About You", sub: "Let us know who you are" },
    { icon: Wallet, title: "Finances", sub: "Your financial picture" },
    { icon: GraduationCap, title: "Academics", sub: "Your learning profile" },
    { icon: HeartPulse, title: "Health", sub: "Your physical wellness" },
    { icon: Brain, title: "Wellness", sub: "Your mental state" },
];

// option card component for single-select
function OptionCard({
    label,
    description,
    selected,
    onClick,
    icon: Icon,
    color,
}: {
    label: string;
    description?: string;
    selected: boolean;
    onClick: () => void;
    icon?: React.ElementType;
    color?: string;
}) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-full text-left px-4 py-3 rounded-m3-lg border-2 transition-colors ${
                selected
                    ? `${color || "bg-m3-primary-container"} border-m3-primary`
                    : "bg-m3-surface-container border-transparent hover:bg-m3-surface-container-high"
            }`}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className={selected ? "text-m3-primary" : "text-m3-on-surface-variant"} />}
                <div className="flex-1">
                    <p className={`text-sm font-medium ${selected ? "text-m3-on-primary-container" : "text-m3-on-surface"}`}>
                        {label}
                    </p>
                    {description && (
                        <p className={`text-xs mt-0.5 ${selected ? "text-m3-on-primary-container/70" : "text-m3-on-surface-variant"}`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </motion.button>
    );
}

// chip for multi-select options
function Chip({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-m3-full text-xs font-medium border transition-colors ${
                selected
                    ? "bg-m3-primary text-m3-on-primary border-m3-primary"
                    : "bg-m3-surface-container text-m3-on-surface-variant border-m3-outline-variant hover:bg-m3-surface-container-high"
            }`}
        >
            {label}
        </motion.button>
    );
}

export default function SurveyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [launching, setLaunching] = useState(false);

    // step 1: about you
    const [name, setName] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [occupation, setOccupation] = useState("");

    // step 2: finances
    const [incomeRange, setIncomeRange] = useState("");
    const [spendingProfile, setSpendingProfile] = useState("");
    const [savings, setSavings] = useState("");
    const [financialGoals, setFinancialGoals] = useState<string[]>([]);
    const [balance, setBalance] = useState("");

    // step 3: academics
    const [educationLevel, setEducationLevel] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [learningStyle, setLearningStyle] = useState("");
    const [studyGoals, setStudyGoals] = useState<string[]>([]);

    // step 4: health
    const [exerciseFrequency, setExerciseFrequency] = useState("");
    const [sleepQuality, setSleepQuality] = useState("");
    const [dietQuality, setDietQuality] = useState("");
    const [healthGoals, setHealthGoals] = useState<string[]>([]);

    // step 5: wellness
    const [stressLevel, setStressLevel] = useState(5);
    const [biggestStressor, setBiggestStressor] = useState("");
    const [wellnessPriorities, setWellnessPriorities] = useState<string[]>([]);

    // redirect if no token
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
        }
    }, [router]);

    // toggle a value in a multi-select array
    function toggleMulti(arr: string[], setter: (v: string[]) => void, val: string) {
        setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    }

    // save all survey data to the backend
    async function handleFinish() {
        setLaunching(true);
        const token = localStorage.getItem("token");

        const surveyData = {
            name,
            age_range: ageRange,
            occupation,
            income_range: incomeRange,
            spending_profile: spendingProfile,
            savings,
            financial_goals: financialGoals,
            balance: parseFloat(balance) || 0,
            education_level: educationLevel,
            subjects,
            learning_style: learningStyle,
            study_goals: studyGoals,
            exercise_frequency: exerciseFrequency,
            sleep_quality: sleepQuality,
            diet_quality: dietQuality,
            health_goals: healthGoals,
            stress_level: stressLevel,
            biggest_stressor: biggestStressor,
            wellness_priorities: wellnessPriorities,
        };

        try {
            await fetch(`${API_URL}/api/survey`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(surveyData),
            });
        } catch {
            // still redirect even if save fails
        }

        setTimeout(() => router.push("/dashboard"), 1200);
    }

    return (
        <PageTransition>
            <main className="min-h-screen flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    {/* progress bar */}
                    <div className="flex items-center gap-2 mb-6 justify-center">
                        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                            <motion.div
                                key={s}
                                animate={{
                                    width: step === s ? 28 : 10,
                                    height: 10,
                                    backgroundColor: step >= s ? "#006B5E" : "#C4C7C5",
                                    borderRadius: 999,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        ))}
                    </div>

                    {/* card container */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: m3Ease }}
                        className="bg-m3-surface-container-low rounded-m3-xl p-6 shadow-m3-2"
                    >
                        <AnimatePresence mode="wait">
                            {/* step 1: about you */}
                            {step === 1 && (
                                <motion.div key="s1" variants={stepStagger} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-xl font-semibold text-m3-on-surface">{STEP_META[0].title}</h1>
                                        <p className="text-sm text-m3-on-surface-variant mt-1">{STEP_META[0].sub}</p>
                                    </motion.div>

                                    <motion.div variants={stepItem} className="relative">
                                        <input type="text" placeholder=" " value={name} onChange={(e) => setName(e.target.value)}
                                            className="m3-input-outlined peer" required />
                                        <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">
                                            Your name
                                        </label>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Age Range</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Under 18", "18-24", "25-34", "35-44", "45+"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={ageRange === opt} onClick={() => setAgeRange(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Occupation</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Student", "Employed", "Self-employed", "Unemployed", "Retired"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={occupation === opt} onClick={() => setOccupation(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* step 2: finances */}
                            {step === 2 && (
                                <motion.div key="s2" variants={stepStagger} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-xl font-semibold text-m3-on-surface">{STEP_META[1].title}</h1>
                                        <p className="text-sm text-m3-on-surface-variant mt-1">{STEP_META[1].sub}</p>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Monthly Income</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Under $1,000", "$1,000-$3,000", "$3,000-$5,000", "$5,000-$10,000", "$10,000+"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={incomeRange === opt} onClick={() => setIncomeRange(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Spending Style</p>
                                        <div className="flex flex-col gap-1.5">
                                            <OptionCard label="Cautious Saver" description="Think twice before every purchase" icon={ShieldCheck} selected={spendingProfile === "Cautious Saver"} onClick={() => setSpendingProfile("Cautious Saver")} color="bg-m3-primary-container" />
                                            <OptionCard label="Balanced Planner" description="Budget wisely and stick to plans" icon={Scale} selected={spendingProfile === "Balanced Planner"} onClick={() => setSpendingProfile("Balanced Planner")} color="bg-m3-secondary-container" />
                                            <OptionCard label="Impulse Spender" description="Buy now and think later" icon={Zap} selected={spendingProfile === "Impulse Spender"} onClick={() => setSpendingProfile("Impulse Spender")} color="bg-m3-tertiary-container" />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Current Savings</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["None", "Under $1,000", "$1,000-$10,000", "$10,000-$50,000", "$50,000+"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={savings === opt} onClick={() => setSavings(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Financial Goals</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Save more", "Pay off debt", "Invest", "Budget better", "Build emergency fund", "Reduce spending"].map((g) => (
                                                <Chip key={g} label={g} selected={financialGoals.includes(g)} onClick={() => toggleMulti(financialGoals, setFinancialGoals, g)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem} className="relative">
                                        <input type="number" placeholder=" " value={balance} onChange={(e) => setBalance(e.target.value)}
                                            className="m3-input-outlined peer" />
                                        <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">
                                            Starting Balance ($)
                                        </label>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* step 3: academics */}
                            {step === 3 && (
                                <motion.div key="s3" variants={stepStagger} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-xl font-semibold text-m3-on-surface">{STEP_META[2].title}</h1>
                                        <p className="text-sm text-m3-on-surface-variant mt-1">{STEP_META[2].sub}</p>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Education Level</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["High School", "Undergraduate", "Graduate", "Professional", "Self-taught"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={educationLevel === opt} onClick={() => setEducationLevel(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Areas of Interest</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["STEM", "Business", "Arts", "Health Sciences", "Social Sciences", "Technology", "Languages", "Mathematics"].map((s) => (
                                                <Chip key={s} label={s} selected={subjects.includes(s)} onClick={() => toggleMulti(subjects, setSubjects, s)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Learning Style</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Visual", "Reading/Writing", "Hands-on", "Discussion-based", "Audio/Lectures"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={learningStyle === opt} onClick={() => setLearningStyle(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Study Goals</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Improve grades", "Learn new skills", "Career growth", "Personal enrichment", "Exam prep", "Research"].map((g) => (
                                                <Chip key={g} label={g} selected={studyGoals.includes(g)} onClick={() => toggleMulti(studyGoals, setStudyGoals, g)} />
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* step 4: health */}
                            {step === 4 && (
                                <motion.div key="s4" variants={stepStagger} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-xl font-semibold text-m3-on-surface">{STEP_META[3].title}</h1>
                                        <p className="text-sm text-m3-on-surface-variant mt-1">{STEP_META[3].sub}</p>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Exercise Frequency</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Never", "1-2 times/week", "3-4 times/week", "5+ times/week", "Daily"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={exerciseFrequency === opt} onClick={() => setExerciseFrequency(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Sleep Quality</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Poor", "Fair", "Good", "Excellent"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={sleepQuality === opt} onClick={() => setSleepQuality(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Diet Quality</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Needs improvement", "Moderate", "Healthy", "Very healthy"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={dietQuality === opt} onClick={() => setDietQuality(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Health Goals</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Lose weight", "Build muscle", "Improve sleep", "Reduce stress", "Eat better", "More energy", "Flexibility"].map((g) => (
                                                <Chip key={g} label={g} selected={healthGoals.includes(g)} onClick={() => toggleMulti(healthGoals, setHealthGoals, g)} />
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* step 5: wellness */}
                            {step === 5 && (
                                <motion.div key="s5" variants={stepStagger} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-xl font-semibold text-m3-on-surface">{STEP_META[4].title}</h1>
                                        <p className="text-sm text-m3-on-surface-variant mt-1">{STEP_META[4].sub}</p>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Current Stress Level</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-m3-on-surface-variant">Low</span>
                                            <input
                                                type="range" min="1" max="10" value={stressLevel}
                                                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="text-xs text-m3-on-surface-variant">High</span>
                                        </div>
                                        <p className="text-center text-lg font-semibold text-m3-primary mt-1">{stressLevel}/10</p>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Biggest Stressor</p>
                                        <div className="flex flex-col gap-1.5">
                                            {["Work/School", "Finances", "Relationships", "Health", "Uncertainty", "Time management"].map((opt) => (
                                                <OptionCard key={opt} label={opt} selected={biggestStressor === opt} onClick={() => setBiggestStressor(opt)} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div variants={stepItem}>
                                        <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Wellness Priorities</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Stress management", "Better sleep", "More exercise", "Mindfulness", "Work-life balance", "Social connections"].map((p) => (
                                                <Chip key={p} label={p} selected={wellnessPriorities.includes(p)} onClick={() => toggleMulti(wellnessPriorities, setWellnessPriorities, p)} />
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* navigation buttons */}
                        <div className="flex items-center justify-between mt-6 gap-3">
                            {/* back button */}
                            {step > 1 ? (
                                <motion.button
                                    onClick={() => setStep(step - 1)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="m3-btn-outlined flex items-center gap-1 px-4 py-2.5 text-sm"
                                >
                                    <ChevronLeft size={16} />
                                    Back
                                </motion.button>
                            ) : (
                                <div />
                            )}

                            {/* next / finish button */}
                            {step < TOTAL_STEPS ? (
                                <motion.button
                                    onClick={() => setStep(step + 1)}
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="m3-btn-filled flex items-center gap-1"
                                >
                                    Continue
                                    <ChevronRight size={16} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={handleFinish}
                                    disabled={launching}
                                    whileHover={{ scale: launching ? 1 : 1.03 }}
                                    whileTap={{ scale: launching ? 1 : 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="m3-btn-filled flex items-center gap-2 disabled:opacity-80"
                                >
                                    <AnimatePresence mode="wait">
                                        {launching ? (
                                            <motion.span key="go" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                                <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                                                    <Rocket size={16} />
                                                </motion.span>
                                                Launching...
                                            </motion.span>
                                        ) : (
                                            <motion.span key="done" exit={{ opacity: 0 }}>
                                                Launch Zenith
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </PageTransition>
    );
}
