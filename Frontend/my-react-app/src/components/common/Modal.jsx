import { useEffect } from 'react';

/**
 * Simple modal dialog.
 *
 *   <Modal open={open} onClose={close} title="Create project">
 *     ...form...
 *   </Modal>
 *
 * Renders nothing when closed. Pressing Escape or clicking the overlay
 * closes it.
 */
export default function Modal({ open, onClose, title, children, footer }) {
  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}