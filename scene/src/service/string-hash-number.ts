/**
 * Simple hash function that matches Rust's 64-bit FNV implementation
 * @param {string} str - The string to hash
 * @returns {bigint} - The hash value as BigInt for 64-bit precision
 */
function simpleHash(str: string): bigint {
  // Convert string to bytes (UTF-8)
  const bytes = utf8Encode(str)

  // Use BigInt for 64-bit arithmetic to match Rust
  let hash = 2166136261n // FNV offset basis as BigInt

  for (let i = 0; i < bytes.length; i++) {
    hash ^= BigInt(bytes[i])
    hash *= 16777619n // FNV prime as BigInt
    // Keep only 64 bits (simulate wrapping_mul behavior)
    hash = hash & 0xffffffffffffffffn
  }

  return hash
}

/**
 * Returns a deterministic number within the specified range [min, max] based on the input name.
 *
 * @param {string} name - The input string to hash
 * @param {number} min - The minimum value of the range (inclusive)
 * @param {number} max - The maximum value of the range (inclusive)
 * @returns {number} A number between min and max (inclusive)
 * @throws {Error} If min > max
 */
export function getHashNumber(name: string, min: number, max: number): number {
  if (min > max) {
    throw new Error('min cannot be greater than max')
  }

  if (min === max) {
    return min
  }

  const hash = simpleHash(name)
  const rangeSize = BigInt(max - min + 1)
  const mappedValue = Number(hash % rangeSize)

  return min + mappedValue
}

function utf8Encode(str: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code < 0x80) {
      bytes.push(code)
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6))
      bytes.push(0x80 | (code & 0x3f))
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12))
      bytes.push(0x80 | ((code >> 6) & 0x3f))
      bytes.push(0x80 | (code & 0x3f))
    } else {
      bytes.push(0xf0 | (code >> 18))
      bytes.push(0x80 | ((code >> 12) & 0x3f))
      bytes.push(0x80 | ((code >> 6) & 0x3f))
      bytes.push(0x80 | (code & 0x3f))
    }
  }
  return bytes
}
