export class RandomSeed {
  private seed: number

  constructor(seed: string) {
    this.seed = this.stringToSeed(seed)
  }

  private stringToSeed(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0
    }
    return Math.abs(hash)
  }

  private randomSeed(): number {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  public next(min: number, max: number): number {
    return Math.floor(this.randomSeed() * (max - min) + min)
  }

  public nextFloat(): number {
    return this.randomSeed()
  }
}
