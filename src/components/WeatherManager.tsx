// randomises a weather / ambient effect per page — leaves, rain, wind, or clouds
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// dynamic imports so each effect only loads when chosen
const FallingLeaves = dynamic(() => import("@/components/FallingLeaves"), { ssr: false });
const RainEffect = dynamic(() => import("@/components/RainEffect"), { ssr: false });
const WindEffect = dynamic(() => import("@/components/WindEffect"), { ssr: false });
const CloudEffect = dynamic(() => import("@/components/CloudEffect"), { ssr: false });

type Effect = "leaves" | "rain" | "wind" | "clouds";

const EFFECTS: Effect[] = ["leaves", "rain", "wind", "clouds"];

function pickRandom(): Effect {
    return EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
}

export default function WeatherManager() {
    const pathname = usePathname();
    const [effect, setEffect] = useState<Effect | null>(null);

    // on every route change, pick a new random effect
    useEffect(() => {
        setEffect(pickRandom());
    }, [pathname]);

    if (!effect) return null;

    switch (effect) {
        case "leaves":
            return <FallingLeaves count={38} />;
        case "rain":
            return <RainEffect intensity={220} />;
        case "wind":
            return <WindEffect streakCount={35} particleCount={50} />;
        case "clouds":
            return <CloudEffect count={12} />;
        default:
            return null;
    }
}
