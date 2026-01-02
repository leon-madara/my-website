// Three.js Profile Scene - Subtle 3D effects for profile photo
// Creates an immersive 3D experience with rotation, lighting, and mouse interaction

let camera, scene, renderer;
let profileMesh;

function initProfileScene() {
    const container = document.getElementById('profile-3d-container');
    if (!container) {
        // Container doesn't exist on portfolio page anymore - this is expected
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    const aspect = 1; // Square aspect ratio for profile photo
    const d = 5; // Distance from center
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(0, 0, 10);

    // Lighting - Ambient + Point lights for depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    // Create profile photo geometry
    const geometry = new THREE.PlaneGeometry(8, 8, 32, 32);
    
    // Load profile photo as texture - use relative path for local development
    const textureLoader = new THREE.TextureLoader();
    const profileTexture = textureLoader.load('images/profile-photo.svg', 
        function(texture) {
            // Smooth texture rendering
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        },
        undefined,
        function(error) {
            console.warn('Could not load profile photo, using fallback color');
            // Fallback to a gradient if image fails
        }
    );

    // Create material with subtle effects
    const material = new THREE.MeshStandardMaterial({
        map: profileTexture,
        transparent: true,
        opacity: 0.95,
        roughness: 0.5,
        metalness: 0.1,
        flatShading: false
    });

    // Create mesh with warp effect
    profileMesh = new THREE.Mesh(geometry, material);
    
    // Add subtle warping for depth
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const distance = Math.sqrt(x * x + y * y);
        const warpAmount = Math.sin(distance * 0.5) * 0.1;
        vertices[i + 2] = warpAmount;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    scene.add(profileMesh);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Add Kenyan flag colors as subtle background glow
    const glowGeometry = new THREE.RingGeometry(4, 6, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x006b3f, // Kenyan green
        transparent: true,
        opacity: 0.1
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // Mouse interaction for 3D tilt effect
    setupMouseInteraction();

    // Auto-rotation with subtle movement
    setupAutoRotation();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function setupMouseInteraction() {
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    const container = document.getElementById('profile-3d-container');
    
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = (event.clientX - rect.left) / rect.width;
        mouseY = (event.clientY - rect.top) / rect.height;
        
        targetRotationY = (mouseX - 0.5) * 0.5; // Max 30 degrees
        targetRotationX = (mouseY - 0.5) * -0.5; // Inverted for natural feel
    });

    container.addEventListener('mouseleave', () => {
        targetRotationX = 0;
        targetRotationY = 0;
    });

    // Smooth rotation interpolation
    function updateRotation() {
        if (profileMesh) {
            profileMesh.rotation.y += (targetRotationY - profileMesh.rotation.y) * 0.05;
            profileMesh.rotation.x += (targetRotationX - profileMesh.rotation.x) * 0.05;
        }
    }
    
    // Store update function for use in animation loop
    window.updateProfileRotation = updateRotation;
}

function setupAutoRotation() {
    // Subtle auto-rotation that pauses on interaction
    const autoRotateSpeed = 0.002;
    let isHovering = false;
    const container = document.getElementById('profile-3d-container');
    
    container.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    container.addEventListener('mouseleave', () => {
        isHovering = false;
    });

    // Store for animation loop
    window.autoRotateProfile = () => {
        if (profileMesh && !isHovering) {
            profileMesh.rotation.y += autoRotateSpeed;
        }
    };
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update auto-rotation
    if (window.autoRotateProfile) {
        window.autoRotateProfile();
    }
    
    // Update mouse interaction rotation
    if (window.updateProfileRotation) {
        window.updateProfileRotation();
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('profile-3d-container');
    if (!container || !camera || !renderer) return;

    const aspect = container.offsetWidth / container.offsetHeight;
    const d = 5;
    
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize if container exists
        setTimeout(() => {
            const container = document.getElementById('profile-3d-container');
            if (container) {
                initProfileScene();
            }
        }, 100);
    });
} else {
    setTimeout(() => {
        const container = document.getElementById('profile-3d-container');
        if (container) {
            initProfileScene();
        }
    }, 100);
}

// Export for manual initialization if needed
window.initProfileScene = initProfileScene;

