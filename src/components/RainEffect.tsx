// canvas-based rain effect — mouse blocks rain like an umbrella, rain splashes on cursor
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
    splashTimer: number;  // >0 means splashing
    splashX: number;
    splashY: number;
}

const MOUSE_RADIUS = 80;
const SPLASH_DURATION = 10; // frames

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

        // create rain drops
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

        function animate() {
            ctx!.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];

                // handle splash animation
                if (d.splashTimer > 0) {
                    drawSplash(ctx!, d);
                    d.splashTimer--;
                    if (d.splashTimer <= 0) {
                        // reset drop
                        Object.assign(d, makeDrop(w, h));
                    }
                    continue;
                }

                // distance to mouse
                const dx = d.x - mx;
                const dy = (d.y + d.length * 0.5) - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    if (dist < MOUSE_RADIUS * 0.25) {
                        // splash on the mouse "shield"
                        d.splashTimer = SPLASH_DURATION;
                        d.splashX = d.x;
                        d.splashY = d.y;
                        continue;
                    }
                    // deflect — push sideways
                    const angle = Math.atan2(dy, dx);
                    d.deflected = true;
                    d.deflectAngle = angle;
                    d.x += Math.cos(angle) * 4;
                    d.y += d.speed * 0.4;
                } else {
                    d.deflected = false;
                    d.y += d.speed;
                }

                // reset when off screen
                if (d.y > h + 30) {
                    Object.assign(d, makeDrop(w, h));
                }

                // draw rain drop
                const slant = d.deflected ? Math.cos(d.deflectAngle) * 3 : 0.8; // slight wind slant + deflection
                ctx!.beginPath();
                ctx!.moveTo(d.x, d.y);
                ctx!.lineTo(d.x + slant, d.y + d.length);
                ctx!.strokeStyle = `rgba(174, 200, 235, ${d.opacity})`;
                ctx!.lineWidth = 1.2;
                ctx!.lineCap = "round";
                ctx!.stroke();
            }

            rafRef.current = requestAnimationFrame(animate);
        }

        function drawSplash(c: CanvasRenderingContext2D, d: Drop) {
            const progress = 1 - d.splashTimer / SPLASH_DURATION;
            const alpha = (1 - progress) * 0.35;
            const spread = 4 + progress * 18;
            const count = 5;

            for (let j = 0; j < count; j++) {
                const angle = (Math.PI * 2 * j) / count - Math.PI * 0.5; // fan upward
                const px = d.splashX + Math.cos(angle) * spread;
                const py = d.splashY + Math.sin(angle) * spread * 0.5; // flatten vertically
                c.beginPath();
                c.arc(px, py, 1.2 - progress * 0.6, 0, Math.PI * 2);
                c.fillStyle = `rgba(174, 210, 245, ${alpha})`;
                c.fill();
            }

            // central ring
            c.beginPath();
            c.arc(d.splashX, d.splashY, spread * 0.6, 0, Math.PI * 2);
            c.strokeStyle = `rgba(174, 210, 245, ${alpha * 0.5})`;
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
