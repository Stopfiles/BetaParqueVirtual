import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

//Setup the renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(
  window.innerWidth,
  window.innerHeight
)
renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)

//Create a new scene
const scene = new THREE.Scene()

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

const sombrasBillboards = []

const objetosInteractivos = []

//Loader para el modelo GLB 
loader.load(
  '/ParquePrueba1.glb',
  function (gltf) {

    const model = gltf.scene

    const posicionesBillboards = new Set()

model.traverse((child) => {

    if (!child.isMesh) return
    if (!child.name.toLowerCase().includes("arbol")) return

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

        model.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

                if (child.material.map) {
            child.material.alphaTest = 0.5
        }
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

objetosInteractivos.push(letrero1)
objetosInteractivos.push(letrero2)

objetosInteractivos.push(botonEntrada)
objetosInteractivos.push(botonCarteles)
objetosInteractivos.push(botonLogo)

  }
)

function actualizarBillboards() {

    billboards.forEach(arbol => {

        const dx = camera.position.x - arbol.position.x
        const dz = camera.position.z - arbol.position.z

        const angulo = Math.atan2(dz, dx)

        arbol.rotation.z = angulo + Math.PI / 2

    })

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