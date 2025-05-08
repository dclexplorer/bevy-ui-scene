export class RandomSeed {
  private seed: number

  constructor(seed: string) {
    this.seed = this.stringToSeed(seed)
  }

  // Convierte un string en un número (simple hash)
  private stringToSeed(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = (hash << 5) - hash + char // Similar a un hash simple
      hash |= 0 // Fuerza el resultado a un entero de 32 bits
    }
    return Math.abs(hash) // Asegurarse de que sea positivo
  }

  // Genera un número pseudo-aleatorio entre 0 y 1
  private randomSeed(): number {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  // Devuelve un número aleatorio entre min (inclusive) y max (exclusive)
  public next(min: number, max: number): number {
    return Math.floor(this.randomSeed() * (max - min) + min)
  }

  // Devuelve un número aleatorio entre 0 (inclusive) y 1 (exclusive)
  public nextFloat(): number {
    return this.randomSeed()
  }
}
