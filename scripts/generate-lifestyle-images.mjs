/**
 * Generates 3 lifestyle images for the ingredients section using Google Imagen 3.
 * Run once: node scripts/generate-lifestyle-images.mjs
 * Images are saved to /public/generated/ and committed as static assets.
 *
 * Requires GEMINI_API_KEY in .env.local
 */

import { GoogleGenAI } from "@google/genai"
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

// Load .env.local manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = join(ROOT, ".env.local")
  if (!existsSync(envPath)) throw new Error(".env.local not found")
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const [key, ...rest] = trimmed.split("=")
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim()
  }
}

loadEnv()

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey || apiKey === "your_gemini_api_key_here") {
  console.error("❌  Set GEMINI_API_KEY in .env.local before running this script.")
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey })

const OUTPUT_DIR = join(ROOT, "public", "generated")
mkdirSync(OUTPUT_DIR, { recursive: true })

const IMAGES = [
  {
    file: "lifestyle-shampoo.jpg",
    prompt:
      "Elegant North African woman with long thick shiny hair, washing her hair in a luxurious modern bathroom, water droplets, golden warm lighting, luxury hair care brand lifestyle photography, clean white background, professional editorial, high-end cosmetics, no text",
  },
  {
    file: "lifestyle-mask.jpg",
    prompt:
      "Beautiful woman with healthy long hair applying a rich hair mask treatment, spa and wellness setting, soft warm rose and cream tones, eyes closed in relaxation, luxury cosmetics lifestyle photography, professional editorial photo, no text",
  },
  {
    file: "lifestyle-spray.jpg",
    prompt:
      "Confident stylish woman with glossy flowing hair using a hair spray bottle, hair fanning out gracefully, dramatic studio lighting with dark background and golden highlights, luxury beauty editorial photography, high fashion, no text",
  },
]

async function generateImage({ file, prompt }) {
  console.log(`⏳  Generating ${file}…`)
  try {
    // Try Imagen 4 first (highest quality, uses predict/generateImages)
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "3:4",
      },
    })

    const image = response.generatedImages?.[0]
    if (!image?.image?.imageBytes) throw new Error("No image bytes in response")

    const buffer = Buffer.from(image.image.imageBytes, "base64")
    writeFileSync(join(OUTPUT_DIR, file), buffer)
    console.log(`✅  Saved → public/generated/${file}`)
  } catch (err) {
    console.log(`   ↳ Imagen failed (${err.message?.slice(0, 60)}), trying Gemini…`)
    // Fallback: Gemini image model via generateContent
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: { responseModalities: ["IMAGE", "TEXT"] },
      })
      const parts = response.candidates?.[0]?.content?.parts ?? []
      const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"))
      if (!imagePart?.inlineData?.data) throw new Error("No image data in response")

      const buffer = Buffer.from(imagePart.inlineData.data, "base64")
      writeFileSync(join(OUTPUT_DIR, file), buffer)
      console.log(`✅  Saved → public/generated/${file}`)
    } catch (err2) {
      console.error(`❌  Failed to generate ${file}:`, err2.message)
    }
  }
}

console.log("🎨  Generating lifestyle images via Google Imagen 3…\n")
for (const img of IMAGES) {
  await generateImage(img)
}
console.log("\n✨  Done. Images saved to /public/generated/")
