import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = "xl",
}) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-dialog modal-${size} modal-dialog-centered modal-dialog-scrollable`}
        role="document"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        <div className="modal-content" style={{ maxHeight: "calc(100vh - 2rem)" }}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id={titleId}>
              {title}
            </h5>

            <button
              type="button"
              className="btn border-0 bg-transparent p-0 ms-auto"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <i className="material-icons text-danger fs-4">close</i>
            </button>

          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
