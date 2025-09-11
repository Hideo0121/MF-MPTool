import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isProcessing?: boolean;
  hotkeys?: { confirm?: string; cancel?: string };
}

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'はい',
  cancelLabel = 'キャンセル',
  onConfirm,
  isProcessing = false,
  hotkeys = { confirm: 'Enter', cancel: 'Escape' },
}: ConfirmModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (hotkeys.confirm && e.key === hotkeys.confirm && !isProcessing) {
        e.preventDefault();
        onConfirm();
      } else if (hotkeys.cancel && e.key === hotkeys.cancel && !isProcessing) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, hotkeys, isProcessing, onConfirm, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-gray-600 whitespace-pre-line">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4 sm:justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? '処理中...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
