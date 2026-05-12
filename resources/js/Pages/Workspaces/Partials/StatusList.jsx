import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from '@inertiajs/react';
import { GripVertical } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PiPlus } from 'react-icons/pi';
import { toast } from 'sonner';
import { flashMessage } from '@/lib/utils';
import CardList from './CardList';

export default function StatusList({ status, cards, workspace, handleDeleteCard, onCardClick }) {
    const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);
    const [showQuickCreate, setShowQuickCreate] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        deadline: '',
        status: status.value,
        priority: 'Unknown',
    });

    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: status.value,
        data: {
            type: 'Status',
            status,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const submitQuickCreate = (e) => {
        e.preventDefault();

        post(route('cards.store', { workspace: workspace.slug ?? workspace }), {
            preserveScroll: true,
            onSuccess: (success) => {
                reset('title', 'description', 'deadline');
                setShowQuickCreate(false);
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-full min-w-[330px] space-y-4 rounded-3xl border border-border/60 bg-background/70 p-3 shadow-sm backdrop-blur-sm dark:border-border/50 dark:bg-background/60 sm:w-[340px]"
        >
            <div className="sticky top-0 z-20 rounded-2xl border border-border/60 bg-background/92 p-3 shadow-sm backdrop-blur dark:border-border/50 dark:bg-background/85">
                <div className="flex items-center justify-between gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="flex min-w-0 flex-1 cursor-grab items-center gap-3 rounded-xl p-1 text-left"
                    >
                        <div className="rounded-lg bg-muted p-1.5 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="text-sm font-semibold leading-relaxed tracking-tight text-foreground sm:text-base">
                                {status.value}
                            </span>
                            <p className="text-xs text-muted-foreground">{cards.length} issues</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-muted"
                        onClick={() => setShowQuickCreate((value) => !value)}
                    >
                        <PiPlus className="h-4 w-4 text-foreground transition-colors duration-200 hover:text-red-500" />
                    </Button>
                </div>

                {showQuickCreate && (
                    <form
                        onSubmit={submitQuickCreate}
                        className="mt-3 space-y-3 rounded-2xl border border-border/60 bg-background/85 p-3 dark:border-border/50 dark:bg-background/70"
                    >
                        <TextInput
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Add an issue title"
                            isFocused
                        />
                        <InputError message={errors.title} />
                        <TextInput
                            type="text"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Description (optional)"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="hover:bg-muted"
                                onClick={() => {
                                    reset('title', 'description', 'deadline');
                                    setShowQuickCreate(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="red" disabled={processing || !data.title.trim()}>
                                Add issue
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-20rem)] rounded-2xl">
                <div className="flex min-h-full flex-col gap-3 p-1 pr-3">
                    <SortableContext items={cardsIds}>
                        {cards.map((card) => (
                            <CardList
                                key={card.id}
                                card={card}
                                workspace={workspace}
                                handleDeleteCard={handleDeleteCard}
                                onCardClick={() => onCardClick(card)}
                            />
                        ))}
                    </SortableContext>
                </div>
            </ScrollArea>
        </div>
    );
}
