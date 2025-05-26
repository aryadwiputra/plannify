import AppLayout from '@/Layouts/AppLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <>
            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="mb-8" />

            <UpdatePasswordForm className="mb-8" />

            <DeleteUserForm className="mb-8" />
        </>
    );
}

Edit.layout = (page) => <AppLayout children={page} title="Profile" />;
