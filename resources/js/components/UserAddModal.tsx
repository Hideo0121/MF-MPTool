import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { toast } from 'sonner';

interface UserAddModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UserAddModal({ open, onOpenChange }: UserAddModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        worker_code: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/workers', {
            onSuccess: () => {
                toast.success('ユーザー追加完了', {
                    description: '新しいユーザーが正常に追加されました。',
                    duration: 3000,
                });
                reset();
                onOpenChange(false);
            },
            onError: () => {
                toast.error('ユーザー追加に失敗しました', {
                    description: '入力内容を確認してください。',
                    duration: 3000,
                });
            }
        });
    };

    const handleCancel = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>ユーザー追加</DialogTitle>
                    <DialogDescription>
                        新しいユーザーの作業者コードとパスワードを入力してください。
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="worker_code">作業者コード</Label>
                        <Input
                            id="worker_code"
                            value={data.worker_code}
                            onChange={e => setData('worker_code', e.target.value.toUpperCase())}
                            placeholder="例: X01"
                            required
                        />
                        <InputError message={errors.worker_code} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">パスワード</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="パスワードを入力"
                            required
                        />
                        <InputError message={errors.password} />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            キャンセル
                        </Button>
                        <Button type="submit" disabled={processing}>
                            登録
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
