#!/usr/bin/env node
import { spawn } from 'node:child_process';

const SERVER_HEALTH_URL = process.env.DEV_SERVER_HEALTH_URL || 'http://127.0.0.1:3000/health';
const HEALTH_TIMEOUT_MS = Number(process.env.DEV_SERVER_HEALTH_TIMEOUT_MS || 90_000);
const HEALTH_INTERVAL_MS = Number(process.env.DEV_SERVER_HEALTH_INTERVAL_MS || 500);

const children = new Set();
let shuttingDown = false;

function run(name, command, args) {
  const childEnv = {
    ...process.env,
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
    if (!shuttingDown && code !== 0) {
      console.error(`[${name}] exited with code ${code ?? signal}`);
      shutdown(code || 1);
    }
  });
  return child;
}

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 250).unref();
}

async function waitForHealth(url) {
  const start = Date.now();
  while (Date.now() - start < HEALTH_TIMEOUT_MS) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still booting.
    }
    await new Promise(resolve => setTimeout(resolve, HEALTH_INTERVAL_MS));
  }
  throw new Error(`Vendure did not become healthy within ${HEALTH_TIMEOUT_MS}ms (${url})`);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('Starting Vendure server, worker and dashboard...');
run('server', 'npm', ['run', 'dev:server']);

console.log(`Waiting for Vendure health check: ${SERVER_HEALTH_URL}`);
try {
  await waitForHealth(SERVER_HEALTH_URL);
  console.log('Vendure is healthy. Starting storefront...');
  run('storefront', 'npm', ['run', 'dev:storefront']);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  shutdown(1);
}
