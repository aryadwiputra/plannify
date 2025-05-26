import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Card>
                    <CardHeader>
                        <Link href="/" className="text-4xl font-black leading-relaxed tracking-tighter">
                            Plannify<span className="text-red-500">.</span>
                        </Link>
                        <h2 className="text-left text-lg font-medium leading-relaxed tracking-tight text-muted-foreground">
                            Sign in to your account
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
                                        onChange={(e) => setData('email', e.target.value)}
                                        onErrors={
                                            errors.email && <InputError className="mt-1" message={errors.email} />
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <InputLabel htmlFor="password" value={'Password'} />
                                        {canResetPassword && (
                                            <div className="text-sm">
                                                <Link
                                                    href="#"
                                                    className="font-semibold text-red-500 hover:text-red-600"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <TextInput
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={data.password}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('password', e.target.value)}
                                            onErrors={
                                                errors.password && (
                                                    <InputError className="mt-1" message={errors.password} />
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 block">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />

                                        <span className="ms-2 text-sm text-muted-foreground">Remember me</span>
                                    </label>
                                </div>

                                <div>
                                    <Button type="submit" variant="red" className="w-full" disabled={processing}>
                                        Sign in
                                    </Button>
                                </div>
                            </form>

                            <p className="mt-10 text-center text-sm text-muted-foreground">
                                Not a member?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-semibold leading-6 text-red-500 hover:text-red-600"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Login.layout = (page) => <GuestLayout children={page} title="Login" />;
