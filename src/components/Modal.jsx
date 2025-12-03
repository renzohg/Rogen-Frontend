import './Modal.css';

function Modal({ isOpen, onClose, title, message, type = 'info', onConfirm }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {type === 'confirm' ? (
            <>
              <button className="btn-modal btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn-modal btn-confirm" onClick={handleConfirm}>
                Confirmar
              </button>
            </>
          ) : (
            <button className="btn-modal btn-ok" onClick={onClose}>
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;

