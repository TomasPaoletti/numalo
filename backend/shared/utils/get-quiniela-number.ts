const QUINIELA_URL = process.env.QUINIELA_URL ?? "";

export async function getQuinielaNumber(): Promise<number | null> {
  try {
    const response = await fetch(QUINIELA_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-AR,es;q=0.9",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[Quiniela] HTTP error:", response.status);
      return null;
    }

    const html = await response.text();

    const match = html.match(/Nocturna<\/a><br><a[^>]+>(\d{4})/);

    if (!match) {
      return null;
    }

    const number = parseInt(match[1], 10);
    return number;
  } catch (error) {
    console.error("[Quiniela] Error al obtener número:", error);
    return null;
  }
}
