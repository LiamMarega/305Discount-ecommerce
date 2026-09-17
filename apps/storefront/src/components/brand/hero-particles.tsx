'use client';

import {useEffect, useRef} from 'react';

/**
 * Lightweight connected-particle field for the hero. Capped count, paused when
 * off-screen, and disabled entirely under prefers-reduced-motion — ported from
 * the Easy Home prototype's app.js.
 */
export function HeroParticles() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isSmall = window.matchMedia('(max-width: 760px)').matches;
        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        const COUNT = isSmall ? 22 : 46;
        const maxDist = isSmall ? 110 : 150;
        const colors = ['rgba(248,145,90,', 'rgba(111,151,255,', 'rgba(255,255,255,'];
        let W = 0, H = 0, running = true, raf = 0, resizeT: number;
        let particles: {x: number; y: number; vx: number; vy: number; r: number; c: string; a: number}[] = [];

        function resize() {
            const rect = canvas!.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            canvas!.width = W * DPR;
            canvas!.height = H * DPR;
            ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        function make() {
            particles = Array.from({length: COUNT}, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.8 + 0.6,
                c: colors[Math.floor(Math.random() * colors.length)],
                a: Math.random() * 0.5 + 0.25,
            }));
        }
        function draw() {
            if (!running) return;
            ctx!.clearRect(0, 0, W, H);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx!.fillStyle = p.c + p.a + ')';
                ctx!.fill();
            }
            if (!isSmall) {
                for (let a = 0; a < particles.length; a++) {
                    for (let b = a + 1; b < particles.length; b++) {
                        const dx = particles[a].x - particles[b].x;
                        const dy = particles[a].y - particles[b].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < maxDist) {
                            ctx!.beginPath();
                            ctx!.moveTo(particles[a].x, particles[a].y);
                            ctx!.lineTo(particles[b].x, particles[b].y);
                            ctx!.strokeStyle = 'rgba(111,151,255,' + 0.1 * (1 - dist / maxDist) + ')';
                            ctx!.lineWidth = 1;
                            ctx!.stroke();
                        }
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        }

        resize();
        make();
        draw();

        const onResize = () => {
            clearTimeout(resizeT);
            resizeT = window.setTimeout(() => {
                resize();
                make();
            }, 200);
        };
        window.addEventListener('resize', onResize);

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting && !running) {
                        running = true;
                        draw();
                    } else if (!e.isIntersecting) {
                        running = false;
                    }
                });
            },
            {threshold: 0},
        );
        io.observe(canvas);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            io.disconnect();
        };
    }, []);

    return <canvas ref={ref} aria-hidden className="absolute inset-0 z-[1] size-full opacity-90" />;
}
