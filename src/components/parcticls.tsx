import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <Particles
      id="firefly"
      options={{
        fpsLimit: 60,
        fullScreen: { enable: true, zIndex: -1 },
        
        background: {
            image: "url('assets/kletka.svg')",
            repeat: "repeat",
            size: "10vw",
        },
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