import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useI18n } from '@/i18n';
import { Head } from '@inertiajs/react';
import ManageApiTokens from './Partials/ManageApiTokens';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
    tokens = [],
    plainTextToken,
    apiEndpoint,
    tokenLimit,
}) {
    const { t } = useI18n();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    {t('Profile')}
                </h2>
            }
        >
            <Head title={t('Profile')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Update Profile Information */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Update Password */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Personal API tokens */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <ManageApiTokens
                            tokens={tokens}
                            plainTextToken={plainTextToken}
                            apiEndpoint={apiEndpoint}
                            tokenLimit={tokenLimit}
                            className="max-w-3xl"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}