import { useEffect } from "react";

export function useUnsavedChangesWarning(
  shouldWarn: boolean,
  message: string = "You have unsaved changes, are you sure you want to leave?",
) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = message; // Some browsers may still display the default message, but this is the most cross-browser approach.
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn, message]);
}
