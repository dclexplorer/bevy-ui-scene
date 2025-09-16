import { engine, Transform, Tween } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { store } from '../state/store'
import { updateHudStateAction } from '../state/hud/actions'
import { getBigMapCameraEntity, ISO_OFFSET_3 } from './map-camera'

export function createTween({
  startValue,
  endValue,
  time
}: {
  startValue: number
  endValue: number
  time: number
}) {
  const state = {
    startTime: Date.now(),
    startValue,
    endValue,
    totalDt: 0,
    value: startValue,
    done: false
  }

  const listeners = {
    update: new Set<(value: number, t: number) => void>(),
    complete: new Set<() => void>()
  }

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)

  function TweenSystem(dt: number): void {
    if (state.done) return

    state.totalDt += dt
    const t = clamp01(state.totalDt / time)

    state.value = lerp(state.startValue, state.endValue, t)

    // notificar actualizaciones
    for (const fn of listeners.update) fn(state.value, t)

    if (state.totalDt >= time) {
      state.value = state.endValue
      state.done = true
      engine.removeSystem(TweenSystem)
      // notificar finalización
      for (const fn of listeners.complete) fn()
      listeners.update.clear()
      listeners.complete.clear()
    }
  }

  engine.addSystem(TweenSystem)

  // Controlador para consultar/cancelar/suscribirse
  return {
    /** Valor actual interpolado (solo lectura) */
    get value() {
      return state.value
    },
    /** Cancela el tween inmediatamente */
    cancel() {
      if (!state.done) {
        state.done = true
        engine.removeSystem(TweenSystem)
        listeners.update.clear()
        listeners.complete.clear()
      }
    },
    /** Suscribirse a cambios; devuelve una función para desuscribirse */
    onUpdate(cb: (value: number, t: number) => void) {
      listeners.update.add(cb)
      return () => listeners.update.delete(cb)
    },
    /** Callback al completar */
    onComplete(cb: () => void) {
      listeners.complete.add(cb)
      return () => listeners.complete.delete(cb)
    }
  }
}

export const createMoveTween = (
  start: Vector3.ReadonlyVector3,
  end: Vector3.ReadonlyVector3,
  time: number,
  mutable: Vector3.MutableVector3
) => {
  createTween({
    startValue: 0,
    endValue: 1,
    time
  }).onUpdate((t) => {
    Object.assign(mutable, Vector3.lerp(start, end, t))
  })
}

export const createRotateTween = (
  startQuat: Quaternion,
  endQuat: Quaternion,
  time: number,
  mutableQuat: Quaternion
) => {
  createTween({
    startValue: 0,
    endValue: 1,
    time
  }).onUpdate((t) => {
    Object.assign(mutableQuat, Quaternion.slerp(startQuat, endQuat, t))
  })
}
