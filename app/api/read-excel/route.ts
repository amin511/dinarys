import { execSync } from 'child_process'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const cwd = process.cwd()
    if (!fs.existsSync(path.join(cwd, 'node_modules', 'xlsx'))) {
      execSync('npm install xlsx', { cwd })
    }
    
    const xlsx = require('xlsx')
    const workbook = xlsx.readFile('c:\\Users\\dell\\Desktop\\nour-confection\\DINARYS_tarif-stk-conf_2026-05-15.xlsx')
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const json = xlsx.utils.sheet_to_json(sheet)
    
    return NextResponse.json({ success: true, data: json })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message })
  }
}
