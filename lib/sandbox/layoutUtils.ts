import type { LayoutItem } from "react-grid-layout";

/** Keep every tile inside [0, cols) so the grid never grows wider than the canvas. */
export function clampLayoutToCols(layout: readonly LayoutItem[], cols: number): LayoutItem[] {
  return layout.map((item) => {
    const minW = item.minW ?? 1;
    const maxW = item.maxW ?? cols;
    const w = Math.min(maxW, Math.max(minW, Math.min(item.w, cols)));
    const maxX = Math.max(0, cols - w);
    const x = Math.min(Math.max(0, item.x), maxX);
    if (x === item.x && w === item.w) return item;
    return { ...item, x, w };
  });
}

function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

/**
 * Finds top-left (x, y) for a w×h box that does not overlap existing layout items.
 */
export function findFirstFreeSlot(
  layout: readonly LayoutItem[],
  cols: number,
  w: number,
  h: number,
): { x: number; y: number } {
  const occupied = layout.map((l) => ({
    x: l.x,
    y: l.y,
    w: l.w,
    h: l.h,
  }));
  const maxY = occupied.reduce((m, l) => Math.max(m, l.y + l.h), 0);
  const scanRows = Math.max(maxY + h + 4, 24);

  for (let y = 0; y < scanRows; y++) {
    for (let x = 0; x <= cols - w; x++) {
      const candidate = { x, y, w, h };
      const hit = occupied.some((o) => overlaps(candidate, o));
      if (!hit) return { x, y };
    }
  }
  return { x: 0, y: maxY };
}
