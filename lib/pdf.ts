import type { Browser } from "puppeteer-core";

// Sandbox flags required when running as root inside Docker
const DOCKER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];

async function getBrowser(): Promise<Browser> {
  const puppeteer = (await import("puppeteer-core")).default;

  // DigitalOcean / Docker: CHROMIUM_PATH points to the apt-installed binary
  if (process.env.CHROMIUM_PATH) {
    return puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      args: DOCKER_ARGS,
      headless: true,
    });
  }

  // Vercel fallback: download Chromium from CDN at runtime
  if (process.env.NODE_ENV === "production") {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"
      ),
      headless: true,
    });
  }

  // Local development — uses system Chrome
  const executablePath =
    process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome";

  return puppeteer.launch({ executablePath, headless: true, args: [] });
}

export async function htmlToPdf(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
