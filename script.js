// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Toggle theme when clicking the theme button
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Update icon and save preference
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Add smooth scroll behavior for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
});

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navLinkAnchors = document.querySelectorAll('.nav-links a');
    
    // Toggle menu when burger is clicked
    burger.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Toggle burger animation
        burger.classList.toggle('toggle');
    });
    
    // Close menu when clicking on navigation links
    navLinkAnchors.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            
            // Reset animations
            navLinks.forEach(navLink => {
                navLink.style.animation = '';
            });
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            
            // Reset animations
            navLinks.forEach(navLink => {
                navLink.style.animation = '';
            });
        }
    });
});

// Optimize Three.js for mobile devices
function isLowPowerDevice() {
    // Check if on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // Or check if viewport is small
    const isSmallScreen = window.innerWidth < 768;
    return isMobile || isSmallScreen;
}

// Create stars with optimized settings for device
function createStars(scene) {
    const starGeometry = new THREE.BufferGeometry();
    
    // Determine if device is low power
    const isLowPower = isLowPowerDevice();
    
    // Adjust particle count and size based on device capability
    const particleCount = isLowPower ? 2000 : 5000;
    const particleSize = isLowPower ? 1.5 : 2;
    
    // Set color based on theme
    let starColor = document.body.classList.contains('dark-theme') ? 0x818cf8 : 0x667eea;
    
    const starMaterial = new THREE.PointsMaterial({
        color: starColor,
        size: particleSize,
        sizeAttenuation: true
    });
    
    // Create star positions
    const starVertices = [];
    const distributionRange = isLowPower ? 1500 : 2000;
    
    for(let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * distributionRange;
        const y = (Math.random() - 0.5) * distributionRange;
        const z = (Math.random() - 0.5) * distributionRange;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Make starMaterial globally accessible for theme toggle
    window.starMaterial = starMaterial;
    
    return { stars, starMaterial };
}

// Three.js setup for hero section
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Three.js");
    
    // Get canvas element
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    console.log("Canvas found:", canvas);

    // Create scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Setup renderer with adaptive settings
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: !isLowPowerDevice(), // Disable antialiasing on mobile
        powerPreference: isLowPowerDevice() ? 'low-power' : 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPowerDevice() ? 1 : 2));

    // Create stars optimized for the device
    const { stars, starMaterial } = createStars(scene);

    // Add mouse/touch interaction
    let mouseX = 0;
    let mouseY = 0;
    let interactionIntensity = isLowPowerDevice() ? 0.05 : 0.1;
    
    // Mouse move event for desktop
    document.addEventListener('mousemove', function(event) {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    });
    
    // Touch events for mobile
    document.addEventListener('touchmove', function(event) {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - window.innerWidth / 2) / 100;
            mouseY = (event.touches[0].clientY - window.innerHeight / 2) / 100;
        }
    });

    // Update star color when theme changes
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            setTimeout(() => {
                const isDarkTheme = document.body.classList.contains('dark-theme');
                if (window.starMaterial) {
                    window.starMaterial.color.set(isDarkTheme ? 0x818cf8 : 0x667eea);
                }
            }, 50);
        });
    }

    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate based on mouse position
        stars.rotation.x += (mouseY * interactionIntensity - stars.rotation.x) * 0.05;
        stars.rotation.y += (mouseX * interactionIntensity - stars.rotation.y) * 0.05;
        
        // Add constant rotation - slower on mobile
        stars.rotation.y += isLowPowerDevice() ? 0.001 : 0.002;
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update renderer size
        renderer.setSize(width, height);
        
        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        // Re-check if device is low power and adjust settings
        const isLowPower = isLowPowerDevice();
        interactionIntensity = isLowPower ? 0.05 : 0.1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1 : 2));
    });
    
    // Start animation
    animate();
    console.log("Three.js animation started");

    // Scroll Animation for Elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections and project cards
    document.querySelectorAll('section, .project-card').forEach(element => {
        observer.observe(element);
    });
}); 
