export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback...', err);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', 'readonly');
    document.body.appendChild(textArea);

    // Select the text
    textArea.select();
    // textArea.setSelectionRange(0, text.length);

    // Execute the copy command
    const successful = document.execCommand('copy');

    // Cleanup
    document.body.removeChild(textArea);

    return successful;
  } catch (err) {
    console.error('Fallback copy failed.', err);
    return false;
  }
}
