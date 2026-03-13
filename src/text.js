export function renderText(value) {
  let text = String(value ?? '')

  text = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (!/[ÃÂ]/.test(text)) break

    try {
      const bytes = Uint8Array.from(text, (char) => char.charCodeAt(0) & 0xff)
      const repaired = new TextDecoder('utf-8').decode(bytes)

      if (repaired && repaired !== text) {
        text = repaired
      } else {
        break
      }
    } catch {
      break
    }
  }

  return text
}
