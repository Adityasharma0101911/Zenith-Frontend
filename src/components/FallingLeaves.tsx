// reactive falling leaf animation — gsap powered with mouse parallax
"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

// leaf svg paths — varied shapes for realism
const LEAF_PATHS = [
    // simple rounded leaf
    "M12 2C6.5 2 2 8 2 14c0 4 3 8 10 8s10-4 10-8C22 8 17.5 2 12 2z",
    // pointed maple-ish leaf
    "M12 1L9 6L3 5L6 10L1 14L7 14L8 20L12 16L16 20L17 14L23 14L18 10L21 5L15 6L12 1z",
    // elongated leaf
    "M12 0C10 4 4 8 2 14c-1 3 1 6 4 7 2 1 4 0 6-2 2 2 4 3 6 2 3-1 5-4 4-7C20 8 14 4 12 0z",
    // small round leaf
    "M12 3C8 3 4 7 4 12s4 9 8 9 8-4 8-9S16 3 12 3z",
    // oak-like leaf
    "M12 1C10 4 7 5 5 8c-1 2 0 4 1 5 0 2-1 4 0 6 1 2 3 3 5 3s4-1 5-3c1-2 0-4 0-6 1-1 2-3 1-5C15 5 14 4 12 1z",
];

// leaf colors that blend with nature — using opacity for theme adaptability
const LEAF_COLORS = [
    "rgba(76, 175, 80, 0.35)",   // green
    "rgba(139, 195, 74, 0.3)",   // light green
    "rgba(205, 220, 57, 0.25)",  // lime
    "rgba(255, 193, 7, 0.25)",   // amber
    "rgba(255, 152, 0, 0.2)",    // orange
    "rgba(121, 85, 72, 0.15)",   // brown
    "rgba(56, 142, 60, 0.3)",    // dark green
    "rgba(174, 213, 129, 0.25)", // pale green
];

interface Leaf {
    el: SVGSVGElement;
    baseX: number;
    speed: number;
    sway: number;
    rotSpeed: number;
    size: number;
    depth: number; // parallax depth 0-1
}

export default function FallingLeaves({ count = 22 }: { count?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const leavesRef = useRef<Leaf[]>([]);
    const mouseRef = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1
    const rafRef = useRef<number>(0);

    // track mouse position for parallax
    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current = {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // create leaf elements
        const leaves: Leaf[] = [];
        for (let i = 0; i < count; i++) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            const size = 12 + Math.random() * 24;
            svg.style.cssText = `position:absolute;width:${size}px;height:${size}px;pointer-events:none;will-change:transform;`;
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)]);
            path.setAttribute("fill", LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]);
            svg.appendChild(path);

            // add a vein line for realism
            const vein = document.createElementNS("http://www.w3.org/2000/svg", "line");
            vein.setAttribute("x1", "12"); vein.setAttribute("y1", "4");
            vein.setAttribute("x2", "12"); vein.setAttribute("y2", "18");
            vein.setAttribute("stroke", "rgba(0,0,0,0.08)"); vein.setAttribute("stroke-width", "0.5");
            svg.appendChild(vein);

            container.appendChild(svg);

            const baseX = Math.random() * 100;
            const depth = 0.3 + Math.random() * 0.7; // parallax depth

            leaves.push({
                el: svg,
                baseX,
                speed: 0.15 + Math.random() * 0.35, // fall speed
                sway: 30 + Math.random() * 60,       // horizontal sway amplitude
                rotSpeed: 20 + Math.random() * 80,    // rotation speed
                size,
                depth,
            });

            // stagger initial Y positions so they don't all start at top
            const startY = -10 - Math.random() * 110;
            gsap.set(svg, {
                x: `${baseX}vw`,
                y: startY,
                rotation: Math.random() * 360,
                opacity: 0,
            });

            // fade in with slight delay
            gsap.to(svg, {
                opacity: 0.6 + Math.random() * 0.4,
                duration: 1 + Math.random() * 2,
                delay: Math.random() * 3,
                ease: "power2.out",
            });
        }
        leavesRef.current = leaves;

        // animation loop
        let lastTime = performance.now();

        function animate(time: number) {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            for (const leaf of leavesRef.current) {
                // current transform
                const curY = gsap.getProperty(leaf.el, "y") as number;
                const curRot = gsap.getProperty(leaf.el, "rotation") as number;

                // new y — fall down
                let newY = curY + leaf.speed * dt * 60;

                // reset when off screen
                if (newY > vh + 30) {
                    newY = -leaf.size - Math.random() * 40;
                    leaf.baseX = Math.random() * 100;
                }

                // sway — sine wave based on y position
                const swayOffset = Math.sin(newY * 0.008 + leaf.baseX) * leaf.sway;

                // parallax — deeper leaves react more to mouse
                const parallaxX = (mx - 0.5) * leaf.depth * 80;
                const parallaxY = (my - 0.5) * leaf.depth * 30;

                // wind gust reaction from mouse x movement
                const windX = (mx - 0.5) * leaf.depth * 40;

                const finalX = (leaf.baseX / 100) * vw + swayOffset + parallaxX + windX;
                const finalY = newY + parallaxY;
                const finalRot = curRot + leaf.rotSpeed * dt;

                gsap.set(leaf.el, {
                    x: finalX,
                    y: finalY,
                    rotation: finalRot,
                    scale: 0.7 + leaf.depth * 0.3, // deeper = bigger
                });
            }

            rafRef.current = requestAnimationFrame(animate);
        }

        rafRef.current = requestAnimationFrame(animate);

        // listen for mouse
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            // clean up leaf svg elements
            for (const leaf of leavesRef.current) {
                leaf.el.remove();
            }
            leavesRef.current = [];
        };
    }, [count, handleMouseMove]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        />
    );
}
