import { initParticlesEngine } from "@tsparticles/react";
// import { loadSlim } from "@tsparticles/slim";
import { loadFull } from "tsparticles";

let isInitialized = false;

export async function initParticles() {
    if (isInitialized) return;
    isInitialized = true;

    try {
        await initParticlesEngine(async (engine) => {
        // await loadSlim(engine);
        await loadFull(engine);
        console.log("tsParticles engine initialized");
        });
    } catch (err) {
        console.error("tsParticles init failed:", err);
    }
}