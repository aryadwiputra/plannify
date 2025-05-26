import { Button } from '@/Components/ui/button';
import { flashMessage } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { PiCheckSquareFill, PiSquare } from 'react-icons/pi';
import { toast } from 'sonner';

export default function TaskListChildrenCard({ children }) {
    return (
        <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {children.length > 0 &&
                children.map((item, index) => (
                    <li key={index} className="flex items-center justify-between py-6 text-sm leading-relaxed">
                        <div className="flex w-0 flex-1 items-center">
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    router.put(
                                        route('tasks.completed', {
                                            card: item.card_id,
                                            task: item.id,
                                        }),
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            onSuccess: (success) => {
                                                const flash = flashMessage(success);

                                                if (flash) toast[flash.type](flash.message);
                                            },
                                        },
                                    )
                                }
                            >
                                {item.is_completed == true ? (
                                    <PiCheckSquareFill className="h-5 w-5 flex-shrink-0 text-foreground" />
                                ) : (
                                    <PiSquare className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                )}
                            </Button>
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                {item.is_completed == true ? (
                                    <span className="truncate font-medium line-through">{item.title}</span>
                                ) : (
                                    <span className="truncate font-medium">{item.title}</span>
                                )}
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <Button
                                variant="link"
                                className="font-medium text-red-500 hover:text-red-600 hover:no-underline"
                                onClick={() =>
                                    router.delete(
                                        route('tasks.destroy', {
                                            card: item.card_id,
                                            task: item.id,
                                        }),
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            onSuccess: (success) => {
                                                const flash = flashMessage(success);

                                                if (flash) toast[flash.type](flash.message);
                                            },
                                        },
                                    )
                                }
                            >
                                Delete
                            </Button>
                        </div>
                    </li>
                ))}
        </ul>
    );
}
