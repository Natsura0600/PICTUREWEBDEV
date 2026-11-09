import { describe, expect, it } from 'vitest';
import { memoryLimit } from '@/lib/ratelimit';

describe('memoryLimit', () => {
  it('permite 5 envíos por IP y frena el sexto', () => {
    const ip = `test-${Math.random()}`;
    const t = 5_000_000;
    const results = Array.from({ length: 6 }, (_, i) => memoryLimit(ip, t + i));
    expect(results).toEqual([true, true, true, true, true, false]);
  });

  it('vuelve a permitir cuando pasan 10 minutos', () => {
    const ip = `test-${Math.random()}`;
    const t = 9_000_000;
    for (let i = 0; i < 5; i++) memoryLimit(ip, t);
    expect(memoryLimit(ip, t + 1)).toBe(false);
    expect(memoryLimit(ip, t + 10 * 60 * 1000 + 1)).toBe(true);
  });

  it('cuenta cada IP por separado', () => {
    const t = 12_000_000;
    for (let i = 0; i < 5; i++) memoryLimit('a-ip', t);
    expect(memoryLimit('a-ip', t)).toBe(false);
    expect(memoryLimit('otra-ip', t)).toBe(true);
  });
});
