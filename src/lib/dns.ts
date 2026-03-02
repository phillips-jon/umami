import dns from 'dns/promises';

export async function verifyCname(
  domain: string,
  expectedTarget: string,
): Promise<{ verified: boolean; actual: string | null }> {
  try {
    const records = await dns.resolveCname(domain);
    const normalized = records.map(r => r.replace(/\.$/, '').toLowerCase());
    const target = expectedTarget.replace(/\.$/, '').toLowerCase();

    if (normalized.includes(target)) {
      return { verified: true, actual: normalized[0] };
    }

    return { verified: false, actual: normalized[0] ?? null };
  } catch {
    return { verified: false, actual: null };
  }
}
