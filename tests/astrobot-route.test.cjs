const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest } = require('next/server');

// Use the project's compiler and Node test runner; no live credentials or provider calls.
const filename = path.resolve(__dirname, '../app/api/astrobot/route.ts');
const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: filename
});
const script = new vm.Script(outputText, { filename });

function route({ env = { GROQ_API_KEY: 'test-secret' }, fetch = async () => {
  throw new Error('Unexpected provider request');
} } = {}) {
  const exports = {};
  const logs = [];
  const context = vm.createContext({
    exports, require, process: { env }, fetch, AbortSignal, Error,
    console: { warn: (...args) => logs.push(args) }
  });
  script.runInContext(context);
  return { post: exports.POST, logs };
}

function request(message = 'What is a light-year?') {
  return new NextRequest('http://localhost/api/astrobot', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
}

for (const [configured, expected] of [
  ['gpt-oss-120b', 'openai/gpt-oss-120b'],
  [' gpt-oss-20b ', 'openai/gpt-oss-20b'],
  ['openai/gpt-oss-120b', 'openai/gpt-oss-120b'],
  ['llama-3.3-70b-versatile', 'llama-3.3-70b-versatile'],
  [' ', 'llama-3.3-70b-versatile']
]) {
  test(`configured model ${JSON.stringify(configured)} reaches Groq as ${expected}`, async () => {
    const { post } = route({
      env: { GROQ_API_KEY: ' test-secret ', GROQ_MODEL: configured },
      fetch: async (url, options) => {
        assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
        assert.equal(options.headers.Authorization, 'Bearer test-secret');
        assert.equal(JSON.parse(options.body).model, expected);
        assert.equal(options.cache, 'no-store');
        assert.ok(options.signal instanceof AbortSignal);
        return Response.json({ choices: [{ message: { content: '  A unit of distance.  ' } }] });
      }
    });
    const response = await post(request());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { answer: 'A unit of distance.' });
  });
}

test('empty or missing key fails before contacting Groq', async () => {
  for (const env of [{}, { GROQ_API_KEY: '  ' }]) {
    const { post } = route({ env });
    const response = await post(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'ASSISTANT_NOT_CONFIGURED');
  }
});

test('invalid JSON, empty input, and oversized messages never reach Groq', async () => {
  const { post } = route();
  const inputs = [request('   '), request('a'.repeat(1001)), new NextRequest('http://localhost/api/astrobot', { method: 'POST', body: '{invalid' })];
  for (const input of inputs) assert.equal((await post(input)).status, 400);
});

for (const [upstreamStatus, providerCode, localStatus, localCode] of [
  [404, 'model_not_found', 503, 'ASSISTANT_MODEL_ERROR'],
  [400, 'model_decommissioned', 503, 'ASSISTANT_MODEL_ERROR'],
  [401, 'invalid_api_key', 503, 'ASSISTANT_AUTH_ERROR'],
  [429, 'rate_limit_exceeded', 429, 'ASSISTANT_RATE_LIMITED'],
  [500, 'internal_error', 502, 'ASSISTANT_UPSTREAM_ERROR']
]) {
  test(`upstream ${upstreamStatus}/${providerCode} yields a useful, sanitized failure`, async () => {
    const { post, logs } = route({ fetch: async () => Response.json({ error: {
      code: providerCode, message: 'private provider diagnostic: test-secret'
    } }, { status: upstreamStatus }) });
    const response = await post(request());
    const body = await response.json();
    assert.equal(response.status, localStatus);
    assert.equal(body.code, localCode);
    assert.ok(!JSON.stringify({ body, logs }).includes('test-secret'));
    assert.ok(!JSON.stringify(logs).includes('private provider diagnostic'));
  });
}

test('non-JSON provider failures stay controlled', async () => {
  const { post } = route({ fetch: async () => new Response('<html>unavailable</html>', { status: 502 }) });
  assert.equal((await post(request())).status, 502);
});

test('timeouts return a retryable error without exposing exception details', async () => {
  const error = new Error('private connection data: test-secret');
  error.name = 'TimeoutError';
  const { post, logs } = route({ fetch: async () => { throw error; } });
  const response = await post(request());
  const body = await response.json();
  assert.equal(response.status, 504);
  assert.equal(body.code, 'ASSISTANT_TIMEOUT');
  assert.ok(!JSON.stringify({ body, logs }).includes('test-secret'));
});

test('a provider response without content is rejected', async () => {
  const { post } = route({ fetch: async () => Response.json({ choices: [{ message: { content: ' ' } }] }) });
  assert.equal((await post(request())).status, 502);
});
