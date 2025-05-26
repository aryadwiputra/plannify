import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Card>
                    <CardHeader>
                        <Link href="/" className="text-4xl font-black leading-relaxed tracking-tighter">
                            Plannify<span className="text-red-500">.</span>
                        </Link>
                        <h2 className="text-lg font-medium leading-9 tracking-tight text-left text-muted-foreground">
                            Thanks for signing up! Before getting started, could you verify your email address by
                            clicking on the link we just emailed to you? If you didn't receive the email, we will gladly
                            send you another.
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                            {status === 'verification-link-sent' && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    A new verification link has been sent to the email address you provided during
                                    registration.
                                </div>
                            )}
                            <form className="space-y-6" onSubmit={submit}>
                                {/* form */}
                                <div className="flex items-center justify-between mt-4">
                                    <Button disabled={processing}>Resend Verification</Button>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm underline rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

VerifyEmail.layout = (page) => <GuestLayout children={page} title="Verify Email" />;
