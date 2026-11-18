import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

const databaseId = process.env.D1_DATABASE_ID;
if (
  !databaseId ||
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(databaseId) ||
  databaseId === "00000000-0000-0000-0000-000000000000"
) {
  throw new Error("D1_DATABASE_ID must contain the production database UUID.");
}

const source = new URL("../wrangler.jsonc", import.meta.url);
const { config, error } = ts.parseConfigFileTextToJson(
  source.pathname,
  await readFile(source, "utf8"),
);
if (error) throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
const binding = config.d1_databases.find(({ binding }) => binding === "DB");
binding.database_id = databaseId;
binding.database_name = process.env.D1_DATABASE_NAME || binding.database_name;

await writeFile(
  new URL("../wrangler.ci.json", import.meta.url),
  JSON.stringify(config, null, 2) + "\n",
);
