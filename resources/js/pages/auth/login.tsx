import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        worker_code: '',
        password: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <Head title="ログイン - MF_MPTool" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <img src="/image/mp.jpg" alt="ロゴ" className="w-48 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800">ログイン</h1>
                        <p className="text-gray-500 mt-2">作業者コードとパスワードを入力してください</p>
                    </div>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="worker_code" className="text-blue-700 font-medium flex items-center">
                                <span className="material-icons mr-2">person</span>
                                作業者コード
                            </Label>
                            <div className="relative">
                                <Input
                                    id="worker_code"
                                    type="text"
                                    name="worker_code"
                                    value={data.worker_code}
                                    onInput={e => setData('worker_code', e.currentTarget.value.toUpperCase())}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    placeholder="作業者コードを入力"
                                    className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg h-12"
                                />
                                <span className="material-icons absolute left-3 top-3 text-gray-400">badge</span>
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
                                    name="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="パスワードを入力"
                                    className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg h-12"
                                />
                                <span className="material-icons absolute left-3 top-3 text-gray-400">password</span>
                            </div>
                            <InputError message={errors.password} className="mt-1 text-red-500 text-sm" />
                        </div>

                        <div className="flex justify-center pt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                            >
                                <span className="material-icons mr-2">login</span>
                                {processing ? '処理中...' : 'ログイン'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
