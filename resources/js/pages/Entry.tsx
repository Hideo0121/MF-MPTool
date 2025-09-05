import { AppShell } from '@/components/app-shell';
import { AppContent } from '@/components/app-content';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

interface NgReason {
    id: number;
    reason: string;
}

export default function Entry() {
    const [ngReasons, setNgReasons] = useState<NgReason[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                // Find the 'Not specified' reason and set it as default
                const defaultReason = reasons.find(r => r.reason === '指定なし');
                if (defaultReason) {
                    setData('ng_reason_id', String(defaultReason.id));
                }
            })
            .catch(err => {
                console.error("Failed to fetch NG reasons:", err);
                setError("Failed to load NG reasons. Please refresh the page.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/entries', {
            onSuccess: () => reset(),
        });
    };

    if (isLoading) {
        return (
            <AppShell variant="header">
                <Head title="Loading..." />
                <div className="flex h-full flex-1 items-center justify-center">
                    <LoaderCircle className="h-10 w-10 animate-spin" />
                </div>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell variant="header">
                <Head title="Error" />
                <div className="flex h-full flex-1 items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell variant="header">
            <Head title="Data Entry" />
            <AppContent variant="header" className="py-4">
                <div className="mx-auto w-full max-w-2xl rounded-xl border border-sidebar-border/70 p-8 dark:border-sidebar-border">
                    <h1 className="mb-6 text-2xl font-semibold">NG Data Entry</h1>
                    <form onSubmit={submit} className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <Label htmlFor="line_uid">Line UID</Label>
                            <Input
                                id="line_uid"
                                value={data.line_uid}
                                onChange={e => setData('line_uid', e.target.value)}
                                required
                                minLength={33}
                                maxLength={33}
                                pattern="[a-zA-Z0-9]{33}"
                                title="Please enter 33 alphanumeric characters."
                            />
                            <InputError message={errors.line_uid} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="month">Month</Label>
                            <Input
                                id="month"
                                type="number"
                                value={data.month}
                                onChange={e => setData('month', e.target.value)}
                                required
                                min="1"
                                max="12"
                            />
                            <InputError message={errors.month} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="day">Day</Label>
                            <Input
                                id="day"
                                type="number"
                                value={data.day}
                                onChange={e => setData('day', e.target.value)}
                                required
                                min="1"
                                max="31"
                            />
                            <InputError message={errors.day} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="hour">Hour</Label>
                            <Input
                                id="hour"
                                type="number"
                                value={data.hour}
                                onChange={e => setData('hour', e.target.value)}
                                required
                                min="0"
                                max="23"
                            />
                            <InputError message={errors.hour} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="minute">Minute</Label>
                            <Input
                                id="minute"
                                type="number"
                                value={data.minute}
                                onChange={e => setData('minute', e.target.value)}
                                required
                                min="0"
                                max="59"
                            />
                            <InputError message={errors.minute} className="mt-2" />
                        </div>

                        <div className="col-span-2">
                             <InputError message={errors.date} />
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="ng_reason_id">NG Reason</Label>
                            <Select onValueChange={value => setData('ng_reason_id', value)} value={data.ng_reason_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason..." />
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

                        <div className="col-span-2 text-right">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AppContent>
        </AppShell>
    );
}