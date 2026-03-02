import { z } from 'zod';
import { uuid } from '@/lib/crypto';
import { getRandomChars } from '@/lib/generate';
import { parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { canCreateTeamWebsite, canCreateWebsite } from '@/permissions';
import { createLink, getVerifiedCustomDomainsForUser } from '@/queries/prisma';

const BATCH_SIZE = 50;

const slugRegex = /^[a-zA-Z0-9_-]+$/;

const rowSchema = z.object({
  name: z.string().min(1).max(100),
  url: z
    .string()
    .url()
    .max(500)
    .refine(u => /^https?:\/\//i.test(u), {
      message: 'Only http and https URLs are allowed',
    }),
  slug: z.string().min(1).max(100).regex(slugRegex).optional(),
  domain: z.string().max(253).optional(),
});

function sanitizeError(err: any): string {
  const msg: string = err?.message ?? '';
  if (msg.toLowerCase().includes('unique constraint') && msg.includes('slug')) {
    return 'Slug already taken';
  }
  return 'Failed to create link';
}

export async function POST(request: Request) {
  const schema = z.object({
    rows: z.array(rowSchema).min(1).max(1000),
    teamId: z.string().nullable().optional(),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { rows, teamId } = body;

  if (teamId) {
    if (!(await canCreateTeamWebsite(auth, teamId))) return unauthorized();
  } else {
    if (!(await canCreateWebsite(auth))) return unauthorized();
  }

  // Resolve domain strings to customDomainIds — only for domains the user owns
  const verifiedDomains = await getVerifiedCustomDomainsForUser(auth.user.id);
  const domainToId: Record<string, string> = Object.fromEntries(
    verifiedDomains.map(d => [d.domain, d.id]),
  );

  const results: { status: 'fulfilled' | 'rejected'; reason?: string }[] = [];

  // Process in batches to avoid overwhelming the DB
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (row: any) => {
        const slug = row.slug || getRandomChars(9);
        const customDomainId = row.domain ? (domainToId[row.domain] ?? null) : null;

        const data: any = {
          id: uuid(),
          name: row.name,
          url: row.url,
          slug,
          customDomainId,
        };

        if (teamId) {
          data.teamId = teamId;
        } else {
          data.userId = auth.user.id;
        }

        return createLink(data);
      }),
    );
    for (const r of batchResults) {
      results.push(
        r.status === 'fulfilled'
          ? { status: 'fulfilled' }
          : { status: 'rejected', reason: sanitizeError((r as PromiseRejectedResult).reason) },
      );
    }
  }

  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results
    .map((r, i) => (r.status === 'rejected' ? { row: i + 1, reason: r.reason } : null))
    .filter(Boolean);

  return json({ succeeded, failed });
}
