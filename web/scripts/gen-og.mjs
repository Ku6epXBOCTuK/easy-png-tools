// Генерирует static/og/default.png — дефолтная OG-карточка 1200×630.
// Запуск: pnpm --dir web gen:og. Карточка рисуется в браузере (текст, иконки),
// per-tool карточки — этим же harness позже (docs/plan-seo.md S1e).
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const W = 1200;
const H = 630;

const IMAGE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

function cardHtml() {
	return `<!doctype html><html><body style="margin:0">
	<div style="
		width:${W}px;height:${H}px;box-sizing:border-box;
		background:#0a120c;
		background-image:linear-gradient(#12281a 1px, transparent 1px),linear-gradient(90deg,#12281a 1px, transparent 1px);
		background-size:40px 40px;
		display:flex;align-items:center;justify-content:space-between;
		padding:80px;font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;
		border:3px solid #16a34a;
	">
		<div>
			<div style="
				width:72px;height:72px;background:#86efac;color:#052e16;
				display:flex;align-items:center;justify-content:center;
				font-size:34px;font-weight:700;margin-bottom:32px;
			">EP</div>
			<div style="color:#86efac;font-size:56px;font-weight:700;letter-spacing:-1px;">easy-png-tools</div>
			<div style="color:#a7c4b1;font-size:28px;margin-top:24px;">PNG utilities right in your browser</div>
			<div style="color:#4d7c5f;font-size:22px;margin-top:16px;">Convert · Crop · Resize — locally, no uploads</div>
		</div>
		<div style="
			color:#86efac;width:300px;height:300px;border:3px solid #16a34a;
			background:#0f1f14;display:flex;align-items:center;justify-content:center;
		"><div style="width:240px;height:240px;">${IMAGE_ICON}</div></div>
	</div>
</body></html>`;
}

mkdirSync(new URL("../static/og/", import.meta.url), { recursive: true });

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: W, height: H } });
	await page.setContent(cardHtml());
	await page.screenshot({
		path: new URL("../static/og/default.png", import.meta.url).pathname.replace(
			/^\/([A-Za-z]:)/,
			"$1",
		),
	});
	console.log(`og/default.png written (${W}x${H})`);
} finally {
	await browser.close();
}
