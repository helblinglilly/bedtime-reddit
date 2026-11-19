import { readFile, writeFile } from "node:fs/promises";
import app from "../src/index";

async function main() {
  const response = await app.request("http://localhost/openapi.json");
  if (!response.ok) {
    throw new Error(`OpenAPI export failed: HTTP ${response.status}`);
  }
  const document = await response.json();
  const contents = `${JSON.stringify(document, null, 2)}\n`;
  const output = new URL("../openapi.json", import.meta.url);

  if (process.argv.includes("--check")) {
    const existing = await readFile(output, "utf8").catch(() => "");
    if (existing !== contents) {
      throw new Error("OpenAPI schema is stale. Run npm run api:types in reddit-frontend and commit the generated files.");
    }
  } else {
    await writeFile(output, contents);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
