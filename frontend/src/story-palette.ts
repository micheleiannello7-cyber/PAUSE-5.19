// PAUSE — palette monocromatica della lettura: ogni storia usa UNA sola
// famiglia cromatica derivata dal suo tema (categoria); i capitoli scorrono
// dentro quella famiglia con variazioni di tonalità molto lievi
// (es. Spazio: cyan → blu → blu/viola). Nessun colore casuale per capitolo.
const FAMILIES: Record<string, string[]> = {
  spazio: ["#3FE0FF", "#48B8FF", "#5E8CFF", "#7C7BFF", "#8F6CF7"],
  scienza: ["#3FE0FF", "#3CCCFF", "#3AB4FF", "#3E9CFF"],
  tecnologia: ["#2FE6FF", "#2FC9FF", "#31A9FF", "#3A8CFF"],
  natura: ["#2FE0B0", "#26CFA8", "#1FB9A4", "#1FA3A0"],
  geografia: ["#00DAB4", "#0FC9B8", "#1DB5BE", "#25A2C0"],
  animali: ["#FFB65A", "#F7A552", "#EC934C", "#E08548"],
  storia: ["#FFD98A", "#F5C46E", "#E8AE58", "#D99A4B"],
  cultura: ["#FFC86E", "#F5B65F", "#E9A354", "#DC924C"],
  economia: ["#FFD86B", "#F2C65C", "#E4B350", "#D5A048"],
  psicologia: ["#B892FF", "#A981FF", "#9B72F5", "#8E66EA"],
  arte: ["#EA7CF0", "#D96FEA", "#C464E4", "#AE5ADE"],
  "corpo-umano": ["#FF76B8", "#F868AC", "#EC5CA1", "#DD5297"],
};
const DEFAULT_FAMILY = ["#3FE0FF", "#3CC6FF", "#41A8FF", "#5490FF"];

export function storyFamily(categoryId: string | undefined): string[] {
  return FAMILIES[(categoryId ?? "").split(/[·\s]/)[0]] ?? DEFAULT_FAMILY;
}

/** Tinta del capitolo `index` (0-based) su `count`: scorre lungo la famiglia della storia. */
export function chapterTint(categoryId: string | undefined, index: number, count: number): string {
  const family = storyFamily(categoryId);
  if (count <= 1) return family[0];
  const pos = Math.max(0, Math.min(1, index / (count - 1)));
  return family[Math.round(pos * (family.length - 1))];
}
