// gsap animation hooks — replaces framer-motion throughout zenith
"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/dist/Flip";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// register gsap plugins once
if (typeof window !== "undefined") {
    gsap.registerPlugin(Flip, ScrollTrigger);
}

// m3 standard easing as gsap custom ease string
export const M3_EASE = "power3.out";
export const M3_EASE_EMPHASIZED = "power4.out";
export const M3_EASE_DECELERATE = "power2.out";
export const M3_EASE_ACCELERATE = "power2.in";
export const M3_SPRING = "elastic.out(1, 0.5)";

// entrance animation — runs gsap.from() on mount
export function useEntrance(
    vars: gsap.TweenVars,
    deps: unknown[] = []
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.from(ref.current!, {
                ease: M3_EASE,
                duration: 0.5,
                ...vars,
            });
        });
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
}

// hover + tap animation — attaches mouseenter/mouseleave/mousedown/mouseup
export function useHover(
    hoverVars: gsap.TweenVars = { scale: 1.03, y: -2 },
    tapVars: gsap.TweenVars = { scale: 0.95 },
    baseVars: gsap.TweenVars = { scale: 1, y: 0 }
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onEnter = () => gsap.to(el, { duration: 0.25, ease: M3_EASE, ...hoverVars });
        const onLeave = () => gsap.to(el, { duration: 0.25, ease: M3_EASE, ...baseVars });
        const onDown = () => gsap.to(el, { duration: 0.1, ease: M3_EASE_ACCELERATE, ...tapVars });
        const onUp = () => gsap.to(el, { duration: 0.2, ease: M3_EASE, ...hoverVars });

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        el.addEventListener("mousedown", onDown);
        el.addEventListener("mouseup", onUp);

        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("mousedown", onDown);
            el.removeEventListener("mouseup", onUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
}

// stagger children entrance — animates all children with stagger
export function useStagger(
    childSelector: string = ":scope > *",
    vars: gsap.TweenVars = { opacity: 0, y: 20 },
    stagger: number = 0.08,
    deps: unknown[] = []
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.from(ref.current!.querySelectorAll(childSelector), {
                ease: M3_EASE,
                duration: 0.5,
                stagger,
                ...vars,
            });
        });
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
}

// infinite loop animation — float, rotate, pulse etc.
export function useLoop(
    vars: gsap.TweenVars,
    deps: unknown[] = []
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const tween = gsap.to(ref.current, {
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            ...vars,
        });
        return () => { tween.kill(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
}

// animate-on-change — triggers animation when a key changes
export function useAnimateOnChange(
    key: unknown,
    vars: gsap.TweenVars = { scale: 0.8, opacity: 0, y: -12 }
) {
    const ref = useRef<HTMLDivElement>(null);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) { first.current = false; return; }
        if (!ref.current) return;
        gsap.from(ref.current, {
            duration: 0.35,
            ease: M3_SPRING,
            ...vars,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return ref;
}

// presence animation — delayed unmount for exit animations
export function usePresence(visible: boolean, exitDuration: number = 0.3) {
    const [mounted, setMounted] = useState(visible);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible) {
            setMounted(true);
        } else if (ref.current) {
            gsap.to(ref.current, {
                opacity: 0,
                scale: 0.95,
                y: -8,
                duration: exitDuration,
                ease: M3_EASE_ACCELERATE,
                onComplete: () => setMounted(false),
            });
        } else {
            setMounted(false);
        }
    }, [visible, exitDuration]);

    // entrance animation after mounting
    useEffect(() => {
        if (visible && mounted && ref.current) {
            gsap.from(ref.current, {
                opacity: 0,
                scale: 0.95,
                y: 8,
                duration: 0.35,
                ease: M3_EASE,
            });
        }
    }, [visible, mounted]);

    return { ref, mounted };
}

// modal presence — spring-style entrance/exit for modals
export function useModalPresence(visible: boolean) {
    const [mounted, setMounted] = useState(visible);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible) {
            setMounted(true);
        } else {
            const tl = gsap.timeline({
                onComplete: () => setMounted(false),
            });
            if (contentRef.current) {
                tl.to(contentRef.current, {
                    scale: 0.85,
                    opacity: 0,
                    y: 20,
                    duration: 0.25,
                    ease: M3_EASE_ACCELERATE,
                }, 0);
            }
            if (overlayRef.current) {
                tl.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    ease: M3_EASE_ACCELERATE,
                }, 0.05);
            }
        }
    }, [visible]);

    // entrance
    useEffect(() => {
        if (visible && mounted) {
            if (overlayRef.current) {
                gsap.from(overlayRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: M3_EASE,
                });
            }
            if (contentRef.current) {
                gsap.from(contentRef.current, {
                    scale: 0.7,
                    opacity: 0,
                    y: 40,
                    duration: 0.5,
                    ease: "back.out(1.4)",
                });
            }
        }
    }, [visible, mounted]);

    return { overlayRef, contentRef, mounted };
}

// timeline builder helper
export function useTimeline(deps: unknown[] = []) {
    const tl = useRef<gsap.core.Timeline | null>(null);
    const scope = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scope.current) return;
        tl.current = gsap.timeline();
        return () => { tl.current?.kill(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { tl, scope };
}

// quick gsap.from on mount with ref
export function useMountAnim(vars: gsap.TweenVars) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        gsap.from(ref.current, { ease: M3_EASE, duration: 0.5, ...vars });
    }, []);
    return ref;
}

// batch hover for multiple children
export function useChildHover(
    childSelector: string,
    hoverVars: gsap.TweenVars = { scale: 1.05, y: -3 },
    duration: number = 0.25
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const children = el.querySelectorAll(childSelector);

        const handlers: Array<{ el: Element; enter: () => void; leave: () => void }> = [];

        children.forEach((child) => {
            const enter = () => gsap.to(child, { duration, ease: M3_EASE, ...hoverVars });
            const leave = () => gsap.to(child, { duration, ease: M3_EASE, scale: 1, y: 0, x: 0 });

            child.addEventListener("mouseenter", enter);
            child.addEventListener("mouseleave", leave);
            handlers.push({ el: child, enter, leave });
        });

        return () => {
            handlers.forEach(({ el: child, enter, leave }) => {
                child.removeEventListener("mouseenter", enter);
                child.removeEventListener("mouseleave", leave);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
}

// export gsap for direct usage
export { gsap };
