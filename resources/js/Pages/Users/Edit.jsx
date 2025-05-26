import HeaderForm from '@/Components/HeaderForm';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function Edit({ user, page_settings }) {
    const { data, setData, processing, reset, put, errors } = useForm({
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
        avatar: '',
        _method: page_settings.method,
    });

    const onHandleSubmit = (e) => {
        e.preventDefault();
        put(page_settings.action, {
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
            onError: (errors) => {},
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <div className="space-y-10 divide-y divide-dashed divide-gray-900/10">
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
                    <HeaderForm className="mb-8" title={page_settings.title} subtitle={page_settings.subtitle} />

                    <Card className="md:col-span-2">
                        <CardContent>
                            <form onSubmit={onHandleSubmit}>
                                <div className="py-6">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="col-span-full">
                                            <InputLabel htmlFor="name" value="Name" />
                                            <TextInput
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                                onErrors={errors.name && <InputError message={errors.name} />}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <InputLabel htmlFor="username" value="Username" />
                                            <TextInput
                                                type="text"
                                                name="username"
                                                id="username"
                                                value={data.username}
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                                onErrors={errors.username && <InputError message={errors.username} />}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <InputLabel htmlFor="email" value="email" />
                                            <TextInput
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                                onErrors={errors.email && <InputError message={errors.email} />}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <InputLabel htmlFor="password" value="password" />
                                            <TextInput
                                                type="password"
                                                name="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                                onErrors={errors.password && <InputError message={errors.password} />}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <InputLabel htmlFor="password_confirmation" value="Password Confirmation" />
                                            <TextInput
                                                type="password"
                                                name="password_confirmation"
                                                id="password_confirmation"
                                                onChange={(e) => setData(e.target.name, e.target.value)}
                                                value={data.password_confirmation}
                                                onErrors={
                                                    errors.password_confirmation && (
                                                        <InputError message={errors.password_confirmation} />
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <InputLabel htmlFor="avatar" value="Avatar" />
                                            <TextInput
                                                type="file"
                                                name="avatar"
                                                id="avatar"
                                                onChange={(e) => setData(e.target.name, e.target.files[0])}
                                                onErrors={errors.avatar && <InputError message={errors.avatar} />}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-x-2 py-6">
                                    <Button type="button" variant="ghost" onClick={() => reset()} disabled={processing}>
                                        Reset
                                    </Button>
                                    <Button type="submit" variant="red" disabled={processing}>
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
