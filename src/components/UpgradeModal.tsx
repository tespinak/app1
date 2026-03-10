interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

function UpgradeModal({ open, loading, onClose, onCheckout }: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>STOP Premium</h3>
        <p>Mejora tu plan por <strong>$4.990 CLP/mes</strong>.</p>
        <ul>
          <li>Free: seguimiento básico</li>
          <li>Premium: alertas avanzadas, analíticas y soporte prioritario</li>
        </ul>
        <button disabled={loading} onClick={onCheckout}>{loading ? 'Redirigiendo...' : 'Ir a Stripe Checkout'}</button>
        <button className="secondary" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default UpgradeModal;
