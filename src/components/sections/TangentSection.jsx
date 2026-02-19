function fmt(v, decimals = 4) {
  return v !== null && isFinite(v) ? Number(v).toFixed(decimals) : ''
}

export default function TangentSection({
  xa, xe, t0,
  xWP, setXWP,
  tWP, setTWP,
  t1, t2,
}) {
  const xWPNum = parseFloat(xWP)
  const tWPNum = parseFloat(tWP)

  const xWPInvalid = xWP !== '' && (!isFinite(xWPNum) || xWPNum < xa || xWPNum > xe)
  const tWPInvalid = tWP !== '' && (!isFinite(tWPNum) || tWPNum <= t0)
  const t1Invalid  = t1 !== null && t1 <= t0
  const t2Invalid  = t2 !== null && t2 <= t0

  return (
    <div className="section">
      <div className="panel-title">Wendetangenten Methode für Mehrspeichersysteme</div>

      {/* Row 1: X1 (= xa) and t1 (computed) */}
      <div className="field-row-double">
        <label htmlFor="X1">X1</label>
        <input type="number" id="X1" className="output" value={fmt(xa, 2)} readOnly />

        <label htmlFor="t1">t1</label>
        <input type="number" id="t1"
          className={`output${t1Invalid ? ' invalid' : ''}`}
          value={fmt(t1)} readOnly />
      </div>

      {/* Row 2: XWP and tWP (user inputs) */}
      <div className="field-row-double">
        <label htmlFor="XWP">XWP</label>
        <input type="number" id="XWP" value={xWP} step="0.01"
          className={xWPInvalid ? 'invalid' : ''}
          onChange={e => setXWP(e.target.value)} />

        <label htmlFor="tWP">tWP</label>
        <input type="number" id="tWP" value={tWP} step="0.01"
          className={tWPInvalid ? 'invalid' : ''}
          onChange={e => setTWP(e.target.value)} />
      </div>

      {/* Row 3: X2 (= xe) and t2 (computed) */}
      <div className="field-row-double">
        <label htmlFor="X2">X2</label>
        <input type="number" id="X2" className="output" value={fmt(xe, 2)} readOnly />

        <label htmlFor="t2">t2</label>
        <input type="number" id="t2"
          className={`output${t2Invalid ? ' invalid' : ''}`}
          value={fmt(t2)} readOnly />
      </div>
    </div>
  )
}
