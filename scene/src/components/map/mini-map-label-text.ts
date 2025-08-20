import { memoize } from '../../utils/function-utils'

function _wrapText(str: string): string {
  const MAX_LINES = 3
  const CHARS_PER_LINE = 16

  const WORDS_REGEXP = str.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (let word of WORDS_REGEXP) {
    // Si la palabra es más larga que charPerLine, cortarla con "-"
    while (word.length > CHARS_PER_LINE) {
      const part = word.slice(0, CHARS_PER_LINE - 1) + '-'
      if (lines.length + 1 >= MAX_LINES) {
        lines.push(part)
        return lines.join('\n')
      }
      lines.push(part)
      word = word.slice(CHARS_PER_LINE - 1)
    }

    if ((currentLine + ' ' + word).trim().length > CHARS_PER_LINE) {
      lines.push(currentLine.trim())
      currentLine = word
    } else {
      currentLine += (currentLine ? ' ' : '') + word
    }

    if (lines.length >= MAX_LINES) {
      return lines.join('\n')
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim())
  }

  return lines.slice(0, MAX_LINES).join('\n')
}

export const wrapText = memoize(_wrapText)
