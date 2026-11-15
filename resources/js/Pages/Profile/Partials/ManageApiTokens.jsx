import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useI18n } from '@/i18n';
import { formatDateTime } from '@/utils/format';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ManageApiTokens({
    tokens = [],
    plainTextToken,
    apiEndpoint,
    tokenLimit = 5,
    className = '',
}) {
    const { t, locale } = useI18n();
    const [copied, setCopied] = useState(false);
    const [revoking, setRevoking] = useState(null);
    const [revokingNow, setRevokingNow] = useState(false);

    const { data, setData, post, reset, errors, processing } = useForm({
        name: '',
    });

    const atLimit = tokens.length >= tokenLimit;

    const submit = (event) => {
        event.preventDefault();

        post(route('api-tokens.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const copyToken = async () => {
        if (!plainTextToken) {
            return;
        }

        try {
            await navigator.clipboard.writeText(plainTextToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const confirmRevoke = () => {
        if (!revoking) {
            return;
        }

        setRevokingNow(true);
        router.delete(route('api-tokens.destroy', revoking.id), {
            preserveScroll: true,
            onFinish: () => {
                setRevokingNow(false);
                setRevoking(null);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-slate-900">
                    {t('API access')}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    {t('Let another system read work logs with a personal token. Tokens are read-only and follow the same visibility rules as your account.')}
                </p>
            </header>

            {plainTextToken && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                        {t('Copy this token now. It will not be shown again.')}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <code className="min-w-0 flex-1 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-slate-800 ring-1 ring-emerald-200">
                            {plainTextToken}
                        </code>
                        <button
                            type="button"
                            onClick={copyToken}
                            className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                            {copied ? t('Copied') : t('Copy')}
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <InputLabel htmlFor="token_name" value={t('Token name')} />
                    <TextInput
                        id="token_name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        className="mt-1 block w-full"
                        placeholder={t('e.g. Supervisor dashboard')}
                        maxLength={60}
                        required
                        disabled={atLimit}
                    />
                    <InputError message={errors.name} className="mt-2" />
                    <p className="mt-1 text-xs text-slate-500">
                        {t(':count of :max tokens used', { count: tokens.length, max: tokenLimit })}
                    </p>
                </div>

                <PrimaryButton disabled={processing || atLimit}>
                    {processing ? t('Generating...') : t('Generate token')}
                </PrimaryButton>
            </form>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('Endpoint')}
                </p>
                <code className="mt-1 block break-all font-mono text-xs text-slate-800">
                    GET {apiEndpoint}
                </code>
                <p className="mt-1 text-xs text-slate-500">
                    {t('Send the token as an Authorization: Bearer header.')}
                </p>
            </div>

            <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-800">
                    {t('Your tokens')}
                </h3>

                {tokens.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">{t('No tokens yet.')}</p>
                ) : (
                    <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                        {tokens.map((token) => (
                            <li key={token.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {token.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {t('Created')}: {formatDateTime(token.created_at, locale)}
                                        {' · '}
                                        {t('Last used')}: {token.last_used_at
                                            ? formatDateTime(token.last_used_at, locale)
                                            : t('Never')}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRevoking(token)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                                >
                                    {t('Revoke')}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ConfirmDialog
                open={Boolean(revoking)}
                title={t('Revoke token')}
                description={revoking ? t('Revoke “:name”? Any system using it will lose access immediately.', { name: revoking.name }) : ''}
                confirmLabel={t('Revoke')}
                processing={revokingNow}
                onConfirm={confirmRevoke}
                onClose={() => setRevoking(null)}
            />
        </section>
    );
}
