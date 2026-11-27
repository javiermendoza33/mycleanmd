// Tell IndexNow search engines (Bing and the engines that share its index) which Method pages are new or changed.
// Usage:  node scripts/indexnow-method.mjs            → every URL in the live sitemap
//         node scripts/indexnow-method.mjs <url> …    → just those
// Run it after a deploy that adds or edits Journal articles. Google does not take IndexNow: use Search Console there.
import { readFileSync } from "node:fs";
const HOST = "thelabomethod.com";
const key = readFileSync(new URL("../src/labo/content.ts", import.meta.url), "utf8").match(/INDEXNOW_KEY = "([0-9a-f]+)"/)?.[1];
if (!key) throw new Error("INDEXNOW_KEY not found in src/labo/content.ts");
let urlList = process.argv.slice(2);
if (!urlList.length) urlList = [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const live = (await (await fetch(`https://${HOST}/${key}.txt`)).text()).trim();
if (live !== key) throw new Error(`The key file is not live yet at https://${HOST}/${key}.txt (got ${JSON.stringify(live.slice(0, 40))}). Deploy first.`);
const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }) });
console.log(`IndexNow: ${r.status} ${r.statusText} for ${urlList.length} URLs`);   // 200 or 202 = accepted
for (const u of urlList) console.log("  " + u);
