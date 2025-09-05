import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Head, useForm, usePage } from '@inertiajs/react';
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
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { type PageProps, type NgReason } from '@/types';

export default function Entry() {
    const { props } = usePage<PageProps>();
    const [ngReasons, setNgReasons] = useState<NgReason[]>([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        line_uid: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        ng_reason_id: '', // Will be set in useEffect
    });

    useEffect(() => {
        axios.get('/api/ng-reasons')
            .then(response => {
                const reasons: NgReason[] = response.data;
                setNgReasons(reasons);

                // Find the '指定なし' reason and set it as default
                const defaultReason = reasons.find(r => r.reason === '指定なし');
                if (defaultReason) {
                    setData('ng_reason_id', String(defaultReason.id));
                }
            })
            .catch(err => {
                console.error("Failed to fetch NG reasons:", err);
            });
    }, []);

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

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/entry', {
            onSuccess: () => reset('line_uid', 'month', 'day', 'hour', 'minute'),
        });
    };

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea') {
            e.preventDefault();
        }
    };

    return (
        <AppLayout>
            <Head title="データ入力" />
            <Heading title="モンプチ レシート登録" />

            {props.flash?.success && (
                <div className="mb-4 rounded-md bg-green-100 p-4 text-center text-green-700">
                    {props.flash.success}
                </div>
            )}

            <form onSubmit={submit} onKeyDown={handleFormKeyDown} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* LINE UID */}
                    <div className="col-span-2">
                        <Label htmlFor="line_uid">LINE UID</Label>
                        <Input
                            id="line_uid"
                            value={data.line_uid}
                            onChange={e => setData('line_uid', e.target.value)}
                            className="mt-1"
                        />
                        <InputError message={errors.line_uid} className="mt-2" />
                    </div>

                    {/* Receipt Datetime */}
                    <fieldset className="col-span-2 rounded-md border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">レシート日時</legend>
                        <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
                            <div>
                                <Label htmlFor="month">月</Label>
                                <Input
                                    id="month"
                                    type="number"
                                    value={data.month}
                                    onChange={e => setData('month', e.target.value)}
                                    className="mt-1"
                                />
                                <InputError message={errors.month} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="day">日</Label>
                                <Input
                                    id="day"
                                    type="number"
                                    value={data.day}
                                    onChange={e => setData('day', e.target.value)}
                                    className="mt-1"
                                />
                                <InputError message={errors.day} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="hour">時</Label>
                                <Input
                                    id="hour"
                                    type="number"
                                    value={data.hour}
                                    onChange={e => setData('hour', e.target.value)}
                                    className="mt-1"
                                />
                                <InputError message={errors.hour} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="minute">分</Label>
                                <Input
                                    id="minute"
                                    type="number"
                                    value={data.minute}
                                    onChange={e => setData('minute', e.target.value)}
                                    className="mt-1"
                                />
                                <InputError message={errors.minute} className="mt-2" />
                            </div>
                        </div>
                    </fieldset>

                    {/* NG Reason */}
                    <div className="col-span-2">
                        <Label htmlFor="ng_reason_id">NG理由</Label>
                        <Select onValueChange={value => setData('ng_reason_id', value)} value={data.ng_reason_id}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="理由を選択..." />
                            </SelectTrigger>
                            <SelectContent>
                                {ngReasons.map(reason => (
                                    <SelectItem key={reason.id} value={String(reason.id)}>
                                        {reason.reason}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.ng_reason_id} className="mt-2" />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Button type="submit" disabled={processing}>
                        登録
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
