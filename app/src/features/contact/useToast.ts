import { useEffect, useMemo, useRef, useState } from "react";

export interface ToastState {
  type: "success" | "error";
  message: string;
}

export function useToast(autoDismissMs = 4000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, autoDismissMs);
  }, [autoDismissMs, toast]);

  return useMemo(
    () => ({
      toast,
      showToast: (nextToast: ToastState) => setToast(nextToast),
      clearToast: () => setToast(null)
    }),
    [toast]
  );
}

