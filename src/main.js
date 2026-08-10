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
const sky = new Sky()

sky.scale.setScalar(450000)

scene.add(sky)

const skyUniforms = sky.material.uniforms

skyUniforms['turbidity'].value = 6
skyUniforms['rayleigh'].value = 1
skyUniforms['mieCoefficient'].value = 0.005
skyUniforms['mieDirectionalG'].value = 0.8

const sun = new THREE.Vector3()

sun.setFromSphericalCoords(
1,
Math.PI / 2.5,
Math.PI / 4
)

sky.material.uniforms['sunPosition'].value.copy(sun)

//Setup the lights
const light = new THREE.DirectionalLight(0xffd9a0, 1)
light.position.set(50, 100, 50)
light.castShadow = true
scene.add(light)

light.target.position.set(0, 0, 0)
scene.add(light.target)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const speed = 0.15

//Render loop
function animate() {

    requestAnimationFrame(animate)

    if (moviendoCamara) {

        const tiempoActual = performance.now()

        const progreso = Math.min(
            (tiempoActual - tiempoInicio) / 1000,
            1
        )

        camera.position.lerpVectors(
            posicionInicio,
            posicionDestino,
            progreso
        )

camera.rotation.set(
    THREE.MathUtils.lerp(
        rotacionInicio.x,
        rotacionDestino.x,
        progreso
    ),
    THREE.MathUtils.lerp(
        rotacionInicio.y,
        rotacionDestino.y,
        progreso
    ),
    0,
    'YXZ'
)

        if (progreso >= 1) {
            moviendoCamara = false
        }
    }

    renderer.render(scene, camera)
}

//----------------//

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

let posicionCamara
let arrastrando = false
let moviendoCamara = false

let posicionInicio = new THREE.Vector3()
let posicionDestino = new THREE.Vector3()
let tiempoInicio = 0

let rotacionInicio = new THREE.Euler()
let rotacionDestino = new THREE.Euler()

const objetosInteractivos = []

function irASuave(punto, mira) {

    posicionInicio.copy(camera.position)
    posicionDestino.copy(punto.position)

    rotacionInicio.copy(camera.rotation)

    camera.rotation.order = 'YXZ'
    camera.lookAt(mira.position)

    rotacionDestino.copy(camera.rotation)

    camera.rotation.copy(rotacionInicio)

    tiempoInicio = performance.now()

    moviendoCamara = true
}

function irA(punto, mira) {

    camera.position.copy(punto.position)

    camera.rotation.order = 'YXZ'

    camera.lookAt(mira.position)

    camera.rotation.z = 0

}

loader.load(
  '/ParqueLigero8.glb',
  function (gltf) {

    const model = gltf.scene

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

const raycaster = new THREE.Raycaster()
//Donde hace click el usuario
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener('pointerdown', () => {

    arrastrando = true

})

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

animate()