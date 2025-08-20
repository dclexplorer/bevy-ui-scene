// worldToScreen.ts
import { Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

type ScreenPos = {
  x: number
  y: number
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

  return { x, y, onScreen, behind, ndc: { x: xNdc, y: yNdc, z: zNdc } }
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
