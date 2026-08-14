import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

//Setup the renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)

//Create a new scene
const scene = new THREE.Scene()

// 🌫️ Bruma de horizonte

const canvasNiebla = document.createElement('canvas')

canvasNiebla.width = 512
canvasNiebla.height = 512

const contexto = canvasNiebla.getContext('2d')

const gradiente = contexto.createLinearGradient(
    0,
    0,
    0,
    512
)

gradiente.addColorStop(0, 'rgba(227,225,214,0)')
gradiente.addColorStop(0.35, 'rgba(227,225,214,0.05)')
gradiente.addColorStop(0.7, 'rgba(227,225,214,0.35)')
gradiente.addColorStop(1, 'rgba(227,225,214,0.75)')

contexto.fillStyle = gradiente
contexto.fillRect(0, 0, 512, 512)

const texturaNiebla = new THREE.CanvasTexture(canvasNiebla)

//Setup the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
//const controls = new OrbitControls(
//camera,
//renderer.domElement
//)
//controls.enableZoom = false
//controls.enablePan = false
camera.position.set(0, 1.7, 20)
camera.position.y = 1.7
//controls.update()

//Setup the sky

const textureLoader = new THREE.TextureLoader();

textureLoader.load('/autumn_hill_view_1k.jpg', function(texture) {

const envMap = pmremGenerator.fromEquirectangular(texture).texture
scene.environment = envMap

    const geometry = new THREE.SphereGeometry(500, 60, 40);

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
});

const sky = new THREE.Mesh(geometry, material);

sky.rotation.y = Math.PI;

scene.add(sky);

});

//Setup the lights
const light = new THREE.DirectionalLight(0xfffefa, 2)
light.position.set(-80, 100, 1)
light.castShadow = true

light.shadow.camera.left = -90
light.shadow.camera.right = 90
light.shadow.camera.top = 110
light.shadow.camera.bottom = -110

light.shadow.camera.near = 0.1
light.shadow.camera.far = 500

light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048

light.shadow.bias = -0.0001
light.shadow.normalBias = 0.1

scene.add(light)

light.target.position.set(
    0.8836536407470703,
    10.993981840344102,
    -2.2952842712402344
)

scene.add(light.target)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const speed = 0.15

const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)

let letrero1
let letrero2

let botonEntrada
let botonCarteles
let botonLogo

let entrada
let carteles
let logo

let MiraEntrada
let MiraCarteles
let MiraLogo


let arrastrando = false
let moviendoCamara = false

let posicionInicio = new THREE.Vector3()
let posicionDestino = new THREE.Vector3()
let tiempoInicio = 0

let rotacionInicio = new THREE.Quaternion()
let rotacionDestino = new THREE.Quaternion()

let miraDestino = null

let posicionMira = new THREE.Vector3()

let posicionPunto = new THREE.Vector3()

const billboards = []

const billboardsNuevos = []

const sombrasBillboards = []

const objetosInteractivos = []

//Loader para el modelo GLB 
loader.load(
  '/ParquePT4Meshopt.glb',
  function (gltf) {

    const model = gltf.scene

    model.traverse((child) => {

    if (!child.isMesh || !child.material) return

    if (child.material.name === "Cemento") {

        child.material.metalness = 0
        child.material.roughness = 1

                    child.material.normalScale.set(3, 3)

        child.material.needsUpdate = true

    }
                    if (child.material.name === "Base") {

        child.material.metalness = 0
        child.material.roughness = 3

        child.material.needsUpdate = true

    }
            if (child.material.name === "Materiall #54") {

        child.material.metalness = 0
        child.material.roughness = 2

        child.material.needsUpdate = true

    }
        if (child.material.name === "Metal") {

        child.material.metalness = 1
        child.material.roughness = 0.1

        child.material.needsUpdate = true

    }
                if (child.material.name === "Negro") {

        child.material.metalness = 1
        child.material.roughness = 1.6

        child.material.needsUpdate = true

    }
            if (child.material.name === "Ventana") {

        child.material.metalness = 0
        child.material.roughness = 0.03

        child.material.needsUpdate = true

    }
                if (child.material.name === "Blanco") {

        child.material.metalness = 1
        child.material.roughness = 2

        child.material.needsUpdate = true

    }
            if (child.material.name === "pUERTA") { 

        child.material.metalness = 0
        child.material.roughness = 2.5

        child.material.needsUpdate = true

    }
            if (child.material.name === "metal") {

        child.material.metalness = 0.5
        child.material.roughness = 2

            child.material.normalScale.set(5, 5)

        child.material.needsUpdate = true

    }
                if (child.material.name === "Ladrillos") {

            child.material.roughness = 5
    child.material.normalScale.set(2, 2)

        child.material.needsUpdate = true

    }

                    if (child.material.name === "Piedritas") {

    child.material.normalScale.set(5, 5)

        child.material.needsUpdate = true

    }

})

    model.traverse((child) => {
    if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.material?.map) {
            child.material.alphaTest = 0.5
        }
    }
})

    const posicionesBillboards = new Set()

model.traverse((child) => {

    if (!child.isMesh) return
const nombre = child.name.toLowerCase()

if (
    !nombre.includes("arbol") &&
    !nombre.includes("piedra") &&
    ![
        "plano",
        "plano001",
        "plano002",
        "plano003",
        "plano004",
        "plano005",
        "plano006",
        "plano007",
        "plano008",
        "plano009",
        "plano010",
        "plano011",
        "plano012",
        "plano013",
        "plano014",
        "plano015"
    ].includes(nombre)
) return

    const x = child.position.x.toFixed(3)
    const y = child.position.y.toFixed(3)
    const z = child.position.z.toFixed(3)

    const clave = `${x}_${y}_${z}`

    if (posicionesBillboards.has(clave)) {

         sombrasBillboards.push(child)

    } else {

        // Es el primero → lo dejamos
        posicionesBillboards.add(clave)
        billboards.push(child)

    }
})

model.traverse((child) => {

    if (child.isMesh && child.material?.map) {

        const texture = child.material.map

        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

        texture.needsUpdate = true
    }

})

    billboards.forEach(arbol => {
    arbol.castShadow = false
        arbol.receiveShadow = false
})

sombrasBillboards.forEach(arbol => {
    arbol.castShadow = true

})

sombrasBillboards.forEach(arbol => {

    arbol.material = arbol.material.clone()

        arbol.material.transparent = true
    arbol.material.opacity = 0
    arbol.material.depthWrite = false

})

    scene.add(model)

    window.parqueModel = model

    letrero1 = model.getObjectByName("Letrero_1")
    letrero2 = model.getObjectByName("Letrero2")

    botonEntrada = model.getObjectByName("BotonEntrada")
botonCarteles = model.getObjectByName("BotonCarteles")
botonLogo = model.getObjectByName("BotonLogo")

entrada = model.getObjectByName("Entrada")
carteles = model.getObjectByName("Carteles")
logo = model.getObjectByName("Logo")

MiraEntrada = model.getObjectByName("MiraEntrada")
MiraCarteles = model.getObjectByName("MiraCarteles")
MiraLogo = model.getObjectByName("MiraLogo")

  irA(entrada, MiraEntrada)

//Norte
crearVegetacion(
    '/Fondo/Arbol11-2k.png',
    10,
    -95, -110,
    95, -110,
    14, 32,
    0, -10
)

crearVegetacion(
    '/Fondo/Arbol21-2k.png',
    10,
    -95, -115,
    95, -115,
    15, 30,
    0, -10
)

crearVegetacion(
    '/Fondo/Cactus1.png',
    5,
    -90, -120,
    90, -120,
    6, 30,
    0, -10
)
//Sur
crearVegetacion(
    '/Fondo/Arbol11-2k.png',
    10,
    -95, 105,
    95, 105,
    14, 24,
    5, 1
)

crearVegetacion(
    '/Fondo/Arbol21-2k.png',
    10,
    -95, 110,
    95, 110,
    15, 30,
    5, 1
)

crearVegetacion(
    '/Fondo/Cactus1.png',
    5,
    -90, 115,
    90, 115,
    6, 30,
    5, 1
)
//Oeste
crearVegetacion(
    '/Fondo/Arbol11-2k.png',
    10,
    -90, -100,
    -90, 100,
    14, 34,
    0, -30
)

crearVegetacion(
    '/Fondo/Arbol21-2k.png',
    10,
    -95, -100,
    -95, 100,
    15, 30,
    0, -30
)

crearVegetacion(
    '/Fondo/Cactus1.png',
    5,
    -100, -90,
    -100, 90,
    6, 22,
    0, -30
)
//Este
crearVegetacion(
    '/Fondo/Arbol11-2k.png',
    10,
    90, -100,
    90, 100,
    14, 26,
    0, 70
)

crearVegetacion(
    '/Fondo/Arbol21-2k.png',
    10,
    95, -100,
    95, 100,
    15, 30,
    0, 70
)

crearVegetacion(
    '/Fondo/Cactus1.png',
    5,
    100, -90,
    100, 90,
    6, 28,
    0, 70
)

objetosInteractivos.push(letrero1)
objetosInteractivos.push(letrero2)

objetosInteractivos.push(botonEntrada)
objetosInteractivos.push(botonCarteles)
objetosInteractivos.push(botonLogo)

  }
)

function crearCapaNiebla(radio, opacidad) {

    const geometria = new THREE.CylinderGeometry(
        radio,
        radio,
        60,
        64,
        1,
        true
    )

    const material = new THREE.MeshBasicMaterial({
        map: texturaNiebla,
        transparent: true,
        opacity: opacidad,
        depthWrite: false,
        side: THREE.DoubleSide
    })

    const capa = new THREE.Mesh(
        geometria,
        material
    )

    capa.position.set(0, 20, 0)

        capa.renderOrder = 1

    scene.add(capa)
}

crearCapaNiebla(89, 0.01)
crearCapaNiebla(89.5, 0.02)
crearCapaNiebla(90, 0.03)
crearCapaNiebla(90.5, 0.04)
crearCapaNiebla(91, 0.05)
crearCapaNiebla(92, 0.06)
crearCapaNiebla(93, 0.07)
crearCapaNiebla(94, 0.1)
crearCapaNiebla(95, 0.2)
crearCapaNiebla(96, 0.3)
crearCapaNiebla(98, 0.4)
crearCapaNiebla(100, 1)
crearCapaNiebla(105, 1.9)

const pmremGenerator = new THREE.PMREMGenerator(renderer)

function actualizarBillboards() {

    billboards.forEach(arbol => {

            arbol.castShadow = false
    arbol.receiveShadow = false
        
        arbol.renderOrder = 2

        const dx = camera.position.x - arbol.position.x
        const dz = camera.position.z - arbol.position.z

        const angulo = Math.atan2(dz, dx)

        arbol.rotation.z = angulo + Math.PI / 2

    })

        billboardsNuevos.forEach(arbol => {

        const dx = camera.position.x - arbol.position.x
        const dz = camera.position.z - arbol.position.z

        const angulo = Math.atan2(dx, dz)

        arbol.rotation.y = angulo

    })

}

function crearBillboard(ruta, x, y, z, escala) {

    textureLoader.load(ruta, function(texture) {

        const ancho = texture.image.width
        const alto = texture.image.height

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.5,
            side: THREE.DoubleSide
        })

        const proporcion = ancho / alto

        const geometry = new THREE.PlaneGeometry(proporcion, 1)

        const arbol = new THREE.Mesh(geometry, material)

        arbol.position.set(x, y, z)

        arbol.scale.set(escala, escala, escala)

        scene.add(arbol)

        billboardsNuevos.push(arbol)

    })
}


function crearVegetacion(ruta, cantidad, inicioX, inicioZ, finX, finZ, escalaMin, escalaMax, desplazamientoZ = 0, desplazamientoX = 0) {

    for (let i = 0; i < cantidad; i++) {

        const progreso = i / (cantidad - 1)

        const x = inicioX + (finX - inicioX) * progreso
        const z = inicioZ + (finZ - inicioZ) * progreso

        const variacionX = (Math.random() - 0.5) * 12
        const variacionZ = (Math.random() - 0.5) * 12

        const escala =
            escalaMin +
            Math.random() * (escalaMax - escalaMin)

        crearBillboard(
            ruta,
            x + variacionX + desplazamientoX,
            6,
            z + variacionZ + desplazamientoZ,
            escala
        )
    }
}

function irASuave(punto, mira) {

    camera.rotation.order = 'YXZ'

    punto.getWorldPosition(posicionPunto)
    mira.getWorldPosition(posicionMira)

    posicionInicio.copy(camera.position)
    posicionDestino.copy(posicionPunto)

    rotacionInicio.copy(camera.quaternion)

    // Calculamos la orientación desde el punto DESTINO
    camera.position.copy(posicionDestino)
    camera.lookAt(posicionMira)

    rotacionDestino.copy(camera.quaternion)

    // Regresamos al inicio
    camera.position.copy(posicionInicio)
    camera.quaternion.copy(rotacionInicio)

    tiempoInicio = performance.now()

    moviendoCamara = true
}

function irA(punto, mira) {

    camera.rotation.order = 'YXZ'

    punto.getWorldPosition(posicionPunto)
    mira.getWorldPosition(posicionMira)

    camera.position.copy(posicionPunto)

    camera.lookAt(posicionMira)

    camera.rotation.z = 0
}

const raycaster = new THREE.Raycaster()
//Donde hace click el usuario
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener('pointerdown', () => {

    arrastrando = true

})

if (arrastrando && !moviendoCamara) {

    camera.rotation.y -= event.movementX * 0.005

    camera.rotation.x -= event.movementY * 0.003

    camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x)
    )

    camera.rotation.z = 0
}

renderer.domElement.addEventListener('pointermove', (event) => {

    if (arrastrando) {

        camera.rotation.y -= event.movementX * 0.005
        camera.rotation.x -= event.movementY * 0.003

        camera.rotation.x = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, camera.rotation.x)
        )

        camera.rotation.z = 0
    }

})

document.addEventListener('pointerup', () => {

    arrastrando = false

})

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
raycaster.setFromCamera(mouse, camera)

const intersecciones = raycaster.intersectObjects(
    objetosInteractivos,
    true
)

if (intersecciones.length > 0) {

   const nombre = intersecciones[0].object.name

console.log("Click en:", nombre)

if (nombre === "BotonEntrada") {
    irASuave(entrada, MiraEntrada)
}

    if (nombre === "BotonCarteles") {
irASuave(carteles, MiraCarteles)
    }

    if (nombre === "BotonLogo") {
irASuave(logo, MiraLogo)
    }

}
}
)

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    )

})

//Render loop Animación
function animate() {

    requestAnimationFrame(animate)

    if (moviendoCamara) {

    const tiempoActual = performance.now()

    const progreso = Math.min(
        (tiempoActual - tiempoInicio) / 2000,
        1
    )

    camera.position.lerpVectors(
        posicionInicio,
        posicionDestino,
        progreso
    )

    camera.quaternion.slerpQuaternions(
        rotacionInicio,
        rotacionDestino,
        progreso
    )

    if (progreso >= 1) {
        camera.position.copy(posicionDestino)
        camera.quaternion.copy(rotacionDestino)
        moviendoCamara = false

    }
}

actualizarBillboards()

renderer.render(scene, camera)
}

//----------------//

animate()