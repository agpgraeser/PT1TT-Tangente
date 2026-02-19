import * as XLSX from 'xlsx'

/**
 * Read an Excel file and return parsed time/X/Y data.
 * Supports three column structures (A/B/C) from the original app.
 *
 * @param {File} file
 * @returns {Promise<{ timeData, xData, yData, systemName, varNames, units, rows }>}
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        resolve({ ...parseRows(rows, baseName), rows })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function parseRows(rows, fileName) {
  const timeData = [], xData = [], yData = []
  let systemName = '', varNames = {}, units = {}

  const first  = rows[0]
  const second = rows[1]
  const third  = rows[2]

  // Struktur C: 3 header rows (Systemname, Variablen, Einheiten)
  const isStructC =
    first  && typeof first[0]  === 'string' &&
    second && typeof second[0] === 'string' &&
    third  != null

  if (isStructC) {
    systemName = first[0]
    varNames = {
      time: second[0] || 'Zeit',
      x:    second[1] || 'X',
      y:    second[2] || 'Y',
    }
    units = {
      time: third[0] || '',
      x:    third[1] || '',
      y:    third[2] || '',
    }
    for (let i = 3; i < rows.length; i++) {
      const r = rows[i]
      if (!r || r.length < 2) continue
      timeData.push(r[0])
      xData.push(r[1])
      if (r.length >= 3) yData.push(r[2])
    }
  } else {
    // Struktur A/B: no or 1 header row
    const hasY = rows[0]?.length >= 3
    systemName = fileName
    varNames = { time: 'Zeit', x: 'X', y: hasY ? 'Y' : null }
    units    = { time: '', x: '', y: '' }

    for (const r of rows) {
      if (!r || r.length < 2) continue
      timeData.push(r[0])
      xData.push(r[1])
      if (hasY) yData.push(r[2])
    }
  }

  return { timeData, xData, yData, systemName, varNames, units }
}
