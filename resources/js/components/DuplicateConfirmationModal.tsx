import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DuplicateConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}

export default function DuplicateConfirmationModal({
    open,
    onOpenChange,
    onConfirm,
    isSubmitting,
}: DuplicateConfirmationModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === 'F12') {
                e.preventDefault();
                if (!isSubmitting) {
                    onConfirm();
                }
            } else if (e.key === 'F1') {
                e.preventDefault();
                if (!isSubmitting) {
                    onOpenChange(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onConfirm, onOpenChange, isSubmitting]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <DialogHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                        <span className="material-icons text-3xl text-yellow-600">warning</span>
                    </div>
                    <DialogTitle className="mt-4 text-3xl font-bold text-gray-800">重複の確認</DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                        同じ内容のデータが既に存在します。
                        <br />
                        このまま登録を続けますか？
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-4 pt-6 sm:justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="w-full py-3 text-lg"
                    >
                        キャンセル (F1)
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                    >
                        <span className="material-icons mr-2">save</span>
                        {isSubmitting ? '登録中...' : '登録する (F12)'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
