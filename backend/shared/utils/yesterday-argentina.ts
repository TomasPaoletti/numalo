const ARGENTINA_OFFSET_MS = 3 * 60 * 60 * 1000;

function getTodayArgentina(): { start: Date; end: Date } {
  const nowUtc = new Date();
  const nowArg = new Date(nowUtc.getTime() - ARGENTINA_OFFSET_MS);

  const y = nowArg.getUTCFullYear();
  const m = nowArg.getUTCMonth();
  const d = nowArg.getUTCDate();

  const start = new Date(Date.UTC(y, m, d, 3, 0, 0));

  const end = new Date(Date.UTC(y, m, d + 1, 2, 59, 59));

  return { start, end };
}

export { ARGENTINA_OFFSET_MS, getTodayArgentina };
