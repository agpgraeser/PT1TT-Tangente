function fmt(v, decimals = 4) {
  return v !== null && isFinite(v) ? Number(v).toFixed(decimals) : ''
}

export default function KennwerteSection({ kS, TT, TG, kS1, TT1, TG1 }) {
  return (
    <div className="section">
      <div className="panel-title">
        Kennwerte, Küpfmüller (TT, TG) &amp; Küpfmüller korr. (TT1, TG1)
      </div>

      <div className="field-row-compact">
        <label htmlFor="kS">kS</label>
        <input type="number" id="kS"   className="output" value={fmt(kS)}      readOnly />

        <label htmlFor="TT">TT</label>
        <input type="number" id="TT"   className="output" value={fmt(TT, 2)}   readOnly />

        <label htmlFor="TG">TG</label>
        <input type="number" id="TG"   className="output" value={fmt(TG, 2)}   readOnly />

        <label htmlFor="kS1">kS1</label>
        <input type="number" id="kS1"  className="output" value={fmt(kS1)}     readOnly />

        <label htmlFor="TT1">TT1</label>
        <input type="number" id="TT1"  className="output" value={fmt(TT1, 2)}  readOnly />

        <label htmlFor="TG1">TG1</label>
        <input type="number" id="TG1"  className="output" value={fmt(TG1, 2)}  readOnly />
      </div>
    </div>
  )
}
