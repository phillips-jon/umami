import { beforeEach, expect, test, vi } from 'vitest';
import { parseRequest } from '@/lib/request';
import { canCreateTeamWebsite, canCreateWebsite } from '@/permissions';
import { createLink } from '@/queries/prisma';
import { POST } from './route';

vi.mock('@/lib/request', () => ({
  getQueryFilters: vi.fn(),
  parseRequest: vi.fn(),
}));

vi.mock('@/permissions', () => ({
  canCreateTeamWebsite: vi.fn(),
  canCreateWebsite: vi.fn(),
}));

vi.mock('@/queries/prisma', () => ({
  createLink: vi.fn(),
  getUserLinks: vi.fn(),
}));

const parseRequestMock = vi.mocked(parseRequest);
const canCreateTeamWebsiteMock = vi.mocked(canCreateTeamWebsite);
const canCreateWebsiteMock = vi.mocked(canCreateWebsite);
const createLinkMock = vi.mocked(createLink);

beforeEach(() => {
  parseRequestMock.mockReset();
  canCreateTeamWebsiteMock.mockReset();
  canCreateWebsiteMock.mockReset();
  createLinkMock.mockReset();
});

test('POST allows short link slugs and rejects invalid slugs and URLs, matching edit validation', async () => {
  parseRequestMock.mockResolvedValue({
    auth: {
      user: {
        id: 'user-1',
      },
    },
    body: {
      name: 'Docs',
      url: 'https://example.com',
      slug: 'abcdefgh',
    },
    error: undefined,
  });
  canCreateWebsiteMock.mockResolvedValue(true);
  createLinkMock.mockResolvedValue({ id: 'link-1' } as any);

  const response = await POST(new Request('http://localhost/api/links', { method: 'POST' }));
  const schema = parseRequestMock.mock.calls[0][1] as {
    safeParse: (value: unknown) => { success: boolean };
  };

  const parse = (slug: string, url = 'https://example.com') =>
    schema.safeParse({ name: 'Docs', url, slug }).success;

  // This fork allows short, editable slugs rather than upstream's minimum of 8.
  expect(parse('a')).toBe(true);
  expect(parse('1234567')).toBe(true);
  expect(parse('')).toBe(false);
  expect(parse('a'.repeat(101))).toBe(false);

  // Slugs are restricted to letters, numbers, hyphens and underscores.
  expect(parse('valid_slug-1')).toBe(true);
  expect(parse('has space')).toBe(false);
  expect(parse('has/slash')).toBe(false);

  // Destination URLs must be http or https.
  expect(parse('abcdefgh', 'javascript:alert(1)')).toBe(false);
  expect(parse('abcdefgh', 'ftp://example.com')).toBe(false);
  expect(parse('abcdefgh', 'http://example.com')).toBe(true);

  expect(createLinkMock).toHaveBeenCalledWith({
    id: expect.any(String),
    name: 'Docs',
    url: 'https://example.com',
    slug: 'abcdefgh',
    teamId: undefined,
    customDomainId: null,
    userId: 'user-1',
  });
  expect(response.status).toBe(200);
});
