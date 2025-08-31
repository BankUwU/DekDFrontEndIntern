import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);

  // Only render portal on client
  useEffect(() => setMounted(true), []);

  // ESC to close + lock body scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  // click overlay to close (but not when clicking inside the panel)
  const onOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={onOverlayMouseDown}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl outline-none
                   data-[enter]:animate-[fadeIn_150ms_ease-out] data-[enter]:opacity-100"
      >
        <div className="border-b px-4 py-3">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
        </div>
        <div className="p-4">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full
                     bg-gray-100 text-gray-600 hover:bg-gray-200"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
