import assert from 'node:assert/strict';
import test from 'node:test';

import {bindArtalkLifecycle} from '../src/components/Comments/artalkLifecycle';

type Handler = (payload?: unknown) => void;

class FakeArtalkLifecycle {
  readonly handlers = new Map<string, Set<Handler>>();
  reloadCalls = 0;

  on(name: string, handler: Handler): void {
    const handlers = this.handlers.get(name) ?? new Set<Handler>();
    handlers.add(handler);
    this.handlers.set(name, handlers);
  }

  off(name: string, handler: Handler): void {
    this.handlers.get(name)?.delete(handler);
  }

  reload(): void {
    this.reloadCalls += 1;
  }

  emit(name: string, payload?: unknown): void {
    this.handlers.get(name)?.forEach((handler) => handler(payload));
  }
}

test('reloads once after mount and forwards list state events', () => {
  const instance = new FakeArtalkLifecycle();
  let readyCalls = 0;
  let failedCalls = 0;
  const cleanup = bindArtalkLifecycle(
    instance as Parameters<typeof bindArtalkLifecycle>[0],
    {
      onReady: () => {
        readyCalls += 1;
      },
      onFailed: () => {
        failedCalls += 1;
      },
    },
  );

  instance.emit('mounted');
  instance.emit('list-loaded', []);
  instance.emit('list-failed', new Error('network'));

  assert.equal(instance.reloadCalls, 1);
  assert.equal(readyCalls, 1);
  assert.equal(failedCalls, 1);

  cleanup();
  assert.equal(instance.handlers.get('mounted')?.size, 0);
  assert.equal(instance.handlers.get('list-loaded')?.size, 0);
  assert.equal(instance.handlers.get('list-failed')?.size, 0);

  instance.emit('mounted');
  instance.emit('list-loaded', []);
  instance.emit('list-failed', new Error('network'));

  assert.equal(instance.reloadCalls, 1);
  assert.equal(readyCalls, 1);
  assert.equal(failedCalls, 1);
});
