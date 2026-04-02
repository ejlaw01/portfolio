import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { vertexShader, fragmentShader } from "../shaders/crtShaders";
import data from "../../public/data.json";

interface CrtDisplayProps {
    className?: string;
    defaultImage?: string;
}

interface PanelProject {
    name: string;
    image: string;
    title: string;
    type: string;
    description: string;
    tech: string[];
    btnLink: { text: string; url: string } | null;
}

const WAVE_HEIGHT = 120;
const WAVE_PAD = 10;

function generateBottomWavePath() {
    const points: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
        const x = -WAVE_PAD + (i / steps) * (100 + WAVE_PAD * 2);
        const y = WAVE_HEIGHT / 2 - Math.sin((i / steps) * Math.PI * 3) * (WAVE_HEIGHT * 0.35);
        points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    // Fill below the curve
    return `${points.join(" ")} L ${100 + WAVE_PAD} ${WAVE_HEIGHT + WAVE_PAD} L -${WAVE_PAD} ${WAVE_HEIGHT + WAVE_PAD} Z`;
}

export const bottomWavePath = generateBottomWavePath();

function CrtDisplay({ className = "", defaultImage = "/img/work/projects_default.png" }: CrtDisplayProps) {
    const projects: PanelProject[] = data.work.projects
        .filter((p) => p.media?.filename)
        .map((p) => ({
            name: p.shortTitle || p.title,
            image: `/img/work/${p.media!.filename}`,
            title: p.title,
            type: p.type,
            description: p.description,
            tech: p.tech || [],
            btnLink: p.btnLink || null,
        }));

    const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 1024);
    const [activeProject, setActiveProject] = useState<number | null>(null);
    const [mobilePanelClosing, setMobilePanelClosing] = useState(false);
    const [pinned, setPinned] = useState(false);
    const pinnedRef = useRef(false);
    pinnedRef.current = pinned;
    const lastProjectRef = useRef<PanelProject>(projects[0]);
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const setDisplayImageRef = useRef<((src: string) => void) | null>(null);
    const triggerGlitchRef = useRef<(() => void) | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLUListElement>(null);
    const panelTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const prevProjectRef = useRef<number | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const mobilePanelTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const prevMobileProjectRef = useRef<number | null>(null);

    // Hide mobile panel on scroll (with animated close)
    useEffect(() => {
        if (activeProject === null) return;
        const handleScroll = () => {
            setMobilePanelClosing(true);
            setPinned(false);
            setTimeout(() => {
                setActiveProject(null);
                setMobilePanelClosing(false);
            }, 300);
        };
        window.addEventListener("scroll", handleScroll, { passive: true, once: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeProject]);

    const cancelClose = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        if (pinnedRef.current) return;
        cancelClose();
        closeTimeoutRef.current = setTimeout(() => {
            setActiveProject(null);
        }, 600);
    }, [cancelClose]);

    // Three.js setup effect (desktop only)
    useEffect(() => {
        if (isMobile) return;
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
        camera.position.set(0, 0.15, 1.4);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        scene.add(new THREE.AmbientLight(0xffffff, 1.5));

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
        dirLight.position.set(15, 10, -5);
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xddeeff, 0.8);
        fillLight.position.set(-10, 5, 10);
        scene.add(fillLight);

        const topLight = new THREE.PointLight(0xffffff, 3.5, 10);
        topLight.position.set(-5, -2.5, 0);
        topLight.decay = 0.8;
        scene.add(topLight);

        const monitorGroup = new THREE.Group();
        monitorGroup.position.y = 0.1;
        scene.add(monitorGroup);

        const textureLoader = new THREE.TextureLoader();
        const textureCache: Record<string, THREE.Texture> = {};
        const videoElements: HTMLVideoElement[] = [];
        const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".ogv"];

        function isVideo(src: string) {
            return VIDEO_EXTS.some((ext) => src.toLowerCase().endsWith(ext));
        }

        const displayMaterial = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: null },
                imageAspect: { value: 1 },
                planeAspect: { value: 1 },
                iResolution: { value: new THREE.Vector2(512, 512) },
                glitchIntensity: { value: 0.0 },
                time: { value: 0.0 },
            },
            vertexShader,
            fragmentShader,
        });

        function loadTexture(src: string) {
            if (textureCache[src]) return textureCache[src];

            if (isVideo(src)) {
                const video = document.createElement("video");
                video.src = src;
                video.crossOrigin = "anonymous";
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.preload = "auto";
                videoElements.push(video);

                const texture = new THREE.VideoTexture(video);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                textureCache[src] = texture;

                video.addEventListener("loadedmetadata", () => {
                    displayMaterial.uniforms.imageAspect.value = video.videoWidth / video.videoHeight;
                });

                return texture;
            }

            const texture = textureLoader.load(src, () => {
                displayMaterial.uniforms.imageAspect.value = texture.image.width / texture.image.height;
            });
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            textureCache[src] = texture;

            return texture;
        }

        const defaultTexture = loadTexture(defaultImage);
        displayMaterial.uniforms.map.value = defaultTexture;

        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        loader.load("/models/apple_ii_opt.glb", (gltf) => {
            const model = gltf.scene;
            let screenCenter: THREE.Vector3 | null = null;

            model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh && child.name === "screen") {
                    const mesh = child as THREE.Mesh;
                    screenCenter = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());

                    const size = new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3());
                    displayMaterial.uniforms.planeAspect.value = size.x / size.y;

                    mesh.material = displayMaterial;
                }
            });

            const center = screenCenter || new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
            model.position.sub(center);
            monitorGroup.add(model);
        });

        const mouse = { x: 0, y: 0 };
        const lerpedMouse = { x: 0, y: 0 };
        const timer = new THREE.Timer();

        let rafId: number;
        function animate() {
            rafId = requestAnimationFrame(animate);

            timer.update();
            displayMaterial.uniforms.time.value = timer.getElapsed();

            lerpedMouse.x = gsap.utils.interpolate(lerpedMouse.x, mouse.x, 0.05);
            lerpedMouse.y = gsap.utils.interpolate(lerpedMouse.y, mouse.y, 0.05);
            monitorGroup.rotation.x = lerpedMouse.y * 0.15;
            monitorGroup.rotation.y = lerpedMouse.x * 0.3;

            renderer.render(scene, camera);
        }

        animate();
        camera.position.z = Math.max(1.4, 768 / width);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
        };

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            camera.position.z = Math.max(1.4, 768 / w);
            monitorGroup.position.y = 0.1;
        };

        const glitchState = { intensity: 0 };
        let glitchAnimation: gsap.core.Tween | null = null;

        function setDisplayImage(src: string) {
            videoElements.forEach((v) => v.pause());

            const texture = loadTexture(src);
            displayMaterial.uniforms.map.value = texture;

            if (isVideo(src) && texture.image instanceof HTMLVideoElement) {
                texture.image.currentTime = 0;
                texture.image.play();
            }

            if (glitchAnimation) glitchAnimation.kill();
            glitchState.intensity = 1.0;

            glitchAnimation = gsap.to(glitchState, {
                intensity: 0,
                duration: 0.75,
                ease: "power3.out",
                onUpdate() {
                    displayMaterial.uniforms.glitchIntensity.value = glitchState.intensity;
                },
            });

            if (isVideo(src)) {
                const video = texture.image as HTMLVideoElement;
                if (video.videoWidth) {
                    displayMaterial.uniforms.imageAspect.value = video.videoWidth / video.videoHeight;
                }
            } else if (texture.image) {
                const img = texture.image as HTMLImageElement;
                if (img.width) {
                    displayMaterial.uniforms.imageAspect.value = img.width / img.height;
                }
            }
        }

        // Store setDisplayImage in ref so React effects can call it
        setDisplayImageRef.current = setDisplayImage;
        triggerGlitchRef.current = () => {
            if (glitchAnimation) glitchAnimation.kill();
            glitchState.intensity = 1.0;
            glitchAnimation = gsap.to(glitchState, {
                intensity: 0,
                duration: 0.75,
                ease: "power3.out",
                onUpdate() {
                    displayMaterial.uniforms.glitchIntensity.value = glitchState.intensity;
                },
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            container.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            if (glitchAnimation) glitchAnimation.kill();
            videoElements.forEach((v) => {
                v.pause();
                v.src = "";
            });
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            setDisplayImageRef.current = null;
            cancelClose();
        };
    }, [defaultImage, cancelClose, isMobile]);

    // Texture swap effect — watches activeProject
    useEffect(() => {
        if (!setDisplayImageRef.current) return;
        if (activeProject !== null) {
            setDisplayImageRef.current(projects[activeProject].image);
        } else {
            setDisplayImageRef.current(defaultImage);
        }
    }, [activeProject, defaultImage, projects]);

    // Keep lastProjectRef in sync so panel always has content to show
    if (activeProject !== null) {
        lastProjectRef.current = projects[activeProject];
    }

    // Panel animation effect
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const prev = prevProjectRef.current;
        const children = panel.querySelectorAll(
            ".panel-type, .panel-title, .panel-divider, .panel-desc, .panel-tags, .panel-cta",
        );

        // Kill any running timeline and reset stale transforms
        if (panelTimelineRef.current) {
            panelTimelineRef.current.kill();
        }

        if (activeProject !== null && prev === null) {
            // Panel open: fade in gradient, then stagger children
            gsap.set(panel, { opacity: 0, visibility: "visible" });
            gsap.set(children, { y: 20, opacity: 0 });
            const tl = gsap.timeline();
            tl.to(panel, { opacity: 1, duration: 0.4, ease: "power2.out" });
            tl.to(children, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" }, "-=0.2");
            panelTimelineRef.current = tl;
        } else if (activeProject !== null && prev !== null && activeProject !== prev) {
            // Project swap: ensure panel is visible, restagger text
            gsap.set(panel, { opacity: 1, visibility: "visible" });
            gsap.set(children, { y: 12, opacity: 0 });
            const tl = gsap.timeline();
            tl.to(children, { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" });
            panelTimelineRef.current = tl;
        } else if (activeProject === null && prev !== null) {
            // Panel close: stagger children out, then fade out gradient
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(panel, { visibility: "hidden" });
                },
            });
            tl.to(children, {
                y: -20,
                opacity: 0,
                duration: 0.3,
                stagger: 0.04,
                ease: "power2.in",
            });
            tl.to(panel, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.15");
            panelTimelineRef.current = tl;
        }

        prevProjectRef.current = activeProject;
    }, [activeProject]);

    // Mobile panel content fade on project swap
    useEffect(() => {
        const panel = mobilePanelRef.current;
        if (!panel) return;

        const prev = prevMobileProjectRef.current;
        const children = panel.querySelectorAll(".mobile-panel-content > *");

        if (mobilePanelTimelineRef.current) {
            mobilePanelTimelineRef.current.kill();
        }

        if (activeProject !== null && prev !== null && activeProject !== prev) {
            gsap.set(children, { opacity: 0, y: 8 });
            const tl = gsap.timeline();
            tl.to(children, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: "power2.out" });
            mobilePanelTimelineRef.current = tl;
        }

        prevMobileProjectRef.current = activeProject;
    }, [activeProject]);

    // Preload all project images
    useEffect(() => {
        projects.forEach((p) => {
            const img = new Image();
            img.src = p.image;
        });
    }, [projects]);

    const displayProject = lastProjectRef.current;

    return (
        <div
            ref={containerRef}
            id="work-section"
            className={`relative w-full h-[100svh] overflow-hidden ${className}`}
            onClick={(e) => {
                const target = e.target as Node;
                if (panelRef.current?.contains(target) || buttonsRef.current?.contains(target)) return;
                triggerGlitchRef.current?.();
                if (activeProject === null) return;
                setPinned(false);
                cancelClose();
                setActiveProject(null);
            }}
        >
            {/* Mobile static image fallback (no Three.js) */}
            {isMobile && (
                <div className="lg:hidden absolute inset-0 flex items-center justify-center p-8 pt-12">
                    <div className="relative max-w-[90%] max-h-[55%]">
                        <img
                            src="/img/apple_iie.png"
                            alt=""
                            className="w-full h-full object-contain"
                        />
                        {/* Screen overlay — positioned over the monitor's screen area */}
                        <div className="absolute rounded-[3px] overflow-hidden" style={{ left: "21.5%", top: "9.5%", width: "37%", height: "45%" }}>
                            <img
                                src={activeProject !== null ? projects[activeProject].image : defaultImage}
                                alt={activeProject !== null ? projects[activeProject].title : "Projects"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-in panel */}
            <div
                ref={panelRef}
                className="hidden lg:flex absolute left-0 top-0 h-full w-[30%] z-10 flex-col justify-center px-8 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent"
                style={{ visibility: "hidden", opacity: 0 }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
            >
                <span className="panel-type font-sans text-xs uppercase tracking-widest text-pink-300 mb-2">
                    <span className="text-background-dark">{displayProject.type}</span>
                </span>
                <h3 className="panel-title font-serif text-3xl font-bold text-pink-100 mb-3">
                    <span className="text-background-dark">{displayProject.title}</span>
                </h3>
                <hr className="panel-divider w-12 border-pink-400 mb-4" />
                <p className="panel-desc font-sans text-sm text-pink-200 leading-relaxed mb-5">
                    <span className="text-background-dark">{displayProject.description}</span>
                </p>
                <div className="panel-tags flex flex-wrap gap-2 mb-6">
                    {displayProject.tech.map((tag) => (
                        <span
                            key={tag}
                            className="bg-pink-300/40 text-pink-100 text-xs font-sans px-3 py-1 rounded-full border border-pink-300/50"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                {displayProject.btnLink && (
                    <a
                        href={displayProject.btnLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="panel-cta pointer-events-auto inline-flex items-center gap-2 font-sans text-sm font-medium text-white bg-pink-500/80 border border-pink-400/50 px-4 py-2 rounded hover:bg-pink-400/80 hover:no-underline transition-colors w-fit"
                    >
                        {displayProject.btnLink.text}
                        <span aria-hidden="true">&rarr;</span>
                    </a>
                )}
            </div>

            {/* Mobile top panel — portaled to body to escape stacking context */}
            {createPortal(
                <div
                    ref={mobilePanelRef}
                    className={`lg:hidden fixed top-0 left-0 right-0 z-[200] bg-[#121212]/85 backdrop-blur-sm border-b border-pink-400/30 px-5 py-4 transition-all duration-300 ease-out ${activeProject !== null && !mobilePanelClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}
                >
                    <div className="mobile-panel-content">
                        <span className="font-sans text-xs uppercase tracking-widest text-pink-300 mb-1 block">
                            {displayProject.type}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-pink-100 mb-1">{displayProject.title}</h3>
                        <p className="font-sans text-xs text-pink-200 leading-relaxed mb-2">
                            {displayProject.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {displayProject.tech.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-pink-300/40 text-pink-100 text-[10px] font-sans px-2 py-0.5 rounded-full border border-pink-300/50"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {displayProject.btnLink && (
                            <a
                                href={displayProject.btnLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-sans text-xs font-medium text-white bg-pink-500/80 border border-pink-400/50 px-3 py-1.5 rounded hover:bg-pink-400/80 transition-colors w-fit"
                            >
                                {displayProject.btnLink.text}
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        )}
                    </div>
                </div>,
                document.body,
            )}

            {/* Project buttons */}
            <ul
                ref={buttonsRef}
                className="absolute left-1/2 bottom-16 -translate-x-1/2 w-full flex justify-center gap-2 list-none z-20 flex-wrap px-4 lg:px-0"
            >
                {projects.map((project, i) => (
                    <li
                        key={i}
                        className={`uppercase font-sans text-xs xl:text-sm 3xl:text-lg font-medium px-4 py-2 xl:px-5 xl:py-2.5 3xl:px-8 3xl:py-3.5 border border-pink-300 shadow-[4px_4px_0px_-1px_theme(colors.pink.400)] cursor-pointer transition-colors ${
                            pinned && activeProject === i
                                ? "text-white bg-pink-800"
                                : "text-pink-800 bg-pink-50 hover:text-pink-900 hover:bg-pink-200"
                        }`}
                        onMouseEnter={() => {
                            if (!isMobile) {
                                cancelClose();
                                if (!pinnedRef.current) {
                                    setActiveProject(i);
                                }
                            }
                        }}
                        onMouseLeave={() => {
                            if (!isMobile) scheduleClose();
                        }}
                        onClick={() => {
                            if (pinned && activeProject === i) {
                                setPinned(false);
                                if (isMobile) {
                                    setActiveProject(null);
                                } else {
                                    scheduleClose();
                                }
                            } else {
                                setPinned(true);
                                setActiveProject(i);
                            }
                        }}
                    >
                        {project.name}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default CrtDisplay;
