export function newInstanceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `inst_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}
