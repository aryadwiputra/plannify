import { CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Link, router } from '@inertiajs/react';
import { LayoutGrid, Search, Settings2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import TextInput from '@/Components/TextInput';
import CardList from './Partials/CardList';
import { CardDetailSheet } from './Partials/CardDetailSheet';
import StatusList from './Partials/StatusList';

export default function Show(props) {
    const workspace = props.workspace;
    const [statuses, setStatuses] = useState(props.statuses);
    const statusesId = useMemo(() => statuses.map((status) => status.value), [statuses]);
    const [cards, setCards] = useState(props.cards);
    const [activeStatus, setActiveStatus] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [selectedCardDetail, setSelectedCardDetail] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [assigneeFilter, setAssigneeFilter] = useState('All');

    useEffect(() => {
        setCards(props.cards);
    }, [props.cards]);

    useEffect(() => {
        if (!selectedCardDetail) return;
        const updatedCard = props.cards.find((card) => card.id === selectedCardDetail.id);
        if (updatedCard) {
            setSelectedCardDetail(updatedCard);
        }
    }, [props.cards, selectedCardDetail?.id]);

    const handleDeleteCard = (id) => {
        router.delete(route('cards.destroy', { workspace: workspace, card: id }), {
            preserveScroll: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
                if (selectedCardDetail?.id === id) {
                    setIsSheetOpen(false);
                    setSelectedCardDetail(null);
                }
            },
        });
    };

    const handleDataCard = (current) => ({
        type: current.type,
        data: current.type === 'Card' ? current.card.id : current.status.value,
    });

    const handleReorderCard = (active, over) => {
        router.post(
            route('cards.reorder', { workspace: workspace, card: active.data.current.card.id }),
            {
                cardActive: handleDataCard(active.data.current),
                cardOver: handleDataCard(over.data.current),
            },
            {
                preserveScroll: true,
                onSuccess: (success) => {
                    const flash = flashMessage(success);
                    if (flash) toast[flash.type](flash.message);
                },
            },
        );
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

    const onDragStart = (event) => {
        if (event.active.data.current?.type === 'Card') {
            setActiveCard(event.active.data.current.card);
        }
    };

    const onDragEnd = (event) => {
        setActiveStatus(null);
        setActiveCard(null);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const isActiveAStatus = active.data.current?.type === 'Status';
        if (!isActiveAStatus) return;

        setStatuses((currentStatuses) => {
            const activeStatusIndex = currentStatuses.findIndex((status) => status.value === active.id);
            const overStatusIndex = currentStatuses.findIndex((status) => status.value === over.id);
            return arrayMove(currentStatuses, activeStatusIndex, overStatusIndex);
        });
    };

    const onDragOver = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const isActiveACard = active.data.current?.type === 'Card';
        const isOverACard = over.data.current?.type === 'Card';
        if (!isActiveACard) return;

        if (isActiveACard && isOverACard) {
            setCards((currentCards) => {
                const activeIndex = currentCards.findIndex((card) => card.id == active.id);
                const overIndex = currentCards.findIndex((card) => card.id == over.id);

                if (currentCards[activeIndex].status != currentCards[overIndex].status) {
                    currentCards[activeIndex].status = currentCards[overIndex].status;
                    return arrayMove([...currentCards], activeIndex, overIndex - 1);
                }

                return arrayMove([...currentCards], activeIndex, overIndex);
            });
        }

        const isOverAStatus = over.data.current?.type === 'Status';
        if (isActiveACard && isOverAStatus) {
            setCards((currentCards) => {
                const activeIndex = currentCards.findIndex((card) => card.id === active.id);
                currentCards[activeIndex].status = over.id;
                return [...currentCards];
            });
        }

        handleReorderCard(active, over);
    };

    const priorityOptions = useMemo(() => ['All', ...new Set(cards.map((card) => card.priority).filter(Boolean))], [cards]);
    const assigneeOptions = useMemo(
        () => [
            'All',
            ...new Set(
                cards.flatMap((card) => (card.members ?? []).map((member) => member.user?.name).filter(Boolean)),
            ),
        ],
        [cards],
    );

    const filteredCards = useMemo(() => {
        const query = search.trim().toLowerCase();

        return cards.filter((card) => {
            const matchesSearch =
                !query ||
                card.title?.toLowerCase().includes(query) ||
                card.description?.toLowerCase().includes(query) ||
                card.status?.toLowerCase().includes(query);
            const matchesPriority = priorityFilter === 'All' || card.priority === priorityFilter;
            const matchesAssignee =
                assigneeFilter === 'All' ||
                (card.members ?? []).some((member) => member.user?.name === assigneeFilter);

            return matchesSearch && matchesPriority && matchesAssignee;
        });
    }, [cards, search, priorityFilter, assigneeFilter]);

    const hasActiveFilters = search || priorityFilter !== 'All' || assigneeFilter !== 'All';

    return (
        <>
            <section className="relative overflow-hidden rounded-[28px] border border-border/60 bg-background/80 shadow-sm dark:border-border/50">
                <img src={workspace.cover} className="h-40 w-full object-cover lg:h-56" alt={workspace.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-end gap-4 sm:gap-5">
                            <img
                                className="h-20 w-20 rounded-3xl border border-white/50 bg-background/90 object-cover p-1 shadow-lg ring-4 ring-background/80 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                                src={workspace.logo}
                                alt={workspace.name}
                            />
                            <div className="min-w-0">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur dark:border-border/50 dark:bg-background/70">
                                    <LayoutGrid className="h-3.5 w-3.5" /> Workspace board
                                </div>
                                <CardTitle className="text-2xl leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                                    {workspace.name}
                                </CardTitle>
                                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                                    Plan, triage, and move work without leaving the board.
                                </p>
                            </div>
                        </div>

                        {workspace.can.edit_workspace && (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('workspaces.edit', [workspace])}
                                    className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/85 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted hover:no-underline dark:border-border/50 dark:bg-background/70"
                                >
                                    <Settings2 className="h-4 w-4" />
                                    Settings
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="mt-6 px-1 sm:px-0">
                <div className="mb-4 flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm dark:border-border/50 dark:bg-background/70 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Board Overview</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {filteredCards.length} issues shown across {statuses.length} columns
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[720px] lg:flex-row lg:items-center lg:justify-end">
                        <div className="relative w-full lg:max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <TextInput
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search issues"
                                className="pl-10"
                            />
                        </div>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="h-10 rounded-xl border border-border/70 bg-background/90 px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 dark:border-border/60 dark:bg-background/70"
                        >
                            {priorityOptions.map((option) => (
                                <option key={option} value={option}>
                                    Priority: {option}
                                </option>
                            ))}
                        </select>

                        <select
                            value={assigneeFilter}
                            onChange={(e) => setAssigneeFilter(e.target.value)}
                            className="h-10 rounded-xl border border-border/70 bg-background/90 px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 dark:border-border/60 dark:bg-background/70"
                        >
                            {assigneeOptions.map((option) => (
                                <option key={option} value={option}>
                                    Assignee: {option}
                                </option>
                            ))}
                        </select>

                        {hasActiveFilters ? (
                            <Button
                                type="button"
                                variant="ghost"
                                className="justify-center rounded-xl hover:bg-muted"
                                onClick={() => {
                                    setSearch('');
                                    setPriorityFilter('All');
                                    setAssigneeFilter('All');
                                }}
                            >
                                <X className="h-4 w-4" /> Clear
                            </Button>
                        ) : null}
                    </div>
                </div>

                <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                    <ScrollArea className="w-full whitespace-nowrap rounded-[24px] border border-border/60 bg-muted/20 shadow-sm backdrop-blur-sm dark:border-border/50 dark:bg-background/30">
                        <div className="flex min-w-max gap-5 p-4 lg:p-5">
                            <SortableContext items={statusesId}>
                                {statuses.map((status) => (
                                    <StatusList
                                        key={status.value}
                                        status={status}
                                        cards={filteredCards.filter((card) => card.status === status.value)}
                                        workspace={workspace}
                                        handleDeleteCard={handleDeleteCard}
                                        onCardClick={(card) => {
                                            setSelectedCardDetail(card);
                                            setIsSheetOpen(true);
                                        }}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </ScrollArea>

                    {createPortal(
                        <DragOverlay>
                            {activeStatus && (
                                <StatusList
                                    status={activeStatus}
                                    cards={filteredCards.filter((card) => card.status === activeStatus.value)}
                                    workspace={workspace}
                                    handleDeleteCard={handleDeleteCard}
                                    onCardClick={() => {}}
                                />
                            )}
                            {activeCard && <CardList card={activeCard} workspace={workspace} onCardClick={() => {}} />}
                        </DragOverlay>,
                        document.body,
                    )}
                </DndContext>

                <CardDetailSheet
                    card={selectedCardDetail}
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    workspace={workspace}
                    statuses={props.statuses}
                    priorities={props.priorities ?? [
                        { label: 'Unknown', value: 'Unknown' },
                        { label: 'Low', value: 'Low' },
                        { label: 'Medium', value: 'Medium' },
                        { label: 'High', value: 'High' },
                    ]}
                />
            </div>
        </>
    );
}

Show.layout = (page) => <AppLayout children={page} title={page.props.workspace.name} />;
