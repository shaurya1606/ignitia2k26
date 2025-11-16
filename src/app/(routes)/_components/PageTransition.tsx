"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

const BLOCK_COUNT = 20;
const BLOCK_STAGGER = 0.05;

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathName = usePathname();
    const overlayRef = useRef<HTMLDivElement>(null);
    const blockRefs = useRef<HTMLDivElement[]>([]);
    const isTransitioning = useRef(false);
    const introPlayed = useRef(false);

    const setScrollLock = (locked: boolean) => {
        if (typeof document === "undefined") return;
        const value = locked ? "hidden" : "";
        document.documentElement.style.overflow = value;
        document.body.style.overflow = value;
    };

    // Rebuild the overlay stripes every time to keep their DOM order deterministic.
    const buildBlocks = () => {
        if (!overlayRef.current) return;

        overlayRef.current.innerHTML = "";
        blockRefs.current = [];

        for (let i = 0; i < BLOCK_COUNT; i++) {
            const block = document.createElement("div");
            block.className = "flex-1 h-full bg-[linear-gradient(180deg,var(--background),oklch(0.2_0_0))] transform origin-left scale-x-0";
            overlayRef.current.appendChild(block);
            blockRefs.current.push(block);
        }
    };

    // On route change: peel blocks left (same as initial load), then route to new page.
    const coverPage = useCallback(
        (url: string) => {
            const tl = gsap.timeline({
                defaults: { ease: "power1.inOut" },
            });

            setScrollLock(true);

            tl.set(blockRefs.current, { scaleX: 0, transformOrigin: "left" })
                .to(blockRefs.current, {
                    scaleX: 1,
                    duration: 0.8,
                    stagger: BLOCK_STAGGER,
                    transformOrigin: "left",
                })
                .to({}, { duration: 0.1 })
                .add(() => {
                    router.push(url);
                });
        },
        [router]
    );

    // Intercept in-app anchor clicks so we can play the exit animation first.
    const attachLinkListeners = useCallback(() => {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));
        const cleanups: Array<() => void> = [];

        links.forEach((link) => {
            const handleClick = (event: Event) => {
                const target = event.currentTarget as HTMLAnchorElement;
                const url = new URL(target.href, window.location.origin);

                const isExternal = url.origin !== window.location.origin || target.target === "_blank";
                if (isExternal) {
                    return;
                }

                if (url.pathname === pathName || isTransitioning.current) {
                    return;
                }

                event.preventDefault();
                isTransitioning.current = true;
                setScrollLock(true);
                coverPage(url.pathname);
            };

            link.addEventListener("click", handleClick);
            cleanups.push(() => link.removeEventListener("click", handleClick));
        });

        return () => cleanups.forEach((fn) => fn());
    }, [coverPage, pathName]);

    // Rebuild the overlay stripes every time to keep their DOM order deterministic.
    const buildBlocks = () => {
        if (!overlayRef.current) return;

        overlayRef.current.innerHTML = "";
        blockRefs.current = [];

        for (let i = 0; i < BLOCK_COUNT; i++) {
            const block = document.createElement("div");
            block.className = "flex-1 h-full bg-[linear-gradient(180deg,var(--background),oklch(0.2_0_0))] transform origin-left scale-x-0";
            overlayRef.current.appendChild(block);
            blockRefs.current.push(block);
        }
    };

    // On route change: peel blocks left (same as initial load), then route to new page.
    const coverPage = (url: string) => {
        const tl = gsap.timeline({
            defaults: { ease: "power1.inOut" },
        });

        setScrollLock(true);

        tl.set(blockRefs.current, { scaleX: 0, transformOrigin: "left" })
            .to(blockRefs.current, {
                scaleX: 1,
                duration: 0.8,
                stagger: BLOCK_STAGGER,
                transformOrigin: "left",
            })
            .to({}, { duration: 0.1 })
            .add(() => {
                router.push(url);
            });
    };

    // On first load: peel the blocks toward the left to reveal the content.
    const playIntro = useCallback(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
                isTransitioning.current = false;
                setScrollLock(false);
            },
        });

        isTransitioning.current = true;
        setScrollLock(true);

        tl.set(blockRefs.current, { scaleX: 1, transformOrigin: "left" })
            .to(blockRefs.current, {
                scaleX: 0,
                duration: 0.6,
                stagger: BLOCK_STAGGER,
                transformOrigin: "left",
            });
    }, []);
    // Reveal after navigation: peel blocks right→left and re-enable interactions.

    useEffect(() => {
        buildBlocks();
        if (!introPlayed.current) {
            playIntro();
            introPlayed.current = true;
        }

        const cleanup = attachLinkListeners();
        return () => cleanup();
    }, [attachLinkListeners, pathName, playIntro]);

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 w-screen h-screen flex gap-0.5 z-999 pointer-events-none bg-transparent mix-blend-normal"
            />
            {children}
        </>
    );
};

export default PageTransition;