"use client";
import { useEffect, useId, useRef } from "react";
import { X, Flower2, Leaf, MoveUpRight } from "lucide-react";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <Flower2 aria-hidden="true" strokeWidth={1.4} />
      {!compact && (
        <>
          avela<span className="brand-dot">.</span>
        </>
      )}
    </span>
  );
}
export function Modal({
  title,
  children,
  close,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    const d = ref.current;
    const previous = document.activeElement as HTMLElement;
    d?.showModal();
    return () => {
      d?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={headingId}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={close}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (
          e.target === e.currentTarget &&
          (e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom)
        )
          close();
      }}
    >
      <div className="modal-heading">
        <h2 id={headingId}>{title}</h2>
        <button
          className="icon-button"
          onClick={close}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Botanical({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={small ? "botanical small" : "botanical"}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M117 236c-12-63-4-127 36-202M122 181c-58-8-86-39-74-89 41 8 73 39 74 89ZM124 151c50-7 82-34 77-76-38-2-72 34-77 76ZM141 94c-29-29-29-58-6-83 27 19 31 47 6 83ZM115 215c-39 1-66-17-72-49 32-8 61 13 72 49ZM119 203c45 10 77-2 92-34-30-20-65-8-92 34Z" />
        <path d="M49 93l73 88M201 76l-77 75M135 12l6 82M44 166l71 49M210 169l-91 34" />
      </g>
    </svg>
  );
}
export function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <Leaf size={32} strokeWidth={1.3} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Arrow() {
  return <MoveUpRight size={17} aria-hidden="true" />;
}
