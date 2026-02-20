// physics-based falling leaves — mouse acts as a solid circle that pushes leaves
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LEAF_PATHS = [
    "M12 2C6.5 2 2 8 2 14c0 4 3 8 10 8s10-4 10-8C22 8 17.5 2 12 2z",
    "M12 1L9 6L3 5L6 10L1 14L7 14L8 20L12 16L16 20L17 14L23 14L18 10L21 5L15 6L12 1z",
    "M12 0C10 4 4 8 2 14c-1 3 1 6 4 7 2 1 4 0 6-2 2 2 4 3 6 2 3-1 5-4 4-7C20 8 14 4 12 0z",
    "M12 3C8 3 4 7 4 12s4 9 8 9 8-4 8-9S16 3 12 3z",
    "M12 1C10 4 7 5 5 8c-1 2 0 4 1 5 0 2-1 4 0 6 1 2 3 3 5 3s4-1 5-3c1-2 0-4 0-6 1-1 2-3 1-5C15 5 14 4 12 1z",
];

const LEAF_COLORS = [
    "rgba(76, 175, 80, 0.4)",
    "rgba(139, 195, 74, 0.35)",
    "rgba(205, 220, 57, 0.3)",
    "rgba(255, 193, 7, 0.3)",
    "rgba(255, 152, 0, 0.25)",
    "rgba(121, 85, 72, 0.2)",
    "rgba(56, 142, 60, 0.35)",
    "rgba(174, 213, 129, 0.3)",
];

interface LeafState {
    el: SVGSVGElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseSpeed: number;
    sway: number;
    swayPhase: number;
    rotation: number;
    rotSpeed: number;
    size: number;
    depth: number;
}

const MOUSE_RADIUS = 75;
const PUSH_FORCE = 12;
const DAMPING = 0.94;

export default function FallingLeaves({ count = 38 }: { count?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const leavesRef = useRef<LeafState[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const leaves: LeafState[] = [];

        for (let i = 0; i < count; i++) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            const size = 14 + Math.random() * 22;
            svg.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;will-change:transform;opacity:0;`;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)]);
            path.setAttribute("fill", LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]);
            svg.appendChild(path);

            const vein = document.createElementNS("http://www.w3.org/2000/svg", "line");
            vein.setAttribute("x1", "12"); vein.setAttribute("y1", "4");
            vein.setAttribute("x2", "12"); vein.setAttribute("y2", "18");
            vein.setAttribute("stroke", "rgba(0,0,0,0.08)"); vein.setAttribute("stroke-width", "0.5");
            svg.appendChild(vein);

            container.appendChild(svg);

            const depth = 0.3 + Math.random() * 0.7;

            leaves.push({
                el: svg,
                x: Math.random() * vw,
                y: -Math.random() * vh * 1.2 - 40,
                vx: 0,
                vy: 0,
                baseSpeed: 0.3 + Math.random() * 0.5,
                sway: 0.3 + Math.random() * 0.7,
                swayPhase: Math.random() * Math.PI * 2,
                rotation: Math.random() * 360,
                rotSpeed: 20 + Math.random() * 60,
                size,
                depth,
            });

            // fade in
            gsap.to(svg, {
                opacity: 0.5 + Math.random() * 0.5,
                duration: 1 + Math.random() * 2,
                delay: Math.random() * 2.5,
                ease: "power2.out",
            });
        }
        leavesRef.current = leaves;

        let lastTime = performance.now();

        function animate(time: number) {
            const dt = Math.min((time - lastTime) / 16.67, 3);
            lastTime = time;

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const cw = window.innerWidth;
            const ch = window.innerHeight;

            for (const leaf of leavesRef.current) {
                // gravity — fall down
                leaf.vy += leaf.baseSpeed * 0.08 * dt;

                // sway — sine oscillation
                leaf.swayPhase += 0.015 * dt;
                leaf.vx += Math.sin(leaf.swayPhase) * leaf.sway * 0.06 * dt;

                // mouse collision — solid circle pushes leaves
                const dx = leaf.x + leaf.size / 2 - mx;
                const dy = leaf.y + leaf.size / 2 - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS && dist > 0.1) {
                    const overlap = MOUSE_RADIUS - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    // stronger push the closer the leaf is
                    const force = (overlap / MOUSE_RADIUS) * PUSH_FORCE * dt;
                    leaf.vx += nx * force;
                    leaf.vy += ny * force;
                    // also nudge position directly for solid collision feel
                    leaf.x += nx * overlap * 0.3;
                    leaf.y += ny * overlap * 0.3;
                }

                // damping
                leaf.vx *= Math.pow(DAMPING, dt);
                leaf.vy *= Math.pow(DAMPING, dt);

                // terminal velocity
                if (leaf.vy > leaf.baseSpeed * 5) leaf.vy = leaf.baseSpeed * 5;

                // update position
                leaf.x += leaf.vx * dt;
                leaf.y += leaf.vy * dt;

                // rotation — influenced by horizontal velocity
                leaf.rotation += (leaf.rotSpeed + Math.abs(leaf.vx) * 10) * dt * 0.05;

                // wrap — reset when off screen
                if (leaf.y > ch + 50) {
                    leaf.y = -leaf.size - Math.random() * 80;
                    leaf.x = Math.random() * cw;
                    leaf.vx = 0;
                    leaf.vy = 0;
                }
                if (leaf.x < -60) leaf.x = cw + 30;
                if (leaf.x > cw + 60) leaf.x = -30;

                // apply transform (direct style for perf)
                const s = 0.7 + leaf.depth * 0.3;
                leaf.el.style.transform = `translate3d(${leaf.x}px,${leaf.y}px,0) rotate(${leaf.rotation}deg) scale(${s})`;
            }

            rafRef.current = requestAnimationFrame(animate);
        }

        rafRef.current = requestAnimationFrame(animate);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const handleResize = () => {
            // no-op, leaves auto-wrap
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            for (const leaf of leavesRef.current) leaf.el.remove();
            leavesRef.current = [];
        };
    }, [count]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        />
    );
}
