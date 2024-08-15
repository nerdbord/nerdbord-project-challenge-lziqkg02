export function useCopyToClipboard() {
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard");
    }
  };
  return { copyText };
}
