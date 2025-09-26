// worldToScreen.ts
import { type Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

type ScreenPos = {
  left: number
  top: number
  onScreen: boolean
  behind: boolean
  ndc: { x: number; y: number; z: number }
}

export function perspectiveToScreenPosition(
  camEntity: Entity,
  worldPos: Vector3,
  viewW: number,
  viewH: number,
  fovY: number // en radianes
): ScreenPos {
  const camT = Transform.get(camEntity)
  const camPos = camT.position
  const camRot = camT.rotation as Quaternion

  // 1) Mundo -> espacio cámara
  const toCam = Vector3.subtract(worldPos, camPos)
  const invRot = quatConjugate(camRot) // <= conjugada manual
  const pCam = rotateVecByQuat(toCam, invRot) // aplica invRot

  // Convención: cámara mira a -Z
  const behind = pCam.z >= 0

  // 2) Cámara -> NDC
  const aspect = viewW / viewH
  const f = 1 / Math.tan(fovY * 0.5)
  const zForDivide = -pCam.z || 1e-6
  const xNdc = (pCam.x * f) / aspect / zForDivide
  const yNdc = (pCam.y * f) / zForDivide
  const zNdc = -pCam.z

  // 3) NDC -> pantalla
  const x = (xNdc * 0.5 + 0.5) * viewW
  const y = (1 - (yNdc * 0.5 + 0.5)) * viewH
  const onScreen = !behind && x >= 0 && x <= viewW && y >= 0 && y <= viewH

  return {
    left: x,
    top: y,
    onScreen,
    behind,
    ndc: { x: xNdc, y: yNdc, z: zNdc }
  }
}

// ===== helpers =====

function quatConjugate(q: Quaternion): Quaternion {
  return Quaternion.create(-q.x, -q.y, -q.z, q.w)
}

function rotateVecByQuat(v: Vector3, q: Quaternion): Vector3 {
  // q * v * q^{-1}
  const qx = q.x
  const qy = q.y
  const qz = q.z
  const qw = q.w
  const vx = v.x
  const vy = v.y
  const vz = v.z
  const tx = 2 * (qy * vz - qz * vy)
  const ty = 2 * (qz * vx - qx * vz)
  const tz = 2 * (qx * vy - qy * vx)

  return Vector3.create(
    vx + qw * tx + (qy * tz - qz * ty),
    vy + qw * ty + (qz * tx - qx * tz),
    vz + qw * tz + (qx * ty - qy * tx)
  )
}

export function rotateVec3ByQuat(v: Vector3, q: Quaternion): Vector3 {
  // v' = v + 2*q.w*(q.xyz × v) + 2*(q.xyz × (q.xyz × v))
  const cx1 = q.y * v.z - q.z * v.y
  const cy1 = q.z * v.x - q.x * v.z
  const cz1 = q.x * v.y - q.y * v.x
  const uX = q.w * cx1 + (q.y * cz1 - q.z * cy1)
  const uY = q.w * cy1 + (q.z * cx1 - q.x * cz1)
  const uZ = q.w * cz1 + (q.x * cy1 - q.y * cx1)
  return Vector3.create(v.x + 2 * uX, v.y + 2 * uY, v.z + 2 * uZ)
}

// Convierte FOV horizontal -> vertical si es necesario
function verticalFovFrom(
  fovRad: number,
  viewportWidth: number,
  viewportHeight: number,
  isHorizontal: boolean
): number {
  if (!isHorizontal) return fovRad
  const aspect = viewportWidth / viewportHeight
  return 2 * Math.atan(Math.tan(fovRad / 2) / aspect)
}

type WorldToScreenOptions = {
  /** Si true, fovRad es horizontal y se convierte a vertical internamente */
  fovIsHorizontal?: boolean
  /** En DCL/Unity el forward es +Z, así que por defecto false */
  forwardIsNegZ?: boolean
}

export function worldToScreenPx(
  world: Vector3,
  cameraPos: Vector3,
  cameraRot: Quaternion,
  fovRad: number, // puede ser V u H según options.fovIsHorizontal
  viewportWidth: number,
  viewportHeight: number,
  options: WorldToScreenOptions = {}
): { left: number; top: number; onScreen: boolean } {
  const forwardIsNegZ = options.forwardIsNegZ ?? false // DCL/Unity: +Z forward
  const verticalFovRad = verticalFovFrom(
    fovRad,
    viewportWidth,
    viewportHeight,
    !!options.fovIsHorizontal
  )

  // vector relativo
  const rel = Vector3.create(
    world.x - cameraPos.x,
    world.y - cameraPos.y,
    world.z - cameraPos.z
  )

  // inversa de la rotación: inv(q) = (-x,-y,-z,w)
  const inv = Quaternion.create(
    -cameraRot.x,
    -cameraRot.y,
    -cameraRot.z,
    cameraRot.w
  )

  // pasamos al espacio cámara
  const cam = rotateVec3ByQuat(rel, inv)

  const aspect = viewportWidth / viewportHeight
  const tanHalf = Math.tan(verticalFovRad / 2)

  const depth = forwardIsNegZ ? -cam.z : cam.z
  if (depth <= 0) return { top: -100, left: -100, onScreen: false } // detrás de la cámara

  const ndcX = cam.x / (depth * tanHalf * aspect)
  const ndcY = cam.y / (depth * tanHalf)

  const left = Math.floor((ndcX + 1) * 0.5 * viewportWidth)
  const top = Math.floor((1 - (ndcY + 1) * 0.5) * viewportHeight)

  const onScreen = ndcX >= -1 && ndcX <= 1 && ndcY >= -1 && ndcY <= 1
  return { left, top, onScreen }
}

/**
 * Panning en el plano XZ.
 * - deltaX -> derecha/izquierda en pantalla
 * - deltaY -> arriba/abajo en pantalla
 * 'mpp' = metros por píxel (sensibilidad).
 */
export function panCameraXZ(
  camPos: Vector3,
  camRot: Quaternion,
  deltaX: number,
  deltaY: number,
  mpp = 1
): Vector3 {
  // direcciones locales proyectadas al suelo
  const right = rotateVec3ByQuat(Vector3.create(1, 0, 0), camRot)
  const forward = rotateVec3ByQuat(Vector3.create(0, 0, 1), camRot)

  const lenR = Math.hypot(right.x, right.z) || 1
  const lenF = Math.hypot(forward.x, forward.z) || 1

  const dirR = { x: right.x / lenR, z: right.z / lenR }
  const dirF = { x: forward.x / lenF, z: forward.z / lenF }

  // deltaY positivo (arrastrar abajo) → mover hacia atrás,
  // por eso usamos "-deltaY"
  const dx = dirR.x * deltaX * mpp + dirF.x * (-deltaY * mpp)
  const dz = dirR.z * deltaX * mpp + dirF.z * (-deltaY * mpp)

  return Vector3.create(camPos.x + dx, camPos.y, camPos.z + dz)
}

/**
 * Convierte un click en pantalla a un punto en el plano Y=0.
 *
 * @param clickX coord x del click en px
 * @param clickY coord y del click en px
 * @param viewportW ancho canvas px
 * @param viewportH alto canvas px
 * @param camPos posicion de camara
 * @param camRot rotacion de camara
 * @param verticalFovRad FOV vertical en radianes
 * @returns Vector3 en el plano Y=0 o null si el rayo no cruza
 */
export function screenToGround(
  clickX: number,
  clickY: number,
  viewportW: number,
  viewportH: number,
  camPos: Vector3,
  camRot: Quaternion,
  verticalFovRad: number
): Vector3 | null {
  // coords normalizadas -1..1 (origen centro pantalla)
  const ndcX = (clickX / viewportW) * 2 - 1
  const ndcY = 1 - (clickY / viewportH) * 2

  const aspect = viewportW / viewportH
  const tanHalf = Math.tan(verticalFovRad / 2)

  // rayo en espacio de cámara (antes de rotar)
  const dirCam = Vector3.create(ndcX * aspect * tanHalf, ndcY * tanHalf, 1)

  // rayo en espacio mundo
  const dirWorld = rotateVec3ByQuat(dirCam, camRot)

  // intersección con plano Y=0:
  if (Math.abs(dirWorld.y) < 1e-6) return null
  const t = -camPos.y / dirWorld.y
  if (t < 0) return null // el plano está detrás de la cámara

  return Vector3.create(camPos.x + dirWorld.x * t, 0, camPos.z + dirWorld.z * t)
}
