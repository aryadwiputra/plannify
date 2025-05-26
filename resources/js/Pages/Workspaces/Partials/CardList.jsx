import { ActionDialog } from '@/Components/ActionDialog';
import { GetPriorityBadge } from '@/Components/GetPriorityBadge';
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
import { PiCheckSquare, PiDotsThreeOutlineFill, PiLinkSimple, PiUser } from 'react-icons/pi';

export default function CardList({ card, workspace, handleDeleteCard }) {
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
                className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border border-dashed border-muted-foreground p-2.5 text-left opacity-30"
            ></Card>
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task relative cursor-grab rounded-xl hover:ring-2 hover:ring-inset hover:ring-red-500"
        >
            <CardHeader>
                <div className="flex items-center justify-between gap-x-4">
                    <CardTitle className="line-clamp-2 text-base leading-relaxed tracking-tighter">
                        <Link href={route('cards.show', [workspace, card])} className="hover:text-red-500">
                            {card.title}
                        </Link>
                    </CardTitle>

                    {card.can.edit_card && card.can.delete_card && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <PiDotsThreeOutlineFill className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
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
                <div>
                    <GetPriorityBadge priority={card.priority} />
                </div>
                <div>
                    <CardDescription className="line-clamp-4 leading-relaxed tracking-tighter">
                        {card.description}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-8">
                    {card.has_task && (
                        <div>
                            <div className="-mb-1.5 flex items-center justify-between">
                                <p className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    <span className="font-medium text-red-500">{card.percentage}</span> of 100
                                </p>
                                <p className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    {card.deadline > 0 ? (
                                        <span>{card.deadline} days left</span>
                                    ) : card.deadline == 0 ? (
                                        <span className="text-yellow-500">Today is deadline</span>
                                    ) : (
                                        <span className="text-red-500">Overdue</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-x-4">
                        {card.has_task && (
                            <div className="flex items-center gap-x-1">
                                <PiCheckSquare className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    {card.tasks_count} Tasks
                                </span>
                            </div>
                        )}

                        {card.members_count > 1 && (
                            <div className="flex items-center gap-x-1">
                                <PiUser className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    {card.members_count} Members
                                </span>
                            </div>
                        )}

                        {card.has_attachment && (
                            <div className="flex items-center gap-x-1">
                                <PiLinkSimple className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    {card.attachments_count} Files
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
