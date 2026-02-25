"use client";

/**
 * Thin shim over Sonner so existing call sites that use
 *   const { toast } = useToast()
 *   toast({ title, description, variant })
 * keep working without any changes.
 */
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

function toast({
  title,
  description,
  variant = "default",
  duration,
}: ToastOptions) {
  const message = title ?? "";
  const opts = { description, duration };

  switch (variant) {
    case "destructive":
      return sonnerToast.error(message, opts);
    case "success":
      return sonnerToast.success(message, opts);
    case "warning":
      return sonnerToast.warning(message, opts);
    case "info":
      return sonnerToast.info(message, opts);
    default:
      return sonnerToast(message, opts);
  }
}

/** Drop-in replacement for the old useToast hook. */
function useToast() {
  return { toast };
}

export { useToast, toast };
