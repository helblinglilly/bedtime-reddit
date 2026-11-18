import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, rm, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const dummy = '00000000-0000-0000-0000-000000000000';
const databaseId = '11111111-1111-4111-8111-111111111111';

test('CI config validates store IDs and changes only production binding IDs', async () => {
	const directory = await mkdtemp(new URL('.configure-ci-test-', import.meta.url));
	try {
		await mkdir(`${directory}/scripts`);
		await copyFile(new URL('configure-ci.mjs', import.meta.url), `${directory}/scripts/configure-ci.mjs`);
		await copyFile(new URL('../wrangler.jsonc', import.meta.url), `${directory}/wrangler.jsonc`);
		const run = (storeId) =>
			spawnSync(process.execPath, [`${directory}/scripts/configure-ci.mjs`], {
				env: { ...process.env, D1_DATABASE_ID: databaseId, D1_DATABASE_NAME: 'test-database', YOUTUBE_SECRETS_STORE_ID: storeId },
				encoding: 'utf8',
			});
		for (const storeId of ['', 'invalid', dummy, '0'.repeat(32)]) {
			const result = run(storeId);
			assert.notEqual(result.status, 0);
			assert.match(result.stderr, /YOUTUBE_SECRETS_STORE_ID/);
			await assert.rejects(access(`${directory}/wrangler.ci.json`));
		}
		for (const storeId of ['1234567890abcdef1234567890abcdef', databaseId]) {
			assert.equal(run(storeId).status, 0);
			const generated = JSON.parse(await readFile(`${directory}/wrangler.ci.json`, 'utf8'));
			const { config } = ts.parseConfigFileTextToJson('wrangler.jsonc', await readFile(`${directory}/wrangler.jsonc`, 'utf8'));
			config.d1_databases.find(({ binding }) => binding === 'DB').database_id = databaseId;
			config.d1_databases.find(({ binding }) => binding === 'DB').database_name = 'test-database';
			config.secrets_store_secrets.find(({ binding }) => binding === 'YOUTUBE_API_KEY').store_id = storeId;
			assert.deepEqual(generated, config);
			assert.equal(generated.secrets_store_secrets[0].secret_name, 'BEDTIME_REDDIT_YOUTUBE_API_KEY');
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
