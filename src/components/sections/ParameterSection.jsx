function fmt(v, decimals = 2) {
  return isFinite(v) ? Number(v).toFixed(decimals) : ''
}

export default function ParameterSection({
  xa, setXa, xe, setXe,
  ya, setYa, ye, setYe,
  t0, setT0,
  dx, dy,
}) {
  return (
    <div className="section">
      <div className="panel-title">PT1TT-Parameter mit Wendetangente ermitteln</div>

      <div className="field-row-compact">
        <label htmlFor="XA">XA</label>
        <input type="number" id="XA" value={xa} step="0.01"
          onChange={e => setXa(parseFloat(e.target.value) || 0)} />

        <label htmlFor="XE">XE</label>
        <input type="number" id="XE" value={xe} step="0.01"
          onChange={e => setXe(parseFloat(e.target.value) || 0)} />

        <label htmlFor="DX">DX</label>
        <input type="number" id="DX" className="output" value={fmt(dx)} readOnly />
      </div>

      <div className="field-row-compact">
        <label htmlFor="YA">YA</label>
        <input type="number" id="YA" value={ya} step="0.01"
          onChange={e => setYa(parseFloat(e.target.value) || 0)} />

        <label htmlFor="YE">YE</label>
        <input type="number" id="YE" value={ye} step="0.01"
          onChange={e => setYe(parseFloat(e.target.value) || 0)} />

        <label htmlFor="DY">DY</label>
        <input type="number" id="DY" className="output" value={fmt(dy)} readOnly />
      </div>

      <div className="field-row-single">
        <label htmlFor="t0">t₀</label>
        <input type="number" id="t0" value={t0} step="0.1"
          onChange={e => setT0(parseFloat(e.target.value))} />
      </div>
    </div>
  )
}
