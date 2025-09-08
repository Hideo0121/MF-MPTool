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
            },
        });
    };

    const handleCancel = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-3xl font-bold text-gray-800">ユーザー追加</DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                        新しいユーザーの作業者コードとパスワードを入力してください。
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="worker_code" className="text-blue-700 font-medium flex items-center">
                            <span className="material-icons mr-2">badge</span>
                            作業者コード
                        </Label>
                        <div className="relative">
                            <Input
                                id="worker_code"
                                value={data.worker_code}
                                onChange={e => setData('worker_code', e.target.value.toUpperCase())}
                                placeholder="例: X01"
                                required
                                className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg h-12"
                            />
                            <span className="material-icons absolute left-3 top-3 text-gray-400">person</span>
                        </div>
                        <InputError message={errors.worker_code} className="mt-1 text-red-500 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-blue-700 font-medium flex items-center">
                            <span className="material-icons mr-2">lock</span>
                            パスワード
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="パスワードを入力"
                                required
                                className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg h-12"
                            />
                            <span className="material-icons absolute left-3 top-3 text-gray-400">password</span>
                        </div>
                        <InputError message={errors.password} className="mt-1 text-red-500 text-sm" />
                    </div>
                    <DialogFooter className="gap-4 pt-6">
                        <Button type="button" variant="outline" onClick={handleCancel} className="w-full py-3 text-lg">
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                        >
                            <span className="material-icons mr-2">person_add</span>
                            {processing ? '登録中...' : '登録'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
