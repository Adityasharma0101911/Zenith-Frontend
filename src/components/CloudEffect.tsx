// canvas-based cloud effect — soft blobs that dissolve where mouse hovers and regenerate
// theme-aware: reads data-mode to pick light/dark palette
"use client";

import { useEffect, useRef } from "react";

function isDarkMode(): boolean {
    return document.documentElement.getAttribute("data-mode") === "dark";
}

interface Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    baseAlpha: number;
    alpha: number;          // current alpha (lowered near mouse)
    blobs: Blob[];          // sub-ellipses that make up the cloud
}

interface Blob {
    ox: number;   // offset from cloud center
    oy: number;
    rx: number;   // radius x
    ry: number;   // radius y
}

const MOUSE_RADIUS = 130;
const FADE_SPEED = 0.04;      // how fast clouds fade near mouse
const REGEN_SPEED = 0.012;    // how fast clouds regenerate

export default function CloudEffect({ count = 12 }: { count?: number }) {
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

        // create clouds — spread across viewport
        const clouds: Cloud[] = [];
        for (let i = 0; i < count; i++) {
            clouds.push(makeCloud(w, h, true));
        }

        function makeCloud(vw: number, vh: number, scatter = false): Cloud {
            const cw = 120 + Math.random() * 200;
            const ch = 40 + Math.random() * 60;
            const baseAlpha = 0.04 + Math.random() * 0.1;

            // generate 3-6 overlapping ellipses to form cloud shape
            const blobCount = 3 + Math.floor(Math.random() * 4);
            const blobs: Blob[] = [];
            for (let j = 0; j < blobCount; j++) {
                blobs.push({
                    ox: (Math.random() - 0.5) * cw * 0.7,
                    oy: (Math.random() - 0.5) * ch * 0.5,
                    rx: 30 + Math.random() * 60,
                    ry: 18 + Math.random() * 30,
                });
            }

            return {
                x: scatter ? Math.random() * (vw + cw) - cw * 0.5 : -cw - Math.random() * 200,
                y: Math.random() * vh * 0.7 + vh * 0.05,  // clouds mostly in upper portion
                width: cw,
                height: ch,
                speed: 0.15 + Math.random() * 0.4,
                baseAlpha,
                alpha: baseAlpha,
                blobs,
            };
        }

        function animate() {
            ctx!.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (const cloud of clouds) {
                cloud.x += cloud.speed;

                // reset when off right edge
                if (cloud.x > w + cloud.width) {
                    Object.assign(cloud, makeCloud(w, h));
                    cloud.x = -cloud.width - Math.random() * 100;
                }

                // check distance from mouse to cloud center
                const cx = cloud.x + cloud.width * 0.5;
                const cy = cloud.y;
                const dx = cx - mx;
                const dy = cy - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // dissolve near mouse, regenerate when far
                if (dist < MOUSE_RADIUS + cloud.width * 0.3) {
                    const proximity = 1 - Math.min(dist / (MOUSE_RADIUS + cloud.width * 0.3), 1);
                    const targetAlpha = cloud.baseAlpha * (1 - proximity);
                    cloud.alpha += (targetAlpha - cloud.alpha) * FADE_SPEED * 3;
                } else {
                    // regenerate — fade back to base alpha
                    cloud.alpha += (cloud.baseAlpha - cloud.alpha) * REGEN_SPEED;
                }

                // don't draw if invisible
                if (cloud.alpha < 0.002) continue;

                // draw cloud blobs
                for (const blob of cloud.blobs) {
                    const bx = cloud.x + cloud.width * 0.5 + blob.ox;
                    const by = cloud.y + blob.oy;

                    // per-blob mouse distance for finer dissolving
                    const blobDist = Math.sqrt((bx - mx) ** 2 + (by - my) ** 2);
                    let blobAlpha = cloud.alpha;
                    if (blobDist < MOUSE_RADIUS) {
                        blobAlpha *= Math.max(0, blobDist / MOUSE_RADIUS);
                    }

                    if (blobAlpha < 0.002) continue;

                    const dark = isDarkMode();
                    const cloudRgb = dark ? "80, 100, 130" : "180, 195, 210";
                    const finalAlpha = dark ? blobAlpha * 2.5 : blobAlpha;

                    ctx!.beginPath();
                    ctx!.ellipse(bx, by, blob.rx, blob.ry, 0, 0, Math.PI * 2);
                    ctx!.fillStyle = `rgba(${cloudRgb}, ${Math.min(finalAlpha, 0.35)})`;
                    ctx!.fill();
                }
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
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
