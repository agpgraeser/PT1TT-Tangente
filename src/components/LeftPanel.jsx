import ParameterSection  from './sections/ParameterSection'
import TangentSection    from './sections/TangentSection'
import KennwerteSection  from './sections/KennwerteSection'
import FileUploadSection from './sections/FileUploadSection'

export default function LeftPanel({
  xa, setXa, xe, setXe,
  ya, setYa, ye, setYe,
  t0, setT0,
  dx, dy,
  xWP, setXWP, tWP, setTWP,
  t1, t2,
  kS, TT, TG,
  kS1, TT1, TG1,
  loadedFilename, previewRows,
  showDiff, setShowDiff,
  onFileLoaded,
}) {
  return (
    <div className="left-panel">

      <ParameterSection
        xa={xa} setXa={setXa}
        xe={xe} setXe={setXe}
        ya={ya} setYa={setYa}
        ye={ye} setYe={setYe}
        t0={t0} setT0={setT0}
        dx={dx} dy={dy}
      />

      <TangentSection
        xa={xa} xe={xe} t0={t0}
        xWP={xWP} setXWP={setXWP}
        tWP={tWP} setTWP={setTWP}
        t1={t1} t2={t2}
      />

      <KennwerteSection
        kS={kS}   TT={TT}  TG={TG}
        kS1={kS1} TT1={TT1} TG1={TG1}
      />

      <FileUploadSection
        loadedFilename={loadedFilename}
        previewRows={previewRows}
        onFileLoaded={onFileLoaded}
      />

      <div className="section">
        <div className="field-row-single">
          <label htmlFor="showDiff">Abweichungen anzeigen</label>
          <input
            type="checkbox"
            id="showDiff"
            checked={showDiff}
            onChange={e => setShowDiff(e.target.checked)}
          />
        </div>
      </div>

    </div>
  )
}
