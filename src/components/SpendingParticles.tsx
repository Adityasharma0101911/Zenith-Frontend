// interactive canvas particle flow for transactions
"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

export default function SpendingParticles({ trigger }: { trigger: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>();
    const [colors, setColors] = useState<string[]>(["0,107,94", "74,99,93", "66,98,120"]);

    // load actual theme colors once mounted
    useEffect(() => {
        const style = getComputedStyle(document.body);
        const p1 = style.getPropertyValue("--m3-primary").trim().replace(/ /g, ",");
        const p2 = style.getPropertyValue("--m3-secondary").trim().replace(/ /g, ",");
        const p3 = style.getPropertyValue("--m3-tertiary").trim().replace(/ /g, ",");
        if (p1) setColors([p1, p2, p3]);
    }, []);

    // emit particles on trigger change
    useEffect(() => {
        if (trigger === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // spawn a burst from the bottom center of the screen
        const startX = rect.width / 2;
        const startY = rect.height - 150;

        for (let i = 0; i < 60; i++) {
            particlesRef.current.push({
                x: startX + (Math.random() - 0.5) * 80,
                y: startY,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 20 - 10,
                life: 0,
                maxLife: 60 + Math.random() * 40,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 8
            });
        }
    }, [trigger, colors]);

    // main animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // update and draw particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // gravity
                p.vx *= 0.98; // friction
                p.life++;

                if (p.life >= p.maxLife) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                const progress = p.life / p.maxLife;
                const opacity = 1 - Math.pow(progress, 2);

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${opacity * 0.8})`;
                ctx.fill();
                ctx.restore();
            }

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
        />
    );
}
