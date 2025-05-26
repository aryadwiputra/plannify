import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Card>
                    <CardHeader>
                        <Link href="/" className="text-4xl font-black leading-relaxed tracking-tighter">
                            Plannify<span className="text-red-500">.</span>
                        </Link>
                        <h2 className="text-left text-lg font-medium leading-9 tracking-tight text-muted-foreground">
                            Forgot your password? No problem. Just let us know your email address and we will email you
                            a password reset link that will allow you to choose a new one.
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                            <form className="space-y-6" onSubmit={submit}>
                                {/* form */}
                                <div>
                                    <InputLabel htmlFor="email" value={'Email'} />
                                    <TextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        placeholders="Email Address"
                                        onChange={(e) => setData('email', e.target.email)}
                                        onErrors={
                                            errors.email && <InputError className="mt-1" message={errors.email} />
                                        }
                                    />
                                </div>

                                <div>
                                    <Button type="submit" variant="red" className="w-full" disabled={processing}>
                                        Email password reset link
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

ForgotPassword.layout = (page) => <GuestLayout children={page} title="Forgot Password" />;
