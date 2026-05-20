import { useMessages } from '@/components/hooks';
import { Upload } from '@/components/icons';
import { DialogButton } from '@/components/input/DialogButton';
import { LinkImportForm } from './LinkImportForm';

export function LinkImportButton({ teamId }: { teamId?: string }) {
  const { t, labels } = useMessages();

  return (
    <DialogButton icon={<Upload />} label={t(labels.importLinks)} width="700px">
      {({ close }) => <LinkImportForm teamId={teamId} onClose={close} />}
    </DialogButton>
  );
}
