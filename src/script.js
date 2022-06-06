import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


/**
 * Debug
 */
const gui = new dat.GUI()
let Mesh;
let Mesh1;
let Mesh2;

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Objects

const objectsDistance = 4
/**
 * Loaders
 */

 const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('pose0.glb', (gltf) => {
     Mesh = gltf.scene;
     Mesh.scale.set(1.2,1.2,1.2);
     scene.add(Mesh);
     Mesh.position.x = 1.7;
     Mesh.position.y = - objectsDistance * 0 - 1;
 });

 gltfLoader.load('pose1.glb', (gltf) => {
    Mesh1 = gltf.scene;
    Mesh1.scale.set(1.2,1.2,1.2);
    scene.add(Mesh1);
    Mesh1.position.x = -1.7;
    Mesh1.position.y = - objectsDistance * 1 - 1;
});

gltfLoader.load('pose2.glb', (gltf) => {
    Mesh2 = gltf.scene;
    Mesh2.scale.set(1.2,1.2,1.2);
    scene.add(Mesh2);
    Mesh2.position.x = 1.7;
    Mesh2.position.y = - objectsDistance * 2 - 1;
});

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2


const sectionMeshes = [ mesh1, mesh2, mesh3 ]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.75)
const directionalLight2 = new THREE.DirectionalLight('#ffffff', 0.44)
const directionalLight3 = new THREE.DirectionalLight('#ffffff', 0.3)
const directionalLight4 = new THREE.DirectionalLight('#ffffff', 0.4)
const directionalLight5 = new THREE.DirectionalLight('#ffffff', 0.3)
const directionalLight6 = new THREE.DirectionalLight('#ffffff', 0.3)


directionalLight.position.set(5, 5, 5)
directionalLight2.position.set(-2, -5, 5)
directionalLight3.position.set(-2, 4, -5)
directionalLight4.position.set(-4, 2, -10)
directionalLight5.position.set(1, 1, 8)
directionalLight6.position.set(0, 1, 4)



scene.add(directionalLight, directionalLight2, directionalLight3, directionalLight4, directionalLight5);
/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: textureLoader,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

setTimeout(function() {
    
    if (Mesh){
    gsap.to(
        Mesh.rotation,
        {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=0',
            y: '+=6.28318530718',
            z: '+=0'
        }
    )} }, 2000);



window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        if (Mesh){
        gsap.to(
            Mesh.rotation,
            {
                duration: 2,
                ease: 'power2.inOut',
                x: '+=0',
                y: '+=6.28318530718',
                z: '+=0'
            }
        )
        }

        if (Mesh1){
            gsap.to(
                Mesh1.rotation,
                {
                    duration: 2,
                    ease: 'power2.inOut',
                    x: '+=0',
                    y: '+=6.28318530718',
                    z: '+=0'
                }
            )
        }
        if (Mesh2){
            gsap.to(
                Mesh2.rotation,
                {
                    duration: 2,
                    ease: 'power2.inOut',
                    x: '+=0',
                    y: '+=6.28318530718',
                    z: '+=0'
                }
            )
        }
    }    
});

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    // console.log(particles);
    // for (part of particles){
    //     particles.size += Math.sin(elapsedTime)
    // }
    particles.position.z += 0.002*Math.cos(elapsedTime)
    particles.position.y += 0.0005*Math.cos(elapsedTime)

    particles.material.size += 0.00035*Math.sin(elapsedTime)
    console.log(particles.position)

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    if (Mesh) {    
        Mesh.position.x += 0.0035*Math.sin(elapsedTime);
        Mesh.position.y += 0.00009*Math.sin(elapsedTime);
    }

    if (Mesh1) {    
        Mesh1.position.x += 0.0035*Math.sin(elapsedTime);
        Mesh1.position.y += 0.00009*Math.sin(elapsedTime);
    }

    if (Mesh2) {    
        Mesh2.position.x += 0.0035*Math.sin(elapsedTime);
        Mesh2.position.y += 0.00009*Math.sin(elapsedTime);
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// active navbar link
const sections = document.querySelectorAll(".section");

window.addEventListener("scroll", function (event) {
  sections.forEach((section) => {
    let top = window.scrollY + 250;
    let offset = section.offsetTop;
    let height = section.offsetHeight;
    let id = section.getAttribute("id");

    if (top >= offset && top < offset + height) {
      document.querySelectorAll(".active").forEach((a) => {
        a.classList.remove("active");
      });

      document.querySelector("[href*=" + id + "]").classList.add("active");
    }
  });
});


// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "!<>-_\\/[]{}—=+*^?#________";
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = "";
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }
  
  // ——————————————————————————————————————————————————
  // Example
  // ——————————————————————————————————————————————————
  
  const phrases = [
    "Hi, I'm Akmarzhan:) ",
    "I'm a Software Developer"
  ];
  
  const el = document.querySelector(".text");
  const fx = new TextScramble(el);
  
  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 3000);
    });
    counter = (counter + 1) % phrases.length;
  };
  
  next();
  
  "use strict";
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

c.height = window.innerHeight*3;
c.width = window.innerWidth*3;

let floatChar = [0, 1];
let font_size = 10;
let col = c.width / font_size;
let charDrops = [];
for (let i = 0; i < col; i++) charDrops[i] = 1;

let putPixel = () => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#61de2a";
  ctx.font = font_size + "px Consolas";
  for (let i = 0; i < charDrops.length; i++) {
    let txt = floatChar[Math.floor(Math.random() * floatChar.length)];
    ctx.fillText(txt, i * font_size, charDrops[i] * font_size);
    if (charDrops[i] * font_size > c.height && Math.random() > 0.975)
      charDrops[i] = 0;

    //incrementing Y coordinate
    charDrops[i]++;
  }
};

setInterval(putPixel, 30);

const text1_options = [
    "Timero: Gamified Time Management Web App",
    
    "Face Recognition Tool for Videos of K-Pop Idols",
    "Introduction to Cassandra: Tutorial Blog for Beginners",
    "BERT Sentiment Analysis: Movie Reviews dataset",
    "GAN and CNN for Style Transfer on videos and photos",
    
    "Responsive Three.js Portfolio (Currently Viewing)",
    "Kanban Board: Simple Task Tracker with Authorization",
    "MetaMask Ethereum Wallet on Rinkeby Testnet",
    "SuggestMe: Instagram Content Recommendation"
  ];
  const git_text = [
      "GitHub 🔗",

      "GitHub 🔗",
      "Blog post 🔗",
      "Paper 🔗",
      "Paper 🔗",

      "GitHub 🔗",
      "GitHub 🔗",
      "GitHub 🔗",
      "GitHub 🔗"
  ]
  const git_options = [
    "https://github.com/akmarzhan1/capstone-akma",

    "https://github.com/akmarzhan1/kpop-recognition-tool",
    "https://akmarzhan.notion.site/Cassandra-who-or-a-short-introduction-to-Apache-Cassandra-using-Docker-798d343c41c84dddbb2e52873a04e1b0",
    "https://drive.google.com/file/d/1X3jDNhsfgVxTpn7ZmOK1ifQO9Q4bScSR/view?usp=sharing",
    "https://drive.google.com/file/d/1sk7uUkuHolFaWc6JiNk_HGfexIFiczBJ/view?usp=sharing",
    
    "https://github.com/akmarzhan1/portfolio", 
    "https://github.com/akmarzhan1/kanban-board",
    "https://github.com/akmarzhan1/ethereum-wallet",
    "https://github.com/akmarzhan1/content-suggestion"
  ];
  const text2_options = [
    "Technologies: Flask / REST API / JQuery / Jinja2 / SQLAlchemy / PostgreSQL / Chart.js / Bootstrap / Tailwind / JS / HTML5 / CSS deployed on Heroku",

    "Technologies: cv2 / Keras / VGGFace / face_recognition. Comparison of two approaches for face recognition using feature extraction and fine-tuning",
    "Technologies: Cassandra / Docker. Beginner-friendly guide to implementing Cassandra (distributed database) with several clusters",
    "Technologies: PyTorch / Pandas / BERT for Sequence Classification. Fine-tuning the pre-existing model on IMDb movie reviews dataset",
    "Technologies: PyTorch / Pandas / VGG19. Contrasting GANs and Convolutional Neural Networks (CNN) for style transfer using VGG19 model on photos/videos.",
    
    "Technologies: JS / HTML / CSS / Three.js / webpack deployed on Netlify with responsive UI change feature using lil_gui",
    "Technologies: Flask / HTML / CSS / Jinja2 / WTForms / Bootstrap / SQL with extensive unit testing ",
    "Technologies: React / JS / web3 / MetaMask using smart contracts (e.g., publicly available Ethereum abis) deployed on Heroku",
    "Technologies: Flask / Jinja2 / SQLAlchemy / HTML / JS / CSS / Docker / instagram-scraper deployed on Heroku and tested on TravisCI / Github Actions",

  ];

  const color_options = ["#6bb944e3", "#a9c202e1", "#74ad57e3", "#87c924de", "#588e44e3", "#a9c202e1", "#74ad57e3", "#87c924de", "#588e44e3"];
  const image_options = [
    "img/timero.png",

    "img/kpop.png",
    "img/cassandra.png",
    "img/bert.png",
    "img/gan.png",

    "img/portfolio.png",
    "img/kanban.png",
    "img/ethereum.png",
    "img/suggestme.png"
    ];
  var i = 0;
  const currentOptionText1 = document.getElementById("current-option-text1");
  const currentOptionText2 = document.getElementById("current-option-text2");
  const currentOptionGit = document.getElementById("current-option-git");
  const currentOptionImage = document.getElementById("image");
  const carousel = document.getElementById("carousel-wrapper");
  const mainMenu = document.getElementById("menu");
  const optionPrevious = document.getElementById("previous-option");
  const optionNext = document.getElementById("next-option");
  
  currentOptionText1.innerText = text1_options[i];
  currentOptionText2.innerText = text2_options[i];
  currentOptionGit.href =  git_options[i];
  currentOptionGit.innerText = git_text[i];
  currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
  mainMenu.style.background = color_options[i];
  
  optionNext.onclick = function () {
    i = i + 1;
    i = i % text1_options.length;
    currentOptionText1.dataset.nextText = text1_options[i];
    currentOptionText2.dataset.nextText = text2_options[i];
    currentOptionGit.dataset.nextText = git_text[i];

    mainMenu.style.background = color_options[i];
    carousel.classList.add("anim-next");
  
    setTimeout(() => {
      currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
      currentOptionGit.href =  git_options[i];
    }, 455);
  
    setTimeout(() => {
      currentOptionText1.innerText = text1_options[i];
      currentOptionText2.innerText = text2_options[i];
      currentOptionGit.innerText = git_text[i];
      carousel.classList.remove("anim-next");
    }, 650);
  };
  
  optionPrevious.onclick = function () {
    if (i === 0) {
      i = text1_options.length;
    }
    i = i - 1;
    currentOptionText1.dataset.previousText = text1_options[i];
  
    currentOptionText2.dataset.previousText = text2_options[i];
    currentOptionGit.dataset.previousText = git_text[i];

    mainMenu.style.background = color_options[i];
    carousel.classList.add("anim-previous");
  
    setTimeout(() => {
      currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
    }, 455);
  
    setTimeout(() => {
      currentOptionText1.innerText = text1_options[i];
      currentOptionText2.innerText = text2_options[i];
      currentOptionGit.innerText = git_text[i];
      currentOptionGit.href = git_options[i];
      carousel.classList.remove("anim-previous");
    }, 650);
  };
  