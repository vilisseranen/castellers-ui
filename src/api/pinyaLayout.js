// Layout of the pinya, drawn as a plan seen from above.
// The baix is at the origin and faces the bottom of the plan.
//
// A pinya position is described by (name, column, cordon), see sql/0.25.0.sql in the API:
//   agulla, contrafort: nucli, in front of and behind the baix
//   crossa:             nucli, column 1 = left, 2 = right
//   mans:               column 1 = front (behind the agulla), 2 = back (behind the contrafort)
//   vent:               column 1 = left, 2 = right
//   lateral:            column 1 = front left, 2 = front right, 3 = back right, 4 = back left
// cordon is 0 for the nucli, then 1, 2... from the baix outwards.

// Size of a cell, before scaling: long side, short side and gap between cells
const LONG = 90;
const SHORT = 30;
const GAP = 4;

// Center (cx, cy) and size (w, h) of the cell of a position, relative to the baix.
// Returns null if the position is not a known pinya position.
export function pinyaCell(position, scale = 1) {
  const L = LONG * scale;
  const S = SHORT * scale;
  const G = GAP * scale;
  const step = S + G; // distance between two people in a rengla
  const side = position.column === 1 ? -1 : 1; // left or right
  const horizontal = { w: L, h: S };
  const vertical = { w: S, h: L };
  const cordon = position.cordon;

  switch (position.name) {
    case "agulla":
      return { cx: 0, cy: step, ...horizontal };
    case "contrafort":
      return { cx: 0, cy: -step, ...horizontal };
    case "mans":
      // column 1 is behind the agulla, column 2 behind the contrafort
      return {
        cx: 0,
        cy: (position.column === 1 ? 1 : -1) * (cordon + 1) * step,
        ...horizontal,
      };
    case "crossa":
      return { cx: side * (L / 2 + G + S / 2), cy: 0, ...vertical };
    case "vent":
      // behind the crossa
      return {
        cx: side * (L / 2 + G + S / 2 + cordon * step),
        cy: 0,
        ...vertical,
      };
    case "lateral": {
      // in the corner between the mans and the vents, going outwards in diagonal
      const x = position.column === 1 || position.column === 4 ? -1 : 1;
      const y = position.column === 1 || position.column === 2 ? 1 : -1;
      return {
        cx: x * (L + G + (cordon - 1) * step * 0.6),
        cy: y * (L / 2 + G + S / 2 + (cordon - 1) * step),
        ...horizontal,
      };
    }
    default:
      return null;
  }
}

// Cell where the baix is shown, as a landmark in the middle of the plan
export function pinyaBaixCell(scale = 1) {
  return { cx: 0, cy: 0, w: LONG * scale, h: SHORT * scale };
}

// Width and height of the plan for these positions. The baix is in the middle.
export function pinyaSize(positions, scale = 1) {
  let halfWidth = 0;
  let halfHeight = 0;
  for (const position of positions) {
    const cell = pinyaCell(position, scale);
    if (cell) {
      halfWidth = Math.max(halfWidth, Math.abs(cell.cx) + cell.w / 2);
      halfHeight = Math.max(halfHeight, Math.abs(cell.cy) + cell.h / 2);
    }
  }
  return { width: 2 * halfWidth, height: 2 * halfHeight };
}

// Scale to apply so that the plan fits in maxWidth. Never more than 1.
export function pinyaScale(positions, maxWidth) {
  const width = pinyaSize(positions).width;
  if (!width || !maxWidth) {
    return 1;
  }
  return Math.min(1, maxWidth / width);
}

// Text shown in a cell where nobody is assigned yet
export function pinyaLabel(position) {
  if (position.cordon > 0) {
    return position.name + " " + position.cordon;
  }
  return position.name;
}
