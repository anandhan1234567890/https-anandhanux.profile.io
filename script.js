gsap.registerPlugin(ScrollTrigger);

// --- 3D Image Sequence Canvas Logic ---
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

const frameCount = 90; // 90 frames total (02 to 91)
const currentFrame = index => `frame_${(index + 2).toString().padStart(6, '0')}.webp`;

const images = [];
const frames = { frame: 0 };

// Preload all frames
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Draw the very first frame as soon as it loads to prevent blank screen
images[0].onload = render;

function render() {
    const frameIndex = Math.round(frames.frame);
    if (!images[frameIndex]) return;
    
    const img = images[frameIndex];
    if (img.complete) {
        drawImageCover(img);
    } else {
        img.onload = () => drawImageCover(img);
    }
}

// Perfect 'object-fit: cover' equivalent for Canvas with RIGHT alignment
function drawImageCover(img) {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio); // Max for 'cover', Min for 'contain'
    
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    
    let shiftX = (canvas.width - newWidth) / 2;
    const shiftY = (canvas.height - newHeight) / 2;
    
    // Shift the subject to the right side to leave the left clear for text
    if (window.innerWidth > 992) { shiftX += canvas.width * 0.25; } else { shiftX += canvas.width * 0.15; } 
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, img.width, img.height, shiftX, shiftY, newWidth, newHeight);
}

// GSAP ScrollTrigger for absolutely smooth scrubbing
gsap.to(frames, {
    frame: frameCount - 1,
    ease: "none", // Linear animation
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // 1 second lag for buttery smooth scrubbing
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



// Navigation Link Highlighting on Scroll
const navSections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".fn-link");

window.addEventListener("scroll", () => {
    let current = "";
    navSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 300)) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});