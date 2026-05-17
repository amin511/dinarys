import { execSync } from 'child_process'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { script } = await req.json()
    const scriptPath = path.join(process.cwd(), 'temp-script.js')
    fs.writeFileSync(scriptPath, script)
    
    // Check if we need to install xlsx
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules', 'xlsx'))) {
      execSync('npm install xlsx', { cwd: process.cwd() })
    }
    
    const output = execSync(`node temp-script.js`, { cwd: process.cwd(), encoding: 'utf8' })
    return NextResponse.json({ success: true, output })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stderr: e.stderr ? e.stderr.toString() : '' })
  }
}
