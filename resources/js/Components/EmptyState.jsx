import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PiDatabase } from 'react-icons/pi';

export function EmptyState({ title, url, className }) {
    return (
        <Link
            href={url}
            className={cn(
                'relative block w-full rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                className,
            )}
        >
            <PiDatabase className="mx-auto h-12 w-12 text-muted-foreground"></PiDatabase>
            <span className="mt-2 block text-sm font-medium leading-relaxed tracking-tighter">
                Create a new {title}
            </span>
        </Link>
    );
}
