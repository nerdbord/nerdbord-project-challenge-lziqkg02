import { useEffect } from "react";

export function useUnsavedChangesWarning(
  shouldWarn: boolean,
  message: string = "You have unsaved changes, are you sure you want to leave?",
  onExit?: () => void, // Optional event handler that will be called when the user attempts to leave
) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = message;

        if (onExit) {
          onExit(); // Call the event handler when the user attempts to leave
        }

        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn, message, onExit]);
}
