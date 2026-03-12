/**
 * Simple markdown renderer: **bold** and *italic* support.
 * Returns HTML string for use with dangerouslySetInnerHTML.
 */
export function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
}
