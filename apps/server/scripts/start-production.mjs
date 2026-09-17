#!/usr/bin/env node
import { spawn } from 'node:child_process';

const port = process.env.PORT || '3000';
const healthUrl = process.env.SERVER_HEALTH_URL || `http://127.0.0.1:${port}/health`;
const timeoutMs = Number(process.env.SERVER_HEALTH_TIMEOUT_MS || 120_000);
const intervalMs = Number(process.env.SERVER_HEALTH_INTERVAL_MS || 500);

const children = new Set();
let shuttingDown = false;

function run(name, command, args) {
  const childEnv = {
    ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production',
      APP_ENV: process.env.APP_ENV || 'production',
      VENDURE_DISABLE_TELEMETRY: process.env.VENDURE_DISABLE_TELEMETRY || 'true',
  };
  delete childEnv.DEBUG;
  delete childEnv.NEXT_TEST_MODE;
  delete childEnv.__NEXT_TEST_MODE;

  const child = spawn(command, args, {
    stdio: 'inherit',
    env: childEnv,
  });
  children.add(child);
  child.on('exit', (code, signal) => {
    children.delete(child);
    if (!shuttingDown) {
      console.error(`[${name}] exited with code ${code ?? signal}`);
      shutdown(code || 1);
    }
  });
  return child;
}

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) child.kill('SIGTERM');
  setTimeout(() => process.exit(code), 250).unref();
}

async function waitForHealth() {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) return;
    } catch {
      // Server is still booting.
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Vendure server did not become healthy within ${timeoutMs}ms (${healthUrl})`);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('Starting Vendure server...');
run('server', 'npm', ['run', 'start:server']);

try {
  await waitForHealth();
  console.log('Vendure server is healthy. Starting worker...');
  run('worker', 'npm', ['run', 'start:worker']);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  shutdown(1);
}
