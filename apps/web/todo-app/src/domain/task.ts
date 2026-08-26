export function sanitizeTaskTitle(title: string): string {
  return title.trim();
}

export function isValidTaskTitle(title: string): boolean {
  return sanitizeTaskTitle(title).length > 0;
}
