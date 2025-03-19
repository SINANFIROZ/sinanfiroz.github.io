// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggle || !themeIcon) {
        console.error('Theme toggle elements not found!');
        return;
    }
    
    console.log('Theme toggle setup started');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    console.log('Current theme from storage:', currentTheme);
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        console.log('Applied dark theme');
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        console.log('Applied light theme');
    }
    
    // Toggle theme when clicking the theme button
    themeToggle.addEventListener('click', function() {
        console.log('Theme toggle clicked');
        
        // Toggle dark class on body
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        console.log('Dark theme applied:', isDarkTheme);
        
        // Update icon
        if (isDarkTheme) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        
        // Trigger a resize event to refresh Three.js
        window.dispatchEvent(new Event('resize'));
    });
    
    console.log('Theme toggle setup completed');
}

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
    let starColor = document.body.classList.contains('dark-theme') ? 0x4ea8de : 0x3498db;
    
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
    
    return { stars, starMaterial };
}

// Fix burger menu functionality
function setupMobileNavigation() {
    console.log("Setting up mobile navigation");
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (!burger || !nav) {
        console.error("Burger menu elements not found!");
        return;
    }
    
    console.log("Burger and nav elements found");
    
    // Toggle navigation when clicking burger
    burger.addEventListener('click', function() {
        console.log("Burger clicked");
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
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        });
    });
    
    console.log("Mobile navigation setup complete");
}

// Three.js setup for hero section
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme toggle and mobile navigation
    setupThemeToggle();
    setupMobileNavigation();
    
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
            const isDarkTheme = document.body.classList.contains('dark-theme');
            starMaterial.color.set(isDarkTheme ? 0x4ea8de : 0x3498db);
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

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
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