import { Card, CardContent } from '@/Components/ui/card';
import { messages } from '@/lib/utils';
import { Button } from '@headlessui/react';
import { Head, Link } from '@inertiajs/react';

export default function ErrorHandling({ status }) {
    const errorMessage = messages[status];

    return (
        <>
            <Head title={errorMessage.title} />
            <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <Card className="text-center">
                    <CardContent className="p-8">
                        <p className="text-base font-semibold text-red-500">{errorMessage.status}</p>
                        <h1 className="mt-4 text-5xl font-bold tracking-tighter text-foreground">
                            {errorMessage.title}
                        </h1>
                        <p className="mt-6 text-base leading-relaxed tracking-tighter text-muted-foreground">
                            {errorMessage.description}
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button variant="red" asChild>
                                <Link href="/">Go back home</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
