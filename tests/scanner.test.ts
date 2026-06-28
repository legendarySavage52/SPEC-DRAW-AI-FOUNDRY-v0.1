// tests/scanner.test.ts
import { scanRepository } from '../src/lib/scanner';

describe('scanner', () => {
  it('returns a ScanResult for the current directory', async () => {
    const res = await scanRepository('.');
    expect(res).toBeDefined();
    expect(typeof res.root).toBe('string');
    expect(Array.isArray(res.files)).toBe(true);
  });
});
