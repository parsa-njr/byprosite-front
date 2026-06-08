import { useEffect } from "react";
import {
  UNSAFE_NavigationContext as NavigationContext,
} from "react-router-dom";
import { useContext } from "react";

export function usePageLeaveConfirm(when = true, message?: string) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      const confirmLeave = window.confirm(
        message || "Are you sure you want to leave this page? Unsaved changes may be lost."
      );
      if (confirmLeave) {
        navigator.push = push; // restore original behavior
        push(...args);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (when) {
        event.preventDefault();
        event.returnValue = ""; // needed to trigger browser alert
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      navigator.push = push;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, message, navigator]);
}
