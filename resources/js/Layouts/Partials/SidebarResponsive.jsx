import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PiHouse, PiLockKeyOpen, PiPlus, PiSquaresFour, PiUser } from 'react-icons/pi';

export default function SidebarResponsive({ auth, url, workspaces }) {
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-800">
            <div className="flex h-16 shrink-0 items-center space-x-1.5">
                <Link href="/" className="-m-1.5 p-1.5 text-2xl font-black leading-relaxed tracking-tighter">
                    Plannify<span className="text-red-500">.</span>
                </Link>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {/* menu */}
                            <li>
                                <Link
                                    href={route('dashboard')}
                                    className={cn(
                                        url.startsWith('/dashboard')
                                            ? 'bg-red-500 text-white'
                                            : 'text-foreground hover:bg-gray-100 dark:hover:bg-red-500',
                                        'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed',
                                    )}
                                >
                                    <PiHouse
                                        className={cn(
                                            url.startsWith('/dashboard') ? 'text-white' : 'text-foreground',
                                            'h-6 w-6 shrink-0',
                                        )}
                                    />
                                    Dashboard
                                </Link>
                            </li>
                            {auth.is_admin && (
                                <li>
                                    <Link
                                        href={route('users.index')}
                                        className={cn(
                                            url.startsWith('/users')
                                                ? 'bg-red-500 text-white'
                                                : 'text-foreground hover:bg-gray-100 dark:hover:bg-red-500',
                                            'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed',
                                        )}
                                    >
                                        <PiUser
                                            className={cn(
                                                url.startsWith('/users') ? 'text-white' : 'text-foreground',
                                                'h-6 w-6 shrink-0',
                                            )}
                                        ></PiUser>
                                        People
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    href={route('mytasks.index')}
                                    className={cn(
                                        url.startsWith('/my-tasks')
                                            ? 'bg-red-500 text-white'
                                            : 'text-foreground hover:bg-gray-100 dark:hover:bg-red-500',
                                        'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed',
                                    )}
                                >
                                    <PiSquaresFour
                                        className={cn(
                                            url.startsWith('/my-tasks') ? 'text-white' : 'text-foreground',
                                            'h-6 w-6 shrink-0',
                                        )}
                                    ></PiSquaresFour>
                                    My Tasks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className={cn(
                                        url.startsWith('/logout')
                                            ? 'bg-red-500 text-white'
                                            : 'text-foreground hover:bg-gray-100 dark:hover:bg-red-500',
                                        'group flex w-full gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed',
                                    )}
                                >
                                    <PiLockKeyOpen
                                        className={cn(
                                            url.startsWith('/logout') ? 'text-white' : 'text-foreground',
                                            'h-6 w-6 shrink-0',
                                        )}
                                    ></PiLockKeyOpen>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        {/* workspaces */}
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold uppercase leading-relaxed text-foreground">
                                Workspaces
                            </div>
                            <Link href={route('workspaces.create')}>
                                <PiPlus className="h-4 w-4 text-foreground hover:text-red-500"></PiPlus>
                            </Link>
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {workspaces.map((workspace, index) => (
                                <li key={index}>
                                    <Link
                                        href={route('workspaces.show', [workspace.memberable.slug])}
                                        className={cn(
                                            route().current('workspaces.show', [workspace.memberable.slug]) ||
                                                route().current()
                                                ? 'bg-red-500 text-white'
                                                : 'text-foreground hover:bg-gray-100 dark:hover:bg-red-500',
                                            'group flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-relaxed',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                route().current('workspaces.show', [workspace.memberable.slug]) ||
                                                    route().current()
                                                    ? 'border-red-600 text-red-600'
                                                    : 'border-foreground text-foreground',
                                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                            )}
                                        >
                                            {workspace.memberable.name.substring(0, 1)}
                                        </span>
                                        <span className="truncate">{workspace.memberable.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
