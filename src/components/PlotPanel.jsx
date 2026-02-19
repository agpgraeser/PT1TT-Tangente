import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist-min'
import {
  computeMinMax,
  computeModelResponse,
  computeSquaredDifferences,
} from '../utils/calculations'

export default function PlotPanel({
  timeData, xData, yData,
  xa, xe, t0,
  t1, t2, xWP, tWP,
  tangent,
  kS, TT, TG,
  kS1, TT1, TG1,
  dy,
  showDiff,
  loadedFilename,
}) {
  const divRef = useRef(null)

  // Resize Plotly when the window size changes
  useEffect(() => {
    function onResize() {
      if (divRef.current) Plotly.Plots.resize(divRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Re-draw whenever any dependency changes
  useEffect(() => {
    if (!divRef.current) return

    // No data yet → clear plot and show placeholder
    if (timeData.length === 0) {
      Plotly.react(divRef.current, [], {
        title: { text: 'PT1TT – Zeitverläufe (keine Messdaten geladen)' },
        xaxis: { title: 'Zeit' },
        yaxis: { title: 'x(t)' },
        margin: { t: 60, r: 20, b: 40, l: 50 },
      })
      return
    }

    /* ── 1) Time range ──────────────────────────────────── */
    const { min: tMin, max: tMax } = computeMinMax(timeData)

    /* ── 2) Model responses ─────────────────────────────── */
    const XM  = computeModelResponse({ xa, dy, ks: kS,  tt: TT,  tg: TG,  t0 }, timeData)
    const XM2 = computeModelResponse({ xa, dy, ks: kS1, tt: TT1, tg: TG1, t0 }, timeData)

    /* ── 3) Traces ──────────────────────────────────────── */
    const traceX = {
      x: timeData, y: xData,
      mode: 'lines', name: 'Messwert X',
      line: { width: 2, color: 'blue' },
      xaxis: 'x1', yaxis: 'y1',
    }
    const traceY = {
      x: timeData, y: yData,
      mode: 'lines', name: 'Eingang Y',
      line: { width: 2, color: 'red' },
      xaxis: 'x2', yaxis: 'y2',
    }
    const traceModel = {
      x: timeData, y: XM,
      mode: 'lines', name: 'Modell Küpfmüller',
      line: { width: 4, color: 'red', dash: 'dot' },
      xaxis: 'x1', yaxis: 'y1',
    }
    const traceModel2 = {
      x: timeData, y: XM2,
      mode: 'lines', name: 'Modell mod.Küpfmüller',
      line: { width: 3, color: 'purple', dash: 'dashdot' },
      xaxis: 'x1', yaxis: 'y1',
    }

    /* ── 4) Shapes ──────────────────────────────────────── */
    const shapes = []

    // Vertical line at t0
    if (isFinite(t0)) {
      shapes.push({
        type: 'line', x0: t0, x1: t0, y0: xe, y1: xa,
        xref: 'x1', yref: 'y1',
        line: { color: 'orange', width: 2, dash: 'dot' },
      })
    }

    // Horizontal lines at XA and XE
    if (isFinite(xa) && isFinite(xe) && tMin !== null) {
      shapes.push(
        { type: 'line', x0: tMin, x1: tMax, y0: xa, y1: xa, xref: 'x1', yref: 'y1', line: { color: 'red', width: 2, dash: 'dash' } },
        { type: 'line', x0: tMin, x1: tMax, y0: xe, y1: xe, xref: 'x1', yref: 'y1', line: { color: 'red', width: 2, dash: 'dash' } },
      )
    }

    // Grid lines for t1 / XA
    if (isFinite(t1) && tMin !== null) {
      shapes.push(
        { type: 'line', x0: tMin, x1: t1,   y0: xa, y1: xa, xref: 'x1', yref: 'y1', line: { color: 'green', width: 1, dash: 'dash' } },
        { type: 'line', x0: t1,   x1: t1,   y0: xa, y1: xa, xref: 'x1', yref: 'y1', line: { color: 'green', width: 1, dash: 'dash' } },
      )
    }

    // Grid lines for tWP / XWP
    if (isFinite(tWP) && isFinite(xWP) && tMin !== null) {
      shapes.push(
        { type: 'line', x0: tMin, x1: tWP, y0: xWP, y1: xWP, xref: 'x1', yref: 'y1', line: { color: 'green', width: 1, dash: 'dash' } },
        { type: 'line', x0: tWP,  x1: tWP, y0: xa,  y1: xWP, xref: 'x1', yref: 'y1', line: { color: 'green', width: 1, dash: 'dash' } },
      )
    }

    // Grid lines for t2 / XE
    if (isFinite(t2) && tMin !== null) {
      shapes.push(
        { type: 'line', x0: tMin, x1: t2,  y0: xe, y1: xe, xref: 'x1', yref: 'y1', line: { color: 'green', width: 1, dash: 'dash' } },
        { type: 'line', x0: t2,   x1: t2,  y0: xa, y1: xe, xref: 'x1', yref: 'y1', line: { color: 'green', width: 1, dash: 'dash' } },
      )
    }

    // Tangent line
    if (tangent) {
      const { a, b } = tangent
      const t1tan = (xa - b) / a
      const t2tan = (xe - b) / a
      shapes.push({
        type: 'line', x0: t1tan, y0: xa, x1: t2tan, y1: xe,
        xref: 'x1', yref: 'y1',
        line: { color: 'black', width: 2 },
      })
    }

    /* ── 5) Annotations ─────────────────────────────────── */
    const annotations = []
    if (isFinite(t0))  annotations.push({ x: t0,  y: xa, xref: 'x1', yref: 'y1', text: 't0',  showarrow: false, yshift: -20, font: { size: 12, color: 'orange' } })
    if (isFinite(t1))  annotations.push({ x: t1,  y: xa, xref: 'x1', yref: 'y1', text: 't1',  showarrow: false, yshift: -20, font: { size: 12, color: 'green'  } })
    if (isFinite(tWP)) annotations.push({ x: tWP, y: xa, xref: 'x1', yref: 'y1', text: 'tWP', showarrow: false, yshift: -20, font: { size: 12, color: 'green'  } })
    if (isFinite(t2))  annotations.push({ x: t2,  y: xa, xref: 'x1', yref: 'y1', text: 't2',  showarrow: false, yshift: -20, font: { size: 12, color: 'green'  } })

    /* ── 6) Lower subplot: diff² or Y ───────────────────── */
    let traces, y2Title

    if (showDiff && XM.length > 0) {
      const diffSq  = computeSquaredDifferences(xData, XM)
      const diffSq2 = computeSquaredDifferences(xData, XM2)
      traces = [
        traceX, traceModel, traceModel2,
        { x: timeData, y: diffSq,  mode: 'lines', name: 'Abweichung² Modell 1', xaxis: 'x2', yaxis: 'y2', line: { color: 'red',    width: 2 } },
        { x: timeData, y: diffSq2, mode: 'lines', name: 'Abweichung² Modell 2', xaxis: 'x2', yaxis: 'y2', line: { color: 'purple', width: 2, dash: 'dot' } },
      ]
      y2Title = 'Δx²(t)'
    } else {
      traces  = [traceX, traceModel, traceModel2, traceY]
      y2Title = 'y(t)'
    }

    /* ── 7) Render ──────────────────────────────────────── */
    Plotly.react(divRef.current, traces, {
      title: {
        text: loadedFilename ? `Datei: ${loadedFilename}` : 'PT1TT – Zeitverläufe',
        y: 0.95,
        pad: { t: 10 },
      },
      grid: {
        rows: 2, columns: 1,
        roworder: 'top to bottom',
        heights: [0.67, 0.33],
        pattern: 'independent',
        ygap: 0.02,
      },
      xaxis:  { title: 'Zeit' },
      yaxis:  { title: 'x(t)' },
      xaxis2: { title: 'Zeit' },
      yaxis2: { title: y2Title },
      shapes,
      annotations,
      margin: { t: 60, r: 20, b: 40, l: 50 },
      autosize: true,
    })
  }, [
    timeData, xData, yData,
    xa, xe, t0, t1, t2, xWP, tWP,
    tangent, kS, TT, TG, kS1, TT1, TG1,
    dy, showDiff, loadedFilename,
  ])

  return (
    <div className="right-panel">
      <div ref={divRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
