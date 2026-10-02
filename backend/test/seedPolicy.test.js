import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldAutoSeed } from '../src/config/seedPolicy.js';

test('seeds an empty in-memory database for the demo', () => {
  assert.equal(shouldAutoSeed({ mongoUri: undefined, eventCount: 0 }), true);
  assert.equal(shouldAutoSeed({ mongoUri: '   ', eventCount: 0 }), true);
});

test('does not reseed an in-memory database with events', () => {
  assert.equal(shouldAutoSeed({ mongoUri: undefined, eventCount: 1 }), false);
});

test('never seeds a configured MongoDB automatically', () => {
  assert.equal(
    shouldAutoSeed({ mongoUri: 'mongodb://localhost:27017/symposium', eventCount: 0 }),
    false
  );
});
