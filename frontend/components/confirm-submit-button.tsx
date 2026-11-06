"use client";

import { useFormStatus } from "react-dom";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
};

export function ConfirmSubmitButton({
  children,
  pendingText = "Processando...",
  className,
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? pendingText : children}
    </button>
  );
}