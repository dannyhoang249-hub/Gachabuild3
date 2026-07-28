import path from 'path'
import { promises as fs } from 'fs'

export const runtime = 'nodejs'

// Serve character portrait images directly from the repo folder
// URL: /characters-img/<slug>.png -> data/game-content/PNG/<slug>.png
// Includes a small fallback map for filename mismatches

const PNG_DIR = path.join(process.cwd(), 'data/game-content', 'PNG')

const FALLBACK_MAP: Record<string, string> = {
  'protagonist.png': 'player.png',
  'truffle-filbert.png': 'trufle-filbert.png',
}

export async function GET(_req: Request, { params }: any) {
  try {
    const fileParam = params?.file
    const file = Array.isArray(fileParam) ? (fileParam[0] || '') : (fileParam || '')

    // Basic sanitization: only allow simple file names like slug.png
    if (!/^[a-z0-9\-]+\.png$/i.test(file)) {
      return new Response('Invalid filename', { status: 400 })
    }

    const filePath = path.join(PNG_DIR, file)

    // Try direct path first
    try {
      const data = await fs.readFile(filePath)
      return new Response(data, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch {}

    // Try fallback mapping (for known mismatches)
    const mapped = FALLBACK_MAP[file]
    if (mapped) {
      const mappedPath = path.join(PNG_DIR, mapped)
      try {
        const data = await fs.readFile(mappedPath)
        return new Response(data, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      } catch {}
    }

    return new Response('Not found', { status: 404 })
  } catch (err) {
    return new Response('Server error', { status: 500 })
  }
}

