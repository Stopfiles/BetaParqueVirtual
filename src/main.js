import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Pathfinding } from 'three-pathfinding'

//Setup the renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)

const mensajeBienvenida = document.createElement('div')

mensajeBienvenida.id = 'mensajeBienvenida'

mensajeBienvenida.innerHTML = `
    <h1>Parque Funerario San Martín</h1>
    <p>Explora nuestro espacio</p>
`

document.body.appendChild(mensajeBienvenida)

const panelCarteles = document.createElement('div')

panelCarteles.id = 'panelCarteles'

panelCarteles.innerHTML = `
    <div class="contenidoPanel">
        <h2>Carteles</h2>
        <p>Aquí podremos colocar la información de esta sección.</p>
    </div>

    <button id="cerrarPanelCarteles">Cerrar</button>
`

document.body.appendChild(panelCarteles)

const cerrarPanelCarteles = document.getElementById('cerrarPanelCarteles')

const panelLogo = document.createElement('div')

panelLogo.id = 'panelLogo'

panelLogo.innerHTML = `
    <div class="contenidoPanel">
        <h2>San Martín</h2>
        <p>Aquí podremos colocar la información de Parque Funerario San Martín.</p>
    </div>

    <button id="cerrarPanelLogo">Cerrar</button>
`

document.body.appendChild(panelLogo)

const cerrarPanelLogo = document.getElementById('cerrarPanelLogo')

const fondoOscuroLetrero = document.createElement('div')

fondoOscuroLetrero.id = 'fondoOscuroLetrero'

document.body.appendChild(fondoOscuroLetrero)

const panelLetrero = document.createElement('div')

panelLetrero.id = 'panelLetrero'

panelLetrero.innerHTML = `
    <div class="contenidoPanel">
        <h2 id="tituloLetrero"></h2>
        <p id="textoLetrero"></p>
    </div>

    <button id="cerrarPanelLetrero">Cerrar</button>
`

document.body.appendChild(panelLetrero)

const tituloLetrero =
    document.getElementById('tituloLetrero')

const textoLetrero =
    document.getElementById('textoLetrero')

const cerrarPanelLetrero =
    document.getElementById('cerrarPanelLetrero')

cerrarPanelLetrero.addEventListener('click', () => {

    cerrarLetrero()

})

const botonUbicacion = document.createElement('button')

botonUbicacion.id = 'botonUbicacion'
botonUbicacion.textContent = 'Ubicación'

document.body.appendChild(botonUbicacion)

const panelMapa = document.createElement('div')

panelMapa.id = 'panelMapa'

panelMapa.innerHTML = `

    <div class="mapaContenedor">

        <div class="mapaEscala">

            <img
                src="/mapa.png"
                alt="Mapa del Parque Funerario San Martín"
            >

            <button
                id="botonMapaEstacionamiento"
                class="botonMapa botonEstacionamiento"
            >
                Estacionamiento
            </button>

            <button
                id="botonMapaNichos"
                class="botonMapa botonNichos"
            >
                Nichos
            </button>

            <button
                id="botonMapaEntrada"
                class="botonMapa botonEntrada"
            >
                Entrada
            </button>

        </div>

    </div>

        <button id="botonOcultarMapa">
        Ocultar
    </button>

`

document.body.appendChild(panelMapa)

botonUbicacion.addEventListener('click', () => {

    panelMapa.classList.add('visible')

})

const botonOcultarMapa = document.getElementById('botonOcultarMapa')

botonOcultarMapa.addEventListener('click', () => {

    panelMapa.classList.remove('visible')

})

const botonMapaEntrada =
    document.getElementById('botonMapaEntrada')

const botonMapaNichos =
    document.getElementById('botonMapaNichos')

const botonMapaEstacionamiento =
    document.getElementById('botonMapaEstacionamiento')

const pantallaProximamente = document.createElement('div')

pantallaProximamente.id = 'pantallaProximamente'

pantallaProximamente.innerHTML = `
    <h1>PRÓXIMAMENTE</h1>
`

document.body.appendChild(pantallaProximamente)

const ventanaImagen = document.createElement('div')

ventanaImagen.id = 'ventanaImagen'

ventanaImagen.innerHTML = `
    <img src="/Entrada1.jpeg" alt="">
`

document.body.appendChild(ventanaImagen)

ventanaImagen.classList.add('visible')

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

const capasNiebla = []

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

const pmremGenerator = new THREE.PMREMGenerator(renderer)
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

let luzEntrada
let luzCarteles
let luzLogo

let hoverEntrada = false
let hoverCarteles = false
let hoverLogo = false

let tiempoLuz = 0

let entrada
let carteles
let logo

let MiraEntrada
let MiraCarteles
let MiraLogo


let arrastrando = false
let moviendoCamara = false

let camaraCambio = true

let posicionInicio = new THREE.Vector3()
let posicionDestino = new THREE.Vector3()
let tiempoInicio = 0

let rotacionInicio = new THREE.Quaternion()
let rotacionDestino = new THREE.Quaternion()

let miraDestino = null

let posicionMira = new THREE.Vector3()

let posicionPunto = new THREE.Vector3()

let bienvenidaMostrada = false

let duracionTransicion = 4500

let seccionDestino = null

let letreroActivo = null
let moviendoLetrero = false
let camaraBloqueada = false
let letreroAbierto = false
let cerrandoLetrero = false

let clonLetrero = null

let posicionOriginalLetrero = new THREE.Vector3()
let posicionDestinoLetrero = new THREE.Vector3()

let rotacionDestinoLetrero = new THREE.Quaternion()
let rotacionOriginalLetrero = new THREE.Quaternion()

let tiempoInicioLetrero = 0

const duracionAnimacionLetrero = 1000

const billboards = []

const billboardsNuevos = []

const animacionesVegetacion = []

const animacionesBillboardsGLB = []

const sombrasBillboards = []

const objetosInteractivos = []

const pathfinding = new Pathfinding()

const debugRuta = []

const ZONA_PARQUE = 'parque'

let navMesh = null
let grupoNavMesh = null

let rutaActual = []
let indiceRuta = 0

let moviendoRuta = false

const ALTURA_CAMARA = 1.7
const VELOCIDAD_RECORRIDO = 8

const DISTANCIA_MINIMA_CLICK = 3
const DISTANCIA_MAXIMA_CLICK = 60

const DISTANCIA_VELOCIDAD_NORMAL = 15
const DISTANCIA_VELOCIDAD_MAXIMA = 80

const VELOCIDAD_MINIMA = 8
const VELOCIDAD_MAXIMA = 22

let velocidadActual = VELOCIDAD_RECORRIDO

let direccionSuave = new THREE.Vector3()

const pantallaCarga = document.getElementById('pantallaCarga')

const frasesCarga = [
    'Donde honramos tu memoria',
    'Una alternativa patrimonial pensada para preservar la memoria'
]

let indiceFrase = 0

const textoCarga = document.getElementById('textoCarga')

const intervaloFrases = setInterval(() => {

    indiceFrase = (indiceFrase + 1) % frasesCarga.length

    textoCarga.style.opacity = '0'

    setTimeout(() => {

        textoCarga.textContent = frasesCarga[indiceFrase]

        textoCarga.style.opacity = '1'

    }, 400)

}, 5000)

//Loader para el modelo GLB 
loader.load(
  'ParquePT7Meshopt.glb',
  function (gltf) {

    const model = gltf.scene

    model.traverse((child) => {

     if (!child.material) return

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

    if (nombre.includes("arbol")) {

    animacionesBillboardsGLB.push({

        objeto: child,

        fase: Math.random() * Math.PI * 2,

        amplitud: 0.008 + Math.random() * 0.007,

        velocidad: 0.4 + Math.random() * 0.3,

        rotacionXBase: child.rotation.x

    })

}
}
})
// ============================================
// AJUSTAR TEXTURAS
// ============================================

model.traverse((child) => {

    if (child.isMesh && child.material?.map) {

        const texture = child.material.map

        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy =
            renderer.capabilities.getMaxAnisotropy()

        texture.needsUpdate = true
    }

})


// ============================================
// ENCONTRAR NAVMESH
// ============================================

model.traverse((child) => {

    if (!child.isMesh) return

    if (child.name === "MapaNV") {

        navMesh = child

        // No queremos verla
        navMesh.visible = false

        console.log(
            "✅ NavMesh encontrada:",
            child.name
        )
    }

})


// ============================================
// CREAR ZONA DE PATHFINDING
// ============================================

if (!navMesh) {

    console.error(
        "❌ No se encontró MapaNavegacion"
    )

} else {

    navMesh.updateWorldMatrix(true, false)

    const geometriaNavMesh =
        navMesh.geometry.clone()

    geometriaNavMesh.applyMatrix4(
        navMesh.matrixWorld
    )

    const zona =
        Pathfinding.createZone(
            geometriaNavMesh
        )

    pathfinding.setZoneData(
        ZONA_PARQUE,
        zona
    )

    console.log(
        "✅ Zona de navegación creada"
    )
}
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

botonEntrada.material.transparent = true
botonEntrada.material.opacity = 0

botonCarteles.material.transparent = true
botonCarteles.material.opacity = 0

botonLogo.material.transparent = true
botonLogo.material.opacity = 0

luzEntrada = new THREE.PointLight(
    0xfff1c7,
    0.8,
    10
)

botonEntrada.getWorldPosition(posicionPunto)
luzEntrada.position.copy(posicionPunto)
luzEntrada.position.y += 0.2

scene.add(luzEntrada)


luzCarteles = new THREE.PointLight(
    0xfff1c7,
    0.8,
    10
)

botonCarteles.getWorldPosition(posicionPunto)
luzCarteles.position.copy(posicionPunto)
luzCarteles.position.y += 0.2

scene.add(luzCarteles)


luzLogo = new THREE.PointLight(
    0xfff1c7,
    0.8,
    10
)

botonLogo.getWorldPosition(posicionPunto)
luzLogo.position.copy(posicionPunto)
luzLogo.position.y += 0.2

scene.add(luzLogo)

entrada = model.getObjectByName("Entrada")
carteles = model.getObjectByName("Carteles")
logo = model.getObjectByName("Logo")

MiraEntrada = model.getObjectByName("MiraEntrada")
MiraCarteles = model.getObjectByName("MiraCarteles")
MiraLogo = model.getObjectByName("MiraLogo")

    iniciarExperiencia()

// La animación comienza mientras todavía estamos cubriendo la pantalla
tiempoInicio = performance.now()
moviendoCamara = true

clearInterval(intervaloFrases)

textoCarga.textContent = 'Preparando tu recorrido...'

// Después dejamos descubrir el parque
setTimeout(() => {

    pantallaCarga.style.opacity = '0'

    setTimeout(() => {
        pantallaCarga.style.display = 'none'
    }, 1000)

}, 100)

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

  },

function (xhr) {

    if (xhr.lengthComputable) {

        const porcentaje = (xhr.loaded / xhr.total) * 100

        document.getElementById('progresoCarga').style.width =
            `${porcentaje}%`

        document.getElementById('porcentajeCarga').textContent =
            `${Math.round(porcentaje)}%`

        console.log(
            `Descargando modelo: ${Math.round(porcentaje)}%`
        )

    }

},

  function (error) {

    console.error('Error cargando el modelo:', error)
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

    capasNiebla.push({
    capa: capa,
    opacidadBase: opacidad
})
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

function actualizarBillboards() {

    const direccionCamara = new THREE.Vector3()

    camera.getWorldDirection(direccionCamara)

    billboards.forEach(arbol => {

        arbol.castShadow = false
        arbol.receiveShadow = false
        arbol.renderOrder = 2

        // Durante las transiciones solo actualizamos
        // los billboards que están delante de la cámara.
        if (moviendoCamara) {

            const direccionArbol = new THREE.Vector3(
                arbol.position.x - camera.position.x,
                0,
                arbol.position.z - camera.position.z
            )

            direccionArbol.normalize()

            const direccionCamaraHorizontal = new THREE.Vector3(
                direccionCamara.x,
                0,
                direccionCamara.z
            ).normalize()

            const visible = direccionCamaraHorizontal.dot(
                direccionArbol
            ) > 0

            if (!visible) return
        }

        const dx = camera.position.x - arbol.position.x
        const dz = camera.position.z - arbol.position.z

        const angulo = Math.atan2(dz, dx)

        arbol.rotation.z = angulo + Math.PI / 2

    })


    billboardsNuevos.forEach(arbol => {

        if (moviendoCamara) {

            const direccionArbol = new THREE.Vector3(
                arbol.position.x - camera.position.x,
                0,
                arbol.position.z - camera.position.z
            )

            direccionArbol.normalize()

            const direccionCamaraHorizontal = new THREE.Vector3(
                direccionCamara.x,
                0,
                direccionCamara.z
            ).normalize()

            const visible = direccionCamaraHorizontal.dot(
                direccionArbol
            ) > 0

            if (!visible) return
        }

        const dx = camera.position.x - arbol.position.x
        const dz = camera.position.z - arbol.position.z

        const angulo = Math.atan2(dx, dz)

        arbol.userData.rotacionBillboardBase = angulo
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

        arbol.userData.rotacionZBase = arbol.rotation.z

        scene.add(arbol)

        billboardsNuevos.push(arbol)

animacionesVegetacion.push({
    objeto: arbol,
    fase: Math.random() * Math.PI * 2,
    amplitud: 0.035 + Math.random() * 0.035,
    velocidad: 0.4 + Math.random() * 0.3
})

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
function iniciarExperiencia() {

    duracionTransicion = 2000

    camera.rotation.order = 'YXZ'

    // Posición final
    entrada.getWorldPosition(posicionDestino)

    // Punto al que debe mirar
    MiraEntrada.getWorldPosition(posicionMira)

    // Calculamos la rotación final
    camera.position.copy(posicionDestino)
    camera.lookAt(posicionMira)

    // Evitamos que la cámara pueda quedar inclinada
    camera.rotation.z = 0

    rotacionDestino.copy(camera.quaternion)

    // Regresamos a la posición inicial
    camera.position.copy(posicionDestino)

    // Nos alejamos hacia atrás
    camera.position.x += -3

    // Miramos nuevamente hacia la entrada
    camera.lookAt(posicionMira)

    // Evitamos el giro de cabeza
    camera.rotation.z = 0

    posicionInicio.copy(camera.position)
    rotacionInicio.copy(camera.quaternion)

    tiempoInicio = performance.now()

    moviendoCamara = false
}

function easeInOutSine(t) {

    return -(Math.cos(Math.PI * t) - 1) / 2

}

function mostrarRutaDebug(ruta) {

    // Borrar ruta anterior
    debugRuta.forEach(objeto => {
        scene.remove(objeto)
    })

    debugRuta.length = 0

    // Crear puntos
    ruta.forEach((punto, i) => {

        const geometria = new THREE.SphereGeometry(
            0.3,
            12,
            12
        )

        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        })

        const esfera = new THREE.Mesh(
            geometria,
            material
        )

        esfera.position.copy(punto)

        scene.add(esfera)

        debugRuta.push(esfera)
    })

    // Crear línea
    if (ruta.length > 1) {

        const puntos = ruta.map(
            punto => punto.clone()
        )

        const geometriaLinea =
            new THREE.BufferGeometry().setFromPoints(
                puntos
            )

        const materialLinea =
            new THREE.LineBasicMaterial({
                color: 0xff0000
            })

        const linea = new THREE.Line(
            geometriaLinea,
            materialLinea
        )

        scene.add(linea)

        debugRuta.push(linea)
    }
}

function irASuave(punto, mira, seccion = null) {

    seccionDestino = seccion

    duracionTransicion = 4500

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

    camaraCambio = true
}

function moverAClick(posicion) {

    if (
        !navMesh ||
        camaraBloqueada ||
        moviendoLetrero ||
        moviendoRuta ||
        moviendoCamara
    ) {
        return
    }

    // -----------------------------
    // POSICIÓN DEL JUGADOR
    // -----------------------------

    const posicionInicio = new THREE.Vector3()

    const rayOrigen = camera.position.clone()

    rayOrigen.y += 2

    const rayDireccion = new THREE.Vector3(
        0,
        -1,
        0
    )

    const raySuelo = new THREE.Raycaster(
        rayOrigen,
        rayDireccion
    )

    const interseccionInicio =
        raySuelo.intersectObject(
            navMesh,
            true
        )

    if (interseccionInicio.length === 0) {

        console.warn(
            "⚠️ No se encontró la posición actual sobre la NavMesh"
        )

        return
    }

    posicionInicio.copy(
        interseccionInicio[0].point
    )

    // -----------------------------
    // DISTANCIA AL CLICK
    // -----------------------------

    const distanciaClick = Math.sqrt(
        Math.pow(
            posicion.x - posicionInicio.x,
            2
        ) +
        Math.pow(
            posicion.z - posicionInicio.z,
            2
        )
    )
    if (distanciaClick < DISTANCIA_MINIMA_CLICK) {

    console.log(
        "📍 Click demasiado cerca, ignorado"
    )

    return
}

if (distanciaClick > DISTANCIA_MAXIMA_CLICK) {

    console.log(
        "📍 Click demasiado lejos, ignorado"
    )

    return
}

    // -----------------------------
    // IGNORAR CLICK MUY CERCANO
    // -----------------------------

    if (distanciaClick < DISTANCIA_MINIMA_CLICK) {

        console.log(
            "📍 Click demasiado cerca, ignorado"
        )

        return
    }

    // -----------------------------
    // VELOCIDAD SEGÚN DISTANCIA
    // -----------------------------

    velocidadActual = THREE.MathUtils.lerp(
        VELOCIDAD_MINIMA,
        VELOCIDAD_MAXIMA,
        THREE.MathUtils.clamp(
            (distanciaClick - DISTANCIA_VELOCIDAD_NORMAL) /
            (DISTANCIA_VELOCIDAD_MAXIMA - DISTANCIA_VELOCIDAD_NORMAL),
            0,
            1
        )
    )

    // -----------------------------
    // GRUPO DE NAVEGACIÓN
    // -----------------------------

    grupoNavMesh = pathfinding.getGroup(
        ZONA_PARQUE,
        posicionInicio
    )

    if (grupoNavMesh === null) {

        console.warn(
            "⚠️ No se encontró grupo de navegación"
        )

        return
    }

    // -----------------------------
    // BUSCAR RUTA
    // -----------------------------

    const ruta = pathfinding.findPath(
        posicionInicio,
        posicion,
        ZONA_PARQUE,
        grupoNavMesh
    )

    if (!ruta || ruta.length === 0) {

        console.warn(
            "⚠️ No existe una ruta hacia ese punto"
        )

        return
    }

    console.log(
        "🧭 Ruta encontrada:",
        ruta
    )

    // -----------------------------
    // INICIAR RECORRIDO
    // -----------------------------

    rutaActual = ruta
    indiceRuta = 0
    direccionSuave.set(0, 0, 0)
    moviendoRuta = true
}

function actualizarRuta() {

    if (!moviendoRuta) return

    if (indiceRuta >= rutaActual.length) {

        moviendoRuta = false
        rutaActual = []

        return
    }

    const objetivo = rutaActual[indiceRuta]

    // ============================================
    // DIRECCIÓN HACIA EL WAYPOINT ACTUAL
    // ============================================

    const dx = objetivo.x - camera.position.x
    const dz = objetivo.z - camera.position.z

    const distancia = Math.sqrt(
        dx * dx +
        dz * dz
    )

    // ============================================
    // LLEGAMOS AL WAYPOINT
    // ============================================

    if (distancia < 0.25) {

        camera.position.x = objetivo.x
        camera.position.z = objetivo.z

        indiceRuta++

        return
    }

    // ============================================
    // DIRECCIÓN DESEADA
    // ============================================

    const direccionObjetivo = new THREE.Vector3(
        dx / distancia,
        0,
        dz / distancia
    )

    // ============================================
    // SUAVIZAR EL CAMBIO DE DIRECCIÓN
    // ============================================

    if (direccionSuave.lengthSq() === 0) {

        direccionSuave.copy(
            direccionObjetivo
        )

    } else {

        direccionSuave.lerp(
            direccionObjetivo,
            0.08
        )

        direccionSuave.normalize()
    }

    // ============================================
    // MOVIMIENTO
    // ============================================

    const paso =
        VELOCIDAD_RECORRIDO * 0.016

    const movimiento =
        Math.min(paso, distancia)

    camera.position.x +=
        direccionSuave.x * movimiento

    camera.position.z +=
        direccionSuave.z * movimiento

    // ============================================
    // ALTURA FIJA
    // ============================================

    camera.position.y = ALTURA_CAMARA

    // ============================================
    // GIRAR CÁMARA SUAVEMENTE
    // ============================================

    const direccionMirada =
        direccionSuave.clone()

    direccionMirada.y = 0

    const anguloObjetivo =
        Math.atan2(
            -direccionMirada.x,
            -direccionMirada.z
        )

    let diferencia =
        anguloObjetivo - camera.rotation.y

    // Mantener el ángulo entre -PI y PI
    diferencia =
        Math.atan2(
            Math.sin(diferencia),
            Math.cos(diferencia)
        )

    camera.rotation.y +=
        diferencia * 0.01

    camera.rotation.z = 0
}
function irA(punto, mira) {

    camera.rotation.order = 'YXZ'

    punto.getWorldPosition(posicionPunto)
    mira.getWorldPosition(posicionMira)

    camera.position.copy(posicionPunto)

    camera.lookAt(posicionMira)

    camera.rotation.z = 0
}

function moverLetreroFrenteCamara(letrero) {

    if (moviendoLetrero) return

        // Crear clon visual en la posición original
    clonLetrero = letrero.clone(true)

    clonLetrero.position.copy(letrero.position)
    clonLetrero.quaternion.copy(letrero.quaternion)
    clonLetrero.scale.copy(letrero.scale)

    clonLetrero.traverse((child) => {

        if (child.isMesh) {

            child.castShadow = false
            child.receiveShadow = false

        }

    })

    letrero.parent.add(clonLetrero)

    moviendoLetrero = true
        camaraBloqueada = true
        cerrandoLetrero = false

    letreroActivo = letrero
    
    letrero.userData.posicionOriginal =
    letrero.position.clone()

letrero.userData.rotacionOriginal =
    letrero.quaternion.clone()
    
    if (letrero === letrero1) {

    tituloLetrero.textContent = "Información"

    textoLetrero.textContent =
        "Aquí podremos colocar la información correspondiente a este letrero."

} else if (letrero === letrero2) {

    tituloLetrero.textContent = "Nuestra historia"

    textoLetrero.textContent =
        "Aquí podremos colocar la información correspondiente a este letrero."

}

    rotacionOriginalLetrero.copy(
    letrero.quaternion
)

    // -------------------------
    // POSICIÓN ORIGINAL
    // -------------------------

    const posicionMundo = new THREE.Vector3()

    letrero.getWorldPosition(posicionMundo)

    posicionOriginalLetrero.copy(posicionMundo)


    // -------------------------
    // POSICIÓN DESTINO
    // -------------------------

    const direccion = new THREE.Vector3()

    camera.getWorldDirection(direccion)

    posicionDestinoLetrero.copy(
        camera.position
    )

    posicionDestinoLetrero.add(
        direccion.multiplyScalar(3)
    )


    // -------------------------
    // CARA AMPLIA DEL LETRERO
    // -------------------------

    // El letrero mide aproximadamente:
    // X = grosor
    // Y = alto
    // Z = ancho
    //
    // Por lo tanto su cara amplia
    // tiene normal en X.

    const direccionHaciaCamara =
        new THREE.Vector3(
            camera.position.x - posicionDestinoLetrero.x,
            0,
            camera.position.z - posicionDestinoLetrero.z
        )

    direccionHaciaCamara.normalize()


    // Eje que sale perpendicularmente
    // de la cara amplia del letrero.

    const normalCara =
        new THREE.Vector3(1, 0, 0)


    // Rotación mundial deseada:
    // X del letrero → cámara

    const rotacionMundoDestino =
        new THREE.Quaternion()

    rotacionMundoDestino.setFromUnitVectors(
        normalCara,
        direccionHaciaCamara
    )

const ajuste = new THREE.Quaternion()

ajuste.setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    THREE.MathUtils.degToRad(-155)
)

rotacionMundoDestino.multiply(ajuste)

    // -------------------------
    // CONVERTIR WORLD → LOCAL
    // -------------------------

    const rotacionPadre =
        new THREE.Quaternion()

    if (letrero.parent) {

        letrero.parent.getWorldQuaternion(
            rotacionPadre
        )

    }

    const inversaPadre =
        rotacionPadre.clone().invert()


    rotacionDestinoLetrero.copy(
        inversaPadre
    ).multiply(
        rotacionMundoDestino
    )


    // -------------------------
    // COMIENZA LA ANIMACIÓN
    // -------------------------

    tiempoInicioLetrero =
        performance.now()
}

function cerrarLetrero() {

    if (!letreroActivo || moviendoLetrero) return

    panelLetrero.classList.remove('visible')
    fondoOscuroLetrero.classList.remove('visible')
    
    cerrandoLetrero = true

    posicionOriginalLetrero.copy(
        letreroActivo.position
    )

    rotacionOriginalLetrero.copy(
        letreroActivo.quaternion
    )

    posicionDestinoLetrero.set(
        letreroActivo.userData.posicionOriginal.x,
        letreroActivo.userData.posicionOriginal.y,
        letreroActivo.userData.posicionOriginal.z
    )

    rotacionDestinoLetrero.copy(
        letreroActivo.userData.rotacionOriginal
    )

    moviendoLetrero = true
    letreroAbierto = false

    tiempoInicioLetrero = performance.now()
}

const raycaster = new THREE.Raycaster()
//Donde hace click el usuario
const mouse = new THREE.Vector2()

let objetoHover = null

const indicadorInteractivo = document.createElement('div')

indicadorInteractivo.id = 'indicadorInteractivo'

document.body.appendChild(indicadorInteractivo)

renderer.domElement.addEventListener('pointerdown', () => {

    if (camaraBloqueada) return

    arrastrando = true
})

renderer.domElement.addEventListener('pointermove', (event) => {

    // =========================
    // MOVIMIENTO DE CÁMARA
    // =========================

    if (arrastrando && !moviendoCamara && !camaraBloqueada) {

        camera.rotation.y -= event.movementX * 0.005
        camera.rotation.x -= event.movementY * 0.003

        camera.rotation.x = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, camera.rotation.x)
        )

        camera.rotation.z = 0

    camaraCambio = true
    }


    // =========================
    // HOVER DE OBJETOS
    // =========================

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersecciones = raycaster.intersectObjects(
        objetosInteractivos,
        true
    )

    if (intersecciones.length > 0) {

        const objeto = intersecciones[0].object

if (objeto !== objetoHover) {

    objetoHover = objeto

if (objeto.name === "BotonEntrada") {

    indicadorInteractivo.textContent = "Explorar entrada"
    indicadorInteractivo.classList.add('visible')

    hoverEntrada = true
    hoverCarteles = false
    hoverLogo = false

} else if (objeto.name === "BotonCarteles") {

    indicadorInteractivo.textContent = "Explorar carteles"
    indicadorInteractivo.classList.add('visible')

    hoverEntrada = false
    hoverCarteles = true
    hoverLogo = false

} else if (objeto.name === "BotonLogo") {

    indicadorInteractivo.textContent = "Conocer San Martín"
    indicadorInteractivo.classList.add('visible')

    hoverEntrada = false
    hoverCarteles = false
    hoverLogo = true

} else if (
    objeto.name === "Letrero_1" ||
    objeto.name === "Letrero2"
) {

    indicadorInteractivo.textContent = "Ver información"
    indicadorInteractivo.classList.add('visible')

    hoverEntrada = false
    hoverCarteles = false
    hoverLogo = false

} else {

    indicadorInteractivo.classList.remove('visible')

    hoverEntrada = false
    hoverCarteles = false
    hoverLogo = false
}
}

indicadorInteractivo.style.left = `${event.clientX}px`
indicadorInteractivo.style.top = `${event.clientY}px`

    } else {

        if (objetoHover !== null) {

            objetoHover = null

            indicadorInteractivo.classList.remove('visible')
                    hoverEntrada = false
    hoverCarteles = false
    hoverLogo = false
        }
    }

})

document.addEventListener('pointerup', () => {

    arrastrando = false

})

cerrarPanelCarteles.addEventListener('click', () => {

    panelCarteles.classList.remove('visible')

})

cerrarPanelLogo.addEventListener('click', () => {

    panelLogo.classList.remove('visible')

})

botonMapaEntrada.addEventListener('click', () => {

    panelMapa.classList.remove('visible')

    pantallaProximamente.classList.remove('visible')

    setTimeout(() => {

        window.location.reload()

    }, 500)

})

botonMapaNichos.addEventListener('click', () => {

    panelMapa.classList.remove('visible')

    pantallaProximamente.classList.add('visible')

    ventanaImagen.classList.remove('visible')

})

botonMapaEstacionamiento.addEventListener('click', () => {

    panelMapa.classList.remove('visible')

    pantallaProximamente.classList.add('visible')

    ventanaImagen.classList.remove('visible')

})

renderer.domElement.addEventListener('click', (event) => {

    if (camaraBloqueada) return

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    // ============================================
    // 1. PRIMERO: BOTONES Y LETREROS
    // ============================================

    const interacciones = raycaster.intersectObjects(
        objetosInteractivos,
        true
    )

    if (interacciones.length > 0) {

        const nombre = interacciones[0].object.name

        if (nombre === "Letrero_1") {

            moverLetreroFrenteCamara(letrero1)

            return
        }

        if (nombre === "Letrero2") {

            moverLetreroFrenteCamara(letrero2)

            return
        }

        if (nombre === "BotonEntrada") {

            irASuave(entrada, MiraEntrada)

            return
        }

        if (nombre === "BotonCarteles") {

            irASuave(carteles, MiraCarteles, "carteles")

            return
        }

        if (nombre === "BotonLogo") {

            irASuave(logo, MiraLogo, "logo")

            return
        }
    }

    const interseccionesNavMesh =
    raycaster.intersectObject(
        navMesh,
        true
    )

if (interseccionesNavMesh.length > 0) {

    const puntoDestino =
        interseccionesNavMesh[0].point

    moverAClick(puntoDestino)
}
})

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

    actualizarRuta()

    if (moviendoCamara) {

    const tiempoActual = performance.now()

const progreso = Math.min(
    (tiempoActual - tiempoInicio) / duracionTransicion,
    1
)

const progresoSuave = easeInOutSine(progreso)

camera.position.lerpVectors(
    posicionInicio,
    posicionDestino,
    progresoSuave
)

camera.quaternion.slerpQuaternions(
    rotacionInicio,
    rotacionDestino,
    progresoSuave
)

if (progreso >= 1) {

    camera.position.copy(posicionDestino)
    camera.quaternion.copy(rotacionDestino)

    moviendoCamara = false

    if (seccionDestino === "carteles") {

        panelCarteles.classList.add('visible')
        seccionDestino = null

    } else if (seccionDestino === "logo") {

        panelLogo.classList.add('visible')
        seccionDestino = null
    }

    if (!bienvenidaMostrada) {

        bienvenidaMostrada = true

        setTimeout(() => {

            mensajeBienvenida.classList.add('visible')

            setTimeout(() => {
                mensajeBienvenida.classList.remove('visible')
            }, 1500)

        }, 500)
    }
}

}

if (moviendoLetrero && letreroActivo) {

    const tiempoActual = performance.now()

    const progreso = Math.min(
        (tiempoActual - tiempoInicioLetrero) /
        duracionAnimacionLetrero,
        1
    )

    const progresoSuave =
        easeInOutSine(progreso)

    letreroActivo.position.lerpVectors(
        posicionOriginalLetrero,
        posicionDestinoLetrero,
        progresoSuave
    )

    letreroActivo.quaternion.slerpQuaternions(
        rotacionOriginalLetrero,
        rotacionDestinoLetrero,
        progresoSuave
    )

if (progreso >= 1) {

    letreroActivo.position.copy(
        posicionDestinoLetrero
    )

    letreroActivo.quaternion.copy(
        rotacionDestinoLetrero
    )

    moviendoLetrero = false

    if (cerrandoLetrero) {

        camaraBloqueada = false

            if (clonLetrero) {

        clonLetrero.parent.remove(clonLetrero)
        clonLetrero = null

    }

        letreroActivo = null
        cerrandoLetrero = false

    } else {

        letreroAbierto = true

panelLetrero.classList.add('visible')
        fondoOscuroLetrero.classList.add('visible')
    }
}
}

if (moviendoCamara) {
    camaraCambio = true
}

if (camaraCambio) {

    actualizarBillboards()

    camaraCambio = false
}

const tiempoNiebla = performance.now() * 0.00015

const pulsoNiebla =
    (Math.sin(tiempoNiebla) + 1) / 2

capasNiebla.forEach(niebla => {

    const factor =
        0.92 + pulsoNiebla * 0.16

    niebla.capa.material.opacity =
        niebla.opacidadBase * factor

})

const tiempoVientoGLB = performance.now() * 0.001

animacionesBillboardsGLB.forEach(animacion => {

    const movimiento =
        Math.sin(
            tiempoVientoGLB * animacion.velocidad +
            animacion.fase
        ) * animacion.amplitud

    animacion.objeto.rotation.x =
        animacion.rotacionXBase + movimiento

})

const tiempoViento = performance.now() * 0.001

animacionesVegetacion.forEach(animacion => {

    const movimiento =
        Math.sin(
            tiempoViento * animacion.velocidad +
            animacion.fase
        ) * animacion.amplitud
        
animacion.objeto.rotation.z =
    animacion.objeto.userData.rotacionZBase + movimiento

})

tiempoLuz += 0.012

const pulso = (Math.sin(tiempoLuz) + 1) / 2


if (luzEntrada) {

    luzEntrada.intensity = hoverEntrada
        ? 5 + pulso * 2
        : 2 + pulso * 1

}


if (luzCarteles) {

    luzCarteles.intensity = hoverCarteles
        ? 5 + pulso * 2
        : 2 + pulso * 1

}


if (luzLogo) {

    luzLogo.intensity = hoverLogo
        ? 5 + pulso * 2
        : 2 + pulso * 1

}

renderer.render(scene, camera)

}

//----------------//

animate()