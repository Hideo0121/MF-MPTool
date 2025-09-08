import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { type PageProps, type NgReason } from '@/types';
import { toast } from 'sonner';
import UserAddModal from '@/components/UserAddModal';

export default function Entry() {
    const { auth } = usePage<PageProps>().props;
    const [userAddModalOpen, setUserAddModalOpen] = useState(false);
    const [ngReasons, setNgReasons] = useState<NgReason[]>([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        line_uid: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        points: '',
        ng_reason_id: '', // Will be set to '指定なし' when available
    });

    useEffect(() => {
        axios.get('/api/ng-reasons')
            .then(response => {
                const reasons: NgReason[] = response.data;
                setNgReasons(reasons);

                // Find the '指定なし' reason and set it as default if no value is already set
                const defaultReason = reasons.find(r => r.reason === '指定なし');
                if (defaultReason && !data.ng_reason_id) {
                    setData('ng_reason_id', String(defaultReason.id));
                }
            })
            .catch(err => {
                console.error("Failed to fetch NG reasons:", err);
            });
    }, [data.ng_reason_id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F12') {
                e.preventDefault();
                submit(e as any); // submit関数を呼び出す
            } else if (e.key === 'F5' && document.activeElement?.id === 'line_uid') {
                e.preventDefault();
                navigator.clipboard.readText().then(text => {
                    setData('line_uid', text);
                }).catch(err => {
                    console.error('クリップボードの読み取りに失敗しました: ', err);
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [data]);

    // Focus management for validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const fieldOrder: (keyof typeof errors)[] = ['line_uid', 'month', 'day', 'hour', 'minute', 'ng_reason_id'];
            for (const field of fieldOrder) {
                if (errors[field]) {
                    setTimeout(() => {
                        const element = document.getElementById(field);
                        if (element) {
                            // Special handling for Select component
                            if (field === 'ng_reason_id') {
                                const selectTrigger = element.querySelector('[role="combobox"]') as HTMLElement;
                                if (selectTrigger) {
                                    selectTrigger.focus();
                                } else {
                                    element.focus();
                                }
                            } else {
                                element.focus();
                            }
                        }
                    }, 100); // Short delay to ensure DOM is updated
                    break;
                }
            }
        }
    }, [errors]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/entry', {
            onSuccess: () => {
                toast.success('登録が完了しました', {
                    description: 'データが正常に保存されました。',
                    duration: 3000,
                });

                // 各フィールドの値を明示的に設定して初期化する
                setData({
                    line_uid: '',
                    month: '',
                    day: '',
                    hour: '',
                    minute: '',
                    points: '',
                    ng_reason_id: '', // これでuseEffectがトリガーされる
                });

                // DOMの更新を待ってからフォーカスを当てる
                setTimeout(() => {
                    document.getElementById('line_uid')?.focus();
                }, 100);
            },
            onError: () => {
                toast.error('登録に失敗しました', {
                    description: 'データの保存中にエラーが発生しました。',
                    duration: 3000,
                });
            }
        });
    };

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea') {
            e.preventDefault();

            // Focus management for Enter key
            const currentElement = e.target as HTMLElement;
            const formElements = Array.from(e.currentTarget.querySelectorAll(
                'input[type="text"], input[type="number"], [role="combobox"], button[type="submit"]'
            )) as HTMLElement[];

            const currentIndex = formElements.indexOf(currentElement);

            // If current element is not found, try to find the parent element (for Select component)
            let actualIndex = currentIndex;
            if (currentIndex === -1) {
                const parentElement = currentElement.closest('[role="combobox"]') as HTMLElement;
                if (parentElement) {
                    actualIndex = formElements.indexOf(parentElement);
                }
            }

            if (actualIndex !== -1 && actualIndex < formElements.length - 1) {
                const nextElement = formElements[actualIndex + 1];

                // Special handling for Select component
                if (nextElement.getAttribute('role') === 'combobox') {
                    nextElement.click();
                } else {
                    nextElement.focus();
                }
            } else if (actualIndex === formElements.length - 1) {
                // If it's the submit button, submit the form
                if ((currentElement as HTMLButtonElement).type === 'submit') {
                    submit(e as any);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Head title="データ入力 - MF_MPTool" />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src="/image/mpsmall.jpg"
                        alt="ロゴ"
                        className="w-8 h-8 rounded-full mr-4"
                    />
                    <h1 className="text-xl font-bold">モンプチ レシート登録</h1>
                </div>
                <div className="flex items-center gap-2">
                    {['J04', 'J06'].includes(auth.user?.worker_code ?? '') && (
                        <Button
                            variant="default" // ベースのvariantを指定
                            className="border border-white bg-transparent text-white hover:bg-white hover:text-blue-700"
                            onClick={() => setUserAddModalOpen(true)}
                        >
                            ユーザー追加
                        </Button>
                    )}
                    <Button
                        variant="default"
                        className="border border-white bg-transparent text-white hover:bg-white hover:text-blue-700"
                        asChild
                    >
                        <Link href={route('logout')} method="post" as="button">
                            ログアウト
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={submit} onKeyDown={handleFormKeyDown} className="space-y-8">
                        {/* LINE UID */}
                        <div className="space-y-2">
                            <Label htmlFor="line_uid" className="text-blue-700 font-medium flex items-center">
                                <span className="material-icons mr-2">link</span>
                                LINE UID
                            </Label>
                            <div className="relative">
                                <Input
                                    id="line_uid"
                                    type="text"
                                    autoFocus
                                    value={data.line_uid}
                                    onChange={e => setData('line_uid', e.target.value)}
                                    className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg h-12"
                                    placeholder="LINE UIDを入力"
                                />
                                <span className="material-icons absolute left-3 top-3 text-gray-400">account_circle</span>
                            </div>
                            <InputError message={errors.line_uid} className="text-red-500 text-sm" />
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                            <Label htmlFor="points" className="text-blue-700 font-medium flex items-center">
                                <span className="material-icons mr-2">star</span>
                                ポイント
                            </Label>
                            <div className="relative">
                                <Input
                                    id="points"
                                    type="number"
                                    value={data.points}
                                    onChange={e => setData('points', e.target.value)}
                                    className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg h-12"
                                    placeholder="ポイントを入力"
                                />
                                <span className="material-icons absolute left-3 top-3 text-gray-400">control_point</span>
                            </div>
                            <InputError message={errors.points} className="text-red-500 text-sm" />
                        </div>

                        {/* Receipt Datetime */}
                        <fieldset className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50/30">
                            <legend className="px-4 text-blue-700 font-bold flex items-center">
                                <span className="material-icons mr-2">schedule</span>
                                レシート日時
                            </legend>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="month" className="text-blue-700 font-medium">月</Label>
                                    <div className="relative">
                                        <Input
                                            id="month"
                                            type="number"
                                            value={data.month}
                                            onChange={e => setData('month', e.target.value)}
                                            className="pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                            placeholder="1-12"
                                            min="1"
                                            max="12"
                                        />
                                        <span className="material-icons absolute left-2 top-2 text-gray-400 text-lg">date_range</span>
                                    </div>
                                    <InputError message={errors.month} className="text-red-500 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="day" className="text-blue-700 font-medium">日</Label>
                                    <div className="relative">
                                        <Input
                                            id="day"
                                            type="number"
                                            value={data.day}
                                            onChange={e => setData('day', e.target.value)}
                                            className="pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                            placeholder="1-31"
                                            min="1"
                                            max="31"
                                        />
                                        <span className="material-icons absolute left-2 top-2 text-gray-400 text-lg">today</span>
                                    </div>
                                    <InputError message={errors.day} className="text-red-500 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hour" className="text-blue-700 font-medium">時</Label>
                                    <div className="relative">
                                        <Input
                                            id="hour"
                                            type="number"
                                            value={data.hour}
                                            onChange={e => setData('hour', e.target.value)}
                                            className="pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                            placeholder="0-23"
                                            min="0"
                                            max="23"
                                        />
                                        <span className="material-icons absolute left-2 top-2 text-gray-400 text-lg">access_time</span>
                                    </div>
                                    <InputError message={errors.hour} className="text-red-500 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minute" className="text-blue-700 font-medium">分</Label>
                                    <div className="relative">
                                        <Input
                                            id="minute"
                                            type="number"
                                            value={data.minute}
                                            onChange={e => setData('minute', e.target.value)}
                                            className="pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                            placeholder="0-59"
                                            min="0"
                                            max="59"
                                        />
                                        <span className="material-icons absolute left-2 top-2 text-gray-400 text-lg">timer</span>
                                    </div>
                                    <InputError message={errors.minute} className="text-red-500 text-sm" />
                                </div>
                            </div>
                        </fieldset>

                        {/* NG Reason */}
                        <div className="space-y-2">
                            <Label htmlFor="ng_reason_id" className="text-blue-700 font-medium flex items-center">
                                <span className="material-icons mr-2">list</span>
                                NG理由
                            </Label>
                            <div className="relative" id="ng_reason_id">
                                <Select
                                    onValueChange={value => setData('ng_reason_id', value)}
                                    value={data.ng_reason_id}
                                    defaultValue={ngReasons.find(r => r.reason === '指定なし')?.id?.toString()}
                                >
                                    <SelectTrigger
                                        className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg pl-12"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                // Find submit button and focus it
                                                const submitButton = document.querySelector('button[type="submit"]') as HTMLElement;
                                                if (submitButton) {
                                                    submitButton.focus();
                                                }
                                            }
                                        }}
                                    >
                                        <SelectValue placeholder="理由を選択してください..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ngReasons.map(reason => (
                                            <SelectItem key={reason.id} value={String(reason.id)}>
                                                {reason.reason}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="material-icons absolute left-3 top-3 text-gray-400 pointer-events-none">category</span>
                            </div>
                            <InputError message={errors.ng_reason_id} className="text-red-500 text-sm" />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                            >
                                <span className="material-icons mr-2">save</span>
                                {processing ? '登録中...' : '登録'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Helper Text */}
                <div className="mt-6 text-center text-gray-600 space-y-2">
                    <p className="text-sm">💡 ショートカットキー: F5でクリップボード貼り付け | F12で登録実行</p>
                    <p className="text-xs">Enterキーでフィールド間を移動できます</p>
                </div>
            </div>

            <UserAddModal
                open={userAddModalOpen}
                onOpenChange={setUserAddModalOpen}
            />

            {/* Material Icons Link */}
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
            />
        </div>
    );
}
