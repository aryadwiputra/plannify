import { ActionDialog } from '@/Components/ActionDialog';
import { GetPriorityBadge } from '@/Components/GetPriorityBadge';
import { GetStatusBadge } from '@/Components/GetStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { CalendarClock, GripVertical, PanelRightOpen, SquarePen } from 'lucide-react';
import { PiCheckSquare, PiDotsThreeOutlineFill, PiLinkSimple, PiUser } from 'react-icons/pi';

function DueBadge({ card }) {
    if (!card.deadline_date?.format) return null;

    const tone = card.deadline > 0
        ? 'border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-300'
        : card.deadline === 0
          ? 'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300'
          : 'border-red-200/80 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300';

    const label = card.deadline > 0 ? `${card.deadline} days left` : card.deadline === 0 ? 'Due today' : 'Overdue';

    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{label}</span>
        </div>
    );
}

function AssigneeStack({ members = [] }) {
    const visible = members.slice(0, 3);
    const overflow = members.length - visible.length;

    if (!members.length) {
        return <span className="text-xs text-muted-foreground">No assignee</span>;
    }

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2">
                {visible.map((member) => (
                    <Avatar
                        key={member.id}
                        className="h-7 w-7 border-2 border-background shadow-sm dark:border-background"
                        title={member.user?.name}
                    >
                        <AvatarImage src={member.user?.avatar} alt={member.user?.name} />
                        <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground dark:bg-muted">
                            {member.user?.name?.substring(0, 1) ?? '?'}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {overflow > 0 ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground shadow-sm dark:border-background">
                        +{overflow}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default function CardList({ card, workspace, handleDeleteCard, onCardClick }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <Card
                ref={setNodeRef}
                style={style}
                className="relative flex h-[132px] min-h-[132px] items-center rounded-2xl border border-dashed border-border/70 bg-background/70 p-3 text-left opacity-30 dark:border-border/50 dark:bg-background/50"
            />
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="group task relative rounded-2xl border border-border/60 bg-background/95 shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md dark:border-border/50 dark:bg-background/85"
        >
            <CardHeader className="space-y-3 p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                        <button
                            type="button"
                            {...attributes}
                            {...listeners}
                            className="mt-0.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`Drag ${card.title}`}
                        >
                            <GripVertical className="h-4 w-4" />
                        </button>
                        <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <GetStatusBadge status={card.status} />
                                <GetPriorityBadge priority={card.priority} />
                                <DueBadge card={card} />
                            </div>
                            <CardTitle className="line-clamp-2 text-[15px] leading-6 tracking-tight">
                                <button
                                    type="button"
                                    onClick={() => onCardClick(card)}
                                    className="text-left transition-colors hover:text-red-500"
                                >
                                    {card.title}
                                </button>
                            </CardTitle>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => onCardClick(card)}
                        >
                            <PanelRightOpen className="h-4 w-4" />
                        </Button>

                        {card.can.edit_card && (
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                                <Link href={route('cards.edit', [workspace, card])}>
                                    <SquarePen className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}

                        {card.can.edit_card && card.can.delete_card && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                    <PiDotsThreeOutlineFill className="size-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onSelect={() => onCardClick(card)}>
                                        Open details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={route('cards.edit', [workspace, card])}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuGroup>
                                        <ActionDialog
                                            trigger={
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    Delete
                                                </DropdownMenuItem>
                                            }
                                            title="Delete Card"
                                            description="Are you sure want to delete this card?"
                                            action={() => handleDeleteCard(card.id)}
                                        />
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {card.description ? (
                    <CardDescription className="line-clamp-3 text-sm leading-6 tracking-tight text-muted-foreground">
                        {card.description}
                    </CardDescription>
                ) : (
                    <p className="text-sm italic text-muted-foreground">No description yet.</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4 p-4 pt-0">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 dark:border-border/50 dark:bg-background/40">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PiUser className="h-4 w-4" />
                        <span>Assignees</span>
                    </div>
                    <AssigneeStack members={card.members ?? []} />
                </div>

                {card.has_task && (
                    <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 dark:border-border/50 dark:bg-background/40">
                        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                            <p>
                                <span className="font-semibold text-red-500">{card.percentage}</span> of 100 complete
                            </p>
                            <p>{card.tasks_count} checklist items</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {card.has_task && (
                        <div className="flex items-center gap-x-1.5">
                            <PiCheckSquare className="h-4 w-4" />
                            <span>{card.tasks_count} Tasks</span>
                        </div>
                    )}

                    {card.members_count > 1 && (
                        <div className="flex items-center gap-x-1.5">
                            <PiUser className="h-4 w-4" />
                            <span>{card.members_count} Members</span>
                        </div>
                    )}

                    {card.has_attachment && (
                        <div className="flex items-center gap-x-1.5">
                            <PiLinkSimple className="h-4 w-4" />
                            <span>{card.attachments_count} Files</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
