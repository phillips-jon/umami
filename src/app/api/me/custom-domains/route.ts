import { parseRequest } from '@/lib/request';
import { badRequest, json } from '@/lib/response';
import { getVerifiedCustomDomainsForUser } from '@/queries/prisma';

export async function GET(request: Request) {
  if (!process.env.ENABLE_CUSTOM_DOMAINS) {
    return badRequest({ message: 'Custom domains are not enabled.' });
  }

  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const domains = await getVerifiedCustomDomainsForUser(auth.user.id);

  return json({ data: domains });
}
