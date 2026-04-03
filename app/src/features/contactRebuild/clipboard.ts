export async function copyTextToClipboard(value: string) {
  const cleanValue = value.trim();

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(cleanValue);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = cleanValue;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

