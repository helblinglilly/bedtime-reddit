import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, rm, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const databaseId = '11111111-1111-4111-8111-111111111111';

test('CI config validates the database ID and changes only the D1 binding', async () => {
	const directory = await mkdtemp(new URL('.configure-ci-test-', import.meta.url));
	try {
		await mkdir(`${directory}/scripts`);
		await copyFile(new URL('configure-ci.mjs', import.meta.url), `${directory}/scripts/configure-ci.mjs`);
		await copyFile(new URL('../wrangler.jsonc', import.meta.url), `${directory}/wrangler.jsonc`);
		const run = (id, name = '') => spawnSync(process.execPath, [`${directory}/scripts/configure-ci.mjs`], {
			env: { ...process.env, D1_DATABASE_ID: id, D1_DATABASE_NAME: name },
			encoding: 'utf8',
		});
		for (const id of ['', 'invalid', '00000000-0000-0000-0000-000000000000']) {
			const result = run(id);
			assert.notEqual(result.status, 0);
			assert.match(result.stderr, /D1_DATABASE_ID/);
			await assert.rejects(access(`${directory}/wrangler.ci.json`));
		}
		for (const name of ['', 'test-database']) {
			const result = run(databaseId, name);
			assert.equal(result.status, 0, result.stderr);
			const generated = JSON.parse(await readFile(`${directory}/wrangler.ci.json`, 'utf8'));
			const { config } = ts.parseConfigFileTextToJson('wrangler.jsonc', await readFile(`${directory}/wrangler.jsonc`, 'utf8'));
			config.d1_databases[0].database_id = databaseId;
			config.d1_databases[0].database_name = name || config.d1_databases[0].database_name;
			assert.deepEqual(generated, config);
			assert.equal(generated.secrets_store_secrets, undefined);
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
