// canvas-based wind effect — horizontal streaks and drifting particles
"use client";

import { useEffect, useRef } from "react";

interface Streak {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
    thickness: number;
}

interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    drift: number;      // vertical drift
    phase: number;       // sine phase for undulation
    phaseSpeed: number;
}

export default function WindEffect({
    streakCount = 35,
    particleCount = 50,
}: {
    streakCount?: number;
    particleCount?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = window.innerWidth;
        let h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.scale(dpr, dpr);

        // wind direction: mainly left-to-right with slight downward
        const windAngle = Math.random() > 0.5 ? 0 : Math.PI; // random direction
        const windDirX = Math.cos(windAngle);

        // create streaks — long horizontal lines
        const streaks: Streak[] = [];
        for (let i = 0; i < streakCount; i++) {
            streaks.push(makeStreak(w, h, true));
        }
        function makeStreak(vw: number, vh: number, scatter = false): Streak {
            return {
                x: scatter ? Math.random() * vw * 1.5 - vw * 0.25 : (windDirX > 0 ? -200 : vw + 200),
                y: Math.random() * vh,
                length: 40 + Math.random() * 120,
                speed: 3 + Math.random() * 8,
                opacity: 0.03 + Math.random() * 0.08,
                thickness: 0.5 + Math.random() * 1.5,
            };
        }

        // create particles — small dots drifting with wind
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(makeParticle(w, h, true));
        }
        function makeParticle(vw: number, vh: number, scatter = false): Particle {
            return {
                x: scatter ? Math.random() * vw : (windDirX > 0 ? -20 : vw + 20),
                y: Math.random() * vh,
                size: 1 + Math.random() * 3,
                speed: 1.5 + Math.random() * 4,
                opacity: 0.05 + Math.random() * 0.15,
                drift: (Math.random() - 0.5) * 0.5,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: 0.01 + Math.random() * 0.03,
            };
        }

        const MOUSE_RADIUS = 100;
        const VORTEX_STRENGTH = 3;

        function animate() {
            ctx!.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // draw streaks
            for (const s of streaks) {
                s.x += s.speed * windDirX;

                // mouse vortex — slight curve near mouse
                const dx = s.x + s.length * 0.5 - mx;
                const dy = s.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                let curveY = 0;
                if (dist < MOUSE_RADIUS && dist > 0) {
                    curveY = (dy / dist) * VORTEX_STRENGTH * (1 - dist / MOUSE_RADIUS);
                    s.y += curveY * 0.5;
                }

                // reset when off screen
                const offRight = windDirX > 0 && s.x > w + 50;
                const offLeft = windDirX < 0 && s.x + s.length < -50;
                if (offRight || offLeft) {
                    Object.assign(s, makeStreak(w, h));
                }

                // draw
                ctx!.beginPath();
                ctx!.moveTo(s.x, s.y);
                ctx!.lineTo(s.x + s.length * windDirX, s.y + curveY * 2);
                ctx!.strokeStyle = `rgba(160, 175, 195, ${s.opacity})`;
                ctx!.lineWidth = s.thickness;
                ctx!.lineCap = "round";
                ctx!.stroke();
            }

            // draw particles
            for (const p of particles) {
                p.x += p.speed * windDirX;
                p.phase += p.phaseSpeed;
                p.y += p.drift + Math.sin(p.phase) * 0.3;

                // mouse turbulence
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    // swirl around mouse
                    const perpX = -dy / dist;
                    const perpY = dx / dist;
                    const swirlForce = (1 - dist / MOUSE_RADIUS) * VORTEX_STRENGTH;
                    p.x += perpX * swirlForce;
                    p.y += perpY * swirlForce;
                }

                // reset when off screen
                const offRight = windDirX > 0 && p.x > w + 20;
                const offLeft = windDirX < 0 && p.x < -20;
                if (offRight || offLeft || p.y < -20 || p.y > h + 20) {
                    Object.assign(p, makeParticle(w, h));
                }

                // draw
                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(160, 180, 200, ${p.opacity})`;
                ctx!.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        }

        rafRef.current = requestAnimationFrame(animate);

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        window.addEventListener("mousemove", handleMouse);
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("mousemove", handleMouse);
            window.removeEventListener("resize", handleResize);
        };
    }, [streakCount, particleCount]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
