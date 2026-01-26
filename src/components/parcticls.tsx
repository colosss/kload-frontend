import Particles from "@tsparticles/react";

import { useCallback } from "react";
import { loadSlim } from "@tsparticles/slim";   // или loadFull из @tsparticles/all


export default function ParticlesBackground() {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
        // console.log("Particles initialized inside component");
    }, []);

    return (
        <Particles
        id="firefly"
        init={particlesInit}
        options={{
            fpsLimit: 60,
            fullScreen: { enable: true, zIndex: -1 },
            interactivity: {
            events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
                resize: { enable: true },
            },
            modes: {
                repulse: { distance: 120, duration: 0.4 },
                push: { quantity: 2 },
            },
            },
            particles: {
            number: {
                value: 240,
                density: { enable: true },
            },
            color: { value: "#ffd966" },
            opacity: {
                value: { min: 0.3, max: 0.8 },
                animation: { enable: true, speed: 1 },
            },
            size: { value: { min: 2, max: 4 } },
            move: {
                enable: true,
                speed: 0.6,
                outModes: { default: "bounce" },
            },
            },
            detectRetina: true,
        }}
        />
    );
}