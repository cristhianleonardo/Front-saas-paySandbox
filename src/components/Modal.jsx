export default function Modal({ title, children, onCancel, onConfirm, confirmLabel = 'Confirmar', danger = false }) {
  return <div className="modal-backdrop" role="presentation">
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      {children}
      <div className="modal-actions"><button className="button secondary" onClick={onCancel}>Cancelar</button><button className={`button ${danger ? 'danger' : ''}`} onClick={onConfirm}>{confirmLabel}</button></div>
    </div>
  </div>
}
