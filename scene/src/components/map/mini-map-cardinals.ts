type Cardinal = 'N' | 'E' | 'S' | 'W'

interface CardinalPositions {
  N: { x: number; y: number }
  E: { x: number; y: number }
  S: { x: number; y: number }
  W: { x: number; y: number }
}

/**
 * Devuelve las posiciones de N,E,S,W en píxeles dentro de un minimapa cuadrado
 * centrado, dado su tamaño y el ángulo de rotación (en grados).
 *
 * @param size Tamaño del minimapa en px (width === height)
 * @param rotationDeg Rotación del minimapa en grados (0 = norte hacia arriba, sentido horario positivo)
 * @param margin Margen interior desde el borde donde colocar las etiquetas (px)
 */
export function getCardinalLabelPositions(
  size: number,
  rotationDeg: number,
  margin = 8
): CardinalPositions {
  const half = size / 2
  const radius = half - margin

  const cx = half
  const cy = half

  // convertir grados a radianes
  const theta = (rotationDeg * Math.PI) / 180

  const rotate = (x: number, y: number, angleRad: number) => {
    const c = Math.cos(angleRad)
    const s = Math.sin(angleRad)
    return { x: x * c - y * s, y: x * s + y * c }
  }

  const toSquareEdge = (dx: number, dy: number) => {
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)
    const t = radius / Math.max(adx || 1e-9, ady || 1e-9)
    return { x: cx + dx * t, y: cy + dy * t }
  }

  const base = {
    N: { x: 0, y: -1 },
    E: { x: 1, y: 0 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 }
  } as const

  const Ndir = rotate(base.N.x, base.N.y, theta)
  const Edir = rotate(base.E.x, base.E.y, theta)
  const Sdir = rotate(base.S.x, base.S.y, theta)
  const Wdir = rotate(base.W.x, base.W.y, theta)

  return {
    N: toSquareEdge(Ndir.x, Ndir.y),
    E: toSquareEdge(Edir.x, Edir.y),
    S: toSquareEdge(Sdir.x, Sdir.y),
    W: toSquareEdge(Wdir.x, Wdir.y)
  }
}
