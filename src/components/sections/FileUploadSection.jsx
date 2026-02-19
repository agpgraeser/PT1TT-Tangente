export default function FileUploadSection({ loadedFilename, previewRows, onFileLoaded }) {
  function handleChange(e) {
    const file = e.target.files[0]
    if (file) onFileLoaded(file)
  }

  return (
    <div className="section">
      <div className="panel-title">Messdaten laden</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
        <input type="file" accept=".xlsx,.xls" onChange={handleChange} />
        <div style={{
          padding: '3px 8px',
          borderRadius: '4px',
          background: loadedFilename ? '#4CAF50' : '#eee',
          color: loadedFilename ? 'white' : '#333',
          fontSize: '0.8rem',
          fontWeight: loadedFilename ? 'bold' : 'normal',
        }}>
          {loadedFilename ? `Geladen: ${loadedFilename}` : 'Keine Datei'}
        </div>
      </div>

      {previewRows.length > 0 && (
        <div style={{ fontSize: '0.85rem', color: '#333', marginTop: '8px', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {previewRows.map((row, ri) => (
                <tr key={ri}>
                  {(row || []).map((cell, ci) => (
                    <td key={ci} style={{
                      border: '1px solid #e6e6e6',
                      padding: '6px',
                      fontSize: '0.85rem',
                    }}>
                      {cell !== undefined ? String(cell) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
