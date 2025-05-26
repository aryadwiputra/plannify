import { Button } from '@/Components/ui/button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const auth = usePage().props.auth.user;

    return (
        <div>
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 text-2xl font-black leading-relaxed tracking-tighter">
                            Plannify<span className="text-red-500">.</span>
                        </Link>
                    </div>
                    <div className="flex lg:hidden">
                        {auth ? (
                            <Link
                                href={route('dashboard')}
                                className="font-semibold leading-relaxed tracking-tighter text-foreground"
                            >
                                Dashboard <span aria-hidden="true">&rarr;</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="font-semibold leading-relaxed tracking-tighter text-foreground"
                            >
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        )}
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {auth ? (
                            <Link
                                href={route('dashboard')}
                                className="text-base font-semibold leading-relaxed tracking-tighter text-foreground"
                            >
                                Dashboard <span aria-hidden="true">&rarr;</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="text-base font-semibold leading-relaxed tracking-tighter text-foreground"
                            >
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <main className="isolate">
                <div className="relative pt-14">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-400 to-red-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold leading-relaxed tracking-tight text-foreground sm:text-6xl">
                                    Transforming Ideas into Reality with Your Kanban Board
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                    Where creativity meets productivity! With our intuitive Kanban Board, you can
                                    effortlessly organize your tasks into clear categories. Boost your team's
                                    efficiency, track project progress, and witness your ideas come to life.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Button variant="red" asChild>
                                        <Link href={route('login')}>Get started</Link>
                                    </Button>
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>
                                            Learn more <span aria-hidden="true">→</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-16 flow-root sm:mt-24">
                                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                    <img
                                        src="/assets/images/app.png"
                                        alt="App screenshot"
                                        width={2432}
                                        height={1442}
                                        className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-red-400 to-red-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

Welcome.layout = (page) => <GuestLayout children={page} title="Home" />;
