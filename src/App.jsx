import { useState, useMemo } from 'react'
import LeftPanel from './components/LeftPanel'
import PlotPanel from './components/PlotPanel'
import { computeTangentFromWP } from './utils/calculations'
import { parseExcelFile } from './utils/excelParser'

export default function App() {
  // ── User inputs ──────────────────────────────────────────────
  const [xa, setXa] = useState(0)
  const [xe, setXe] = useState(1)
  const [ya, setYa] = useState(0)
  const [ye, setYe] = useState(1)
  const [t0, setT0] = useState(-100)

  // WP inputs stored as strings so the field can be empty before user types
  const [xWP, setXWP] = useState('')
  const [tWP, setTWP] = useState('')

  // ── Excel data ───────────────────────────────────────────────
  const [timeData, setTimeData]         = useState([])
  const [xData,    setXData]            = useState([])
  const [yData,    setYData]            = useState([])
  const [loadedFilename, setLoadedFilename] = useState('')
  const [previewRows,    setPreviewRows]    = useState([])

  // ── UI ───────────────────────────────────────────────────────
  const [showDiff, setShowDiff] = useState(true)

  // ── Derived values ───────────────────────────────────────────
  const dx = xe - xa
  const dy = ye - ya
  const kS = dy !== 0 ? dx / dy : null

  const xWPNum = parseFloat(xWP)
  const tWPNum = parseFloat(tWP)

  const tangent = useMemo(
    () => computeTangentFromWP(xWPNum, tWPNum, xa, xe, xData, timeData),
    [xWPNum, tWPNum, xa, xe, xData, timeData]
  )

  const t1 = tangent?.t1 ?? null
  const t2 = tangent?.t2 ?? null

  // Küpfmüller
  const TT = isFinite(t1) && isFinite(t0) ? t1 - t0 : null
  const TG = isFinite(t1) && isFinite(t2) ? t2 - t1 : null

  // Modified Küpfmüller (uses tWP instead of t1 for TG)
  const TT1 = TT
  const TG1 = isFinite(tWPNum) && isFinite(t2) ? t2 - tWPNum : null

  // kS1 = kS (same formula, placeholder for future improvement)
  const kS1 = kS

  // ── File handler ─────────────────────────────────────────────
  async function handleFile(file) {
    try {
      const result = await parseExcelFile(file)
      setTimeData(result.timeData)
      setXData(result.xData)
      setYData(result.yData)
      setLoadedFilename(file.name)
      setPreviewRows((result.rows || []).slice(0, 3))
      // Reset WP inputs when a new file is loaded
      setXWP('')
      setTWP('')
    } catch (err) {
      console.error('Fehler beim Laden der Datei:', err)
    }
  }

  return (
    <div className="app-container">
      <LeftPanel
        xa={xa} setXa={setXa}
        xe={xe} setXe={setXe}
        ya={ya} setYa={setYa}
        ye={ye} setYe={setYe}
        t0={t0} setT0={setT0}
        dx={dx} dy={dy}
        xWP={xWP} setXWP={setXWP}
        tWP={tWP} setTWP={setTWP}
        t1={t1} t2={t2}
        kS={kS}   TT={TT}  TG={TG}
        kS1={kS1} TT1={TT1} TG1={TG1}
        loadedFilename={loadedFilename}
        previewRows={previewRows}
        showDiff={showDiff} setShowDiff={setShowDiff}
        onFileLoaded={handleFile}
      />
      <PlotPanel
        timeData={timeData}
        xData={xData}
        yData={yData}
        xa={xa} xe={xe}
        t0={t0}
        t1={t1} t2={t2}
        xWP={xWPNum} tWP={tWPNum}
        tangent={tangent}
        kS={kS}   TT={TT}  TG={TG}
        kS1={kS1} TT1={TT1} TG1={TG1}
        dy={dy}
        showDiff={showDiff}
        loadedFilename={loadedFilename}
      />
    </div>
  )
}
