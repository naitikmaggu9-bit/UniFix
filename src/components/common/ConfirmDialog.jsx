import React from "react";
import Modal from "./Modal";

/**
 * ConfirmDialog Component
 * Specialized confirmation dialog for destructive actions (delete, reset)
 * Demonstrates: Component composition, props, conditional button styling
 * (Syllabus: Lectures 25-30, Lectures 61-66)
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;
