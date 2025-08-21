// worldToScreen.ts
import { Entity, Transform } from '@dcl/sdk/ecs'
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
  return { x: -q.x, y: -q.y, z: -q.z, w: q.w } as Quaternion
}

function rotateVecByQuat(v: Vector3, q: Quaternion): Vector3 {
  // q * v * q^{-1}
  const qx = q.x,
    qy = q.y,
    qz = q.z,
    qw = q.w
  const vx = v.x,
    vy = v.y,
    vz = v.z
  const tx = 2 * (qy * vz - qz * vy)
  const ty = 2 * (qz * vx - qx * vz)
  const tz = 2 * (qx * vy - qy * vx)
  return {
    x: vx + qw * tx + (qy * tz - qz * ty),
    y: vy + qw * ty + (qz * tx - qx * tz),
    z: vz + qw * tz + (qx * ty - qy * tx)
  } as Vector3
}

function rotateVec3ByQuat(v: Vector3, q: Quaternion): Vector3 {
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
) {
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

  const left = (ndcX + 1) * 0.5 * viewportWidth
  const top = (1 - (ndcY + 1) * 0.5) * viewportHeight

  const onScreen = ndcX >= -1 && ndcX <= 1 && ndcY >= -1 && ndcY <= 1
  return { left, top, onScreen }
}
