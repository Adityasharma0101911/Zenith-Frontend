// canvas-based rain effect — mouse blocks rain like an umbrella, rain splashes on cursor
// theme-aware: reads data-mode to pick light/dark palette
"use client";

import { useEffect, useRef } from "react";

interface Drop {
    x: number;
    y: number;
    speed: number;
    length: number;
    opacity: number;
    deflected: boolean;
    deflectAngle: number;
    splashTimer: number;
    splashX: number;
    splashY: number;
}

const MOUSE_RADIUS = 80;
const SPLASH_DURATION = 10;

function isDarkMode(): boolean {
    return document.documentElement.getAttribute("data-mode") === "dark";
}

export default function RainEffect({ intensity = 220 }: { intensity?: number }) {
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

        const drops: Drop[] = [];
        for (let i = 0; i < intensity; i++) {
            drops.push(makeDrop(w, h, true));
        }

        function makeDrop(vw: number, vh: number, scatter = false): Drop {
            return {
                x: Math.random() * vw,
                y: scatter ? Math.random() * vh * -1.5 : -20 - Math.random() * 100,
                speed: 10 + Math.random() * 14,
                length: 12 + Math.random() * 22,
                opacity: 0.08 + Math.random() * 0.22,
                deflected: false,
                deflectAngle: 0,
                splashTimer: 0,
                splashX: 0,
                splashY: 0,
            };
        }

        function getColors() {
            const dark = isDarkMode();
            return {
                drop: dark ? "140, 180, 220" : "100, 140, 190",
                splash: dark ? "160, 200, 240" : "120, 160, 210",
                dropAlphaScale: dark ? 1.6 : 1,
                splashAlphaScale: dark ? 1.4 : 1,
            };
        }

        function animate() {
            ctx!.clearRect(0, 0, w, h);
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const colors = getColors();

            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];

                if (d.splashTimer > 0) {
                    drawSplash(ctx!, d, colors);
                    d.splashTimer--;
                    if (d.splashTimer <= 0) Object.assign(d, makeDrop(w, h));
                    continue;
                }

                const dx = d.x - mx;
                const dy = (d.y + d.length * 0.5) - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    if (dist < MOUSE_RADIUS * 0.25) {
                        d.splashTimer = SPLASH_DURATION;
                        d.splashX = d.x;
                        d.splashY = d.y;
                        continue;
                    }
                    const angle = Math.atan2(dy, dx);
                    d.deflected = true;
                    d.deflectAngle = angle;
                    d.x += Math.cos(angle) * 4;
                    d.y += d.speed * 0.4;
                } else {
                    d.deflected = false;
                    d.y += d.speed;
                }

                if (d.y > h + 30) Object.assign(d, makeDrop(w, h));

                const slant = d.deflected ? Math.cos(d.deflectAngle) * 3 : 0.8;
                const alpha = Math.min(d.opacity * colors.dropAlphaScale, 0.5);
                ctx!.beginPath();
                ctx!.moveTo(d.x, d.y);
                ctx!.lineTo(d.x + slant, d.y + d.length);
                ctx!.strokeStyle = `rgba(${colors.drop}, ${alpha})`;
                ctx!.lineWidth = 1.2;
                ctx!.lineCap = "round";
                ctx!.stroke();
            }

            rafRef.current = requestAnimationFrame(animate);
        }

        function drawSplash(c: CanvasRenderingContext2D, d: Drop, colors: ReturnType<typeof getColors>) {
            const progress = 1 - d.splashTimer / SPLASH_DURATION;
            const alpha = Math.min((1 - progress) * 0.35 * colors.splashAlphaScale, 0.6);
            const spread = 4 + progress * 18;
            const count = 5;

            for (let j = 0; j < count; j++) {
                const angle = (Math.PI * 2 * j) / count - Math.PI * 0.5;
                const px = d.splashX + Math.cos(angle) * spread;
                const py = d.splashY + Math.sin(angle) * spread * 0.5;
                c.beginPath();
                c.arc(px, py, 1.2 - progress * 0.6, 0, Math.PI * 2);
                c.fillStyle = `rgba(${colors.splash}, ${alpha})`;
                c.fill();
            }

            c.beginPath();
            c.arc(d.splashX, d.splashY, spread * 0.6, 0, Math.PI * 2);
            c.strokeStyle = `rgba(${colors.splash}, ${alpha * 0.5})`;
            c.lineWidth = 0.8;
            c.stroke();
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
    }, [intensity]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
