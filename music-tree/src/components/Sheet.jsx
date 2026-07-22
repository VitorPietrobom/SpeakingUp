// Bottom sheet with scrim (dark star sheet, instrument switcher, add-a-song).
export default function Sheet({ onClose, children }) {
  return (
    <>
      <button className="sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="sheet" role="dialog">
        <div className="sheet-handle" />
        {children}
      </div>
    </>
  )
}
