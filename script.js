gsap.registerPlugin(ScrollTrigger);

// --- 3D Image Sequence Canvas Logic ---
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}
window.addEventListener("resize", resizeCanvas);

const frameCount = 99; // frame_000002 to frame_000100
const currentFrame = index => (
    `frames/frame_${(index + 2).toString().padStart(6, '0')}.webp`
);

const images = [];
const frames = { frame: 0 };

// Preload
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

function render() {
    if (!images[frames.frame]) return;
    const img = images[frames.frame];
    if(img.complete) drawImage(img);
    else img.onload = () => drawImage(img);
}

function drawImage(img) {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    
    // Default center shift
    let centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    // Shift the image to the right so the face doesn't overlap the left-aligned text
    // We add an offset (e.g., 20% of the screen width)
    centerShift_x += canvas.width * 0.20; 
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

resizeCanvas();

// Animate frame sequence on scroll
gsap.to(frames, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom", // Matches full page scroll length
        scrub: 0.5,
    },
    onUpdate: render
});
// --- End Image Sequence Logic ---

// 1. Initial Hero Animation
const tl = gsap.timeline();

tl.from(".main-header, .floating-nav-wrapper", {
    y: -20,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
})
.from(".hero-greeting", {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.5")
.from(".hero-text .solid-text, .hero-text .outline-text", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out"
}, "-=0.8")
.from(".tag-anim", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    clearProps: "all"
}, "-=0.8");


// 2. Parallax effect for the background glows
gsap.to(".bg-glow", {
    yPercent: 50,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// 3. Scroll Reveal for Content Sections
const sections = gsap.utils.toArray('.content-section');

sections.forEach((section) => {
    
    // Title reveal
    gsap.from(section.querySelector(".section-title"), {
        x: -30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 85%",
        }
    });

    // Text reveal
    const texts = section.querySelectorAll(".section-text");
    if(texts.length > 0) {
        gsap.from(texts, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            }
        });
    }

    // Experience Blocks, Skill Cards, Project Cards, and Timeline Items
    const blocks = section.querySelectorAll(".experience-block, .bento-card, .exp-timeline-item, .new-skill-card, .about-card, .edu-card");
    if(blocks.length > 0) {
        gsap.from(blocks, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            }
        });
    }

    // Skill Cards
    const cards = section.querySelectorAll(".skill-card");
    if(cards.length > 0) {
        gsap.from(cards, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.2)", // slight pop effect
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Sound Toggle Logic
    const soundBtn = document.getElementById("sound-btn");
    const bgAudio = document.getElementById("bg-audio");
    let isPlaying = false;

    if(soundBtn && bgAudio) {
        bgAudio.volume = 0.3; // Set ambient volume low

        soundBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if(isPlaying) {
                bgAudio.pause();
                soundBtn.innerHTML = "<i class=\"fa-solid fa-volume-xmark\"></i>";
            } else {
                bgAudio.play().catch(e => console.log("Audio play failed:", e));
                soundBtn.innerHTML = "<i class=\"fa-solid fa-volume-high\"></i>";
            }
            isPlaying = !isPlaying;
        });
    }
});

