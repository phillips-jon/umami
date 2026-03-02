import { parseRequest } from '@/lib/request';
import { badRequest, ok, unauthorized } from '@/lib/response';
import { canUpdateWebsite } from '@/permissions';
import { deleteCustomDomain, getCustomDomain } from '@/queries/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ websiteId: string; domainId: string }> },
) {
  if (!process.env.ENABLE_CUSTOM_DOMAINS) {
    return badRequest({ message: 'Custom domains are not enabled.' });
  }

  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { websiteId, domainId } = await params;

  if (!(await canUpdateWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const domain = await getCustomDomain(domainId);

  if (!domain || domain.websiteId !== websiteId) {
    return badRequest({ message: 'Domain not found.' });
  }

  await deleteCustomDomain(domainId);

  return ok();
}
