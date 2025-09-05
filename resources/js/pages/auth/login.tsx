import AuthController from '@/actions/App/Http/Controllers/AuthController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, User, Lock } from 'lucide-react';
import { type FormEvent } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        worker_code: '',
        password: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(AuthController.login.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="ログイン" description="">
            <Head title="ログイン" />

            <form onSubmit={submit} className="flex flex-col gap-8 pt-2">
                <div className="grid gap-6">
                    <div className="relative">
                        <Label
                            htmlFor="worker_code"
                            className="absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground"
                        >
                            作業者コード
                        </Label>
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="worker_code"
                            type="text"
                            name="worker_code"
                            value={data.worker_code}
                            onInput={e => setData('worker_code', e.currentTarget.value.toUpperCase())}
                            required
                            autoFocus
                            autoComplete="username"
                            placeholder="X00"
                            className="pl-10"
                        />
                        <InputError message={errors.worker_code} className="mt-2" />
                    </div>

                    <div className="relative">
                        <Label
                            htmlFor="password"
                            className="absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground"
                        >
                            パスワード
                        </Label>
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="Password"
                            className="pl-10"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        ログイン
                    </Button>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
