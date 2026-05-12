import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { flashMessage } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { CalendarDays, Check, FileText, History, Layers3, ListChecks, LoaderCircle, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import AttachmentCard from '@/Pages/Cards/AttachmentCard';
import MemberCard from '@/Pages/Cards/MemberCard';
import TaskCard from '@/Pages/Cards/TaskCard';
import CardComments from '@/Pages/Workspaces/Partials/CardComments';

function MetaItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/80 p-3 shadow-sm dark:border-border/50 dark:bg-background/60">
            <div className="rounded-lg bg-muted p-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value || '-'}</p>
            </div>
        </div>
    );
}

function HistoryPanel({ card }) {
    const events = useMemo(() => {
        const items = [
            {
                id: `card-created-${card.id}`,
                title: 'Card created',
                actor: 'System',
                time: card.created_at,
            },
        ];

        if (card.updated_at && card.updated_at !== card.created_at) {
            items.push({
                id: `card-updated-${card.id}`,
                title: 'Card updated',
                actor: 'System',
                time: card.updated_at,
            });
        }

        (card.members ?? []).forEach((member) => {
            items.push({
                id: `member-${member.id}`,
                title: `Member assigned: ${member.user?.name ?? 'Unknown'}`,
                actor: member.user?.name ?? 'Unknown',
                time: member.created_at,
            });
        });

        (card.tasks ?? []).forEach((task) => {
            items.push({
                id: `task-${task.id}`,
                title: `Checklist item added: ${task.title}`,
                actor: task.user?.name ?? 'Unknown',
                time: task.created_at,
            });
        });

        (card.attachments ?? []).forEach((attachment) => {
            items.push({
                id: `attachment-${attachment.id}`,
                title: `Attachment added: ${attachment.name || attachment.file || 'File'}`,
                actor: attachment.user?.name ?? 'Unknown',
                time: attachment.created_at,
            });
        });

        return items
            .filter((item) => item.time)
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }, [card]);

    return (
        <Card className="rounded-2xl border border-border/60 bg-background/90 shadow-sm dark:border-border/50 dark:bg-background/70">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <History className="h-4 w-4" /> Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.length ? (
                        events.map((event) => (
                            <div key={event.id} className="flex gap-3">
                                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                                <div className="min-w-0 flex-1 border-b border-border/60 pb-3 last:border-b-0 dark:border-border/50">
                                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">{event.actor} • {event.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No activity yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function CardDetailSheet({ card, open, onOpenChange, workspace, statuses, priorities }) {
    const { data, setData, put, processing, errors } = useForm({
        title: '',
        description: '',
        deadline: '',
        status: '',
        priority: '',
    });
    const [saveState, setSaveState] = useState('idle');
    const debounceRef = useRef(null);
    const initializedRef = useRef(false);
    const lastLoadedCardIdRef = useRef(null);
    const baselineRef = useRef({
        title: '',
        description: '',
        deadline: '',
        status: '',
        priority: 'Unknown',
    });
    const latestDataRef = useRef({
        title: '',
        description: '',
        deadline: '',
        status: '',
        priority: 'Unknown',
    });
    const isSavingRef = useRef(false);
    const pendingPayloadRef = useRef(null);
    const idleTimerRef = useRef(null);

    const initialData = useMemo(
        () => ({
            title: card?.title ?? '',
            description: card?.description ?? '',
            deadline: card?.deadline_date?.unformatted ?? card?.deadline?.unformatted ?? '',
            status: card?.status ?? '',
            priority: card?.priority ?? 'Unknown',
        }),
        [card?.id, card?.title, card?.description, card?.deadline_date?.unformatted, card?.deadline?.unformatted, card?.status, card?.priority],
    );

    const finishSaveState = () => {
        clearTimeout(idleTimerRef.current);
        setSaveState('saved');
        idleTimerRef.current = setTimeout(() => setSaveState('idle'), 900);
    };

    const queuePayloadSave = (payload) => {
        pendingPayloadRef.current = { ...payload };
    };

    const hasPendingChanges = (payload) => {
        const baseline = baselineRef.current;

        return (
            payload.title !== baseline.title ||
            payload.description !== baseline.description ||
            payload.deadline !== baseline.deadline ||
            payload.status !== baseline.status ||
            payload.priority !== baseline.priority
        );
    };

    const savePayload = (payload) => {
        if (!card) return;

        const nextPayload = { ...payload };

        if (!hasPendingChanges(nextPayload)) {
            pendingPayloadRef.current = null;
            setSaveState('idle');
            return;
        }

        clearTimeout(debounceRef.current);

        if (isSavingRef.current) {
            queuePayloadSave(nextPayload);
            setSaveState('dirty');
            return;
        }

        isSavingRef.current = true;
        pendingPayloadRef.current = null;
        setSaveState('saving');

        put(route('cards.update', { workspace: workspace.slug ?? workspace, card: card.id }), {
            preserveScroll: true,
            preserveState: true,
            data: nextPayload,
            onSuccess: (success) => {
                baselineRef.current = { ...nextPayload };
                latestDataRef.current = { ...nextPayload };
                isSavingRef.current = false;
                finishSaveState();
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);

                if (pendingPayloadRef.current && hasPendingChanges(pendingPayloadRef.current)) {
                    const queuedPayload = { ...pendingPayloadRef.current };
                    pendingPayloadRef.current = null;
                    savePayload(queuedPayload);
                }
            },
            onError: (formErrors) => {
                isSavingRef.current = false;
                setSaveState('error');
                const firstError = Object.values(formErrors ?? {}).flat().find(Boolean);
                toast.error(firstError || 'Autosave failed. Please review your changes and try again.');
            },
        });
    };

    const scheduleTextSave = () => {
        if (!card) return;

        const payload = { ...latestDataRef.current };
        const baseline = baselineRef.current;
        const textChanged = payload.title !== baseline.title || payload.description !== baseline.description;

        if (!textChanged) return;

        clearTimeout(debounceRef.current);
        setSaveState('dirty');
        debounceRef.current = setTimeout(() => {
            savePayload(payload);
        }, 900);
    };

    const flushTextSave = () => {
        if (!card) return;

        const payload = { ...latestDataRef.current };
        const baseline = baselineRef.current;
        const textChanged = payload.title !== baseline.title || payload.description !== baseline.description;

        if (!textChanged) return;

        savePayload(payload);
    };

    const updateField = (field, value, options = {}) => {
        const { immediate = false, schedule = false } = options;
        const nextPayload = { ...latestDataRef.current, [field]: value };

        latestDataRef.current = nextPayload;
        setData(field, value);

        if (!initializedRef.current) return;

        if (immediate) {
            setSaveState('dirty');
            savePayload(nextPayload);
            return;
        }

        if (schedule) {
            scheduleTextSave();
        }
    };

    useEffect(() => {
        if (!card) return;

        if (lastLoadedCardIdRef.current !== card.id) {
            lastLoadedCardIdRef.current = card.id;
            initializedRef.current = false;
            baselineRef.current = initialData;
            latestDataRef.current = initialData;
            pendingPayloadRef.current = null;
            clearTimeout(idleTimerRef.current);
            setData(initialData);
            setSaveState('idle');
            return;
        }

        if (saveState === 'saved') {
            baselineRef.current = initialData;
            latestDataRef.current = initialData;
        }
    }, [card?.id, initialData, saveState, setData, card]);

    useEffect(() => {
        if (!card) return;
        if (!initializedRef.current) {
            initializedRef.current = true;
        }

        return () => {
            clearTimeout(debounceRef.current);
            clearTimeout(idleTimerRef.current);
        };
    }, [card?.id]);

    if (!card) return null;

    const saveIndicator =
        saveState === 'saving' ? (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving…
            </span>
        ) : saveState === 'saved' ? (
            <span className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" /> Saved
            </span>
        ) : saveState === 'dirty' ? (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Unsaved changes</span>
        ) : saveState === 'error' ? (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Autosave failed</span>
        ) : (
            <span className="text-xs text-muted-foreground">Changes autosave</span>
        );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[100vw] sm:max-w-[1100px] sm:w-full p-0">
                <ScrollArea className="h-screen w-full">
                    <div className="p-6 pt-16 sm:pt-6 sm:pr-20">
                        <SheetHeader className="mb-6 border-b border-border/60 pb-4 dark:border-border/50">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <SheetTitle className="text-2xl tracking-tight">{data.title || card.title}</SheetTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Keep planning in context without leaving the board.
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-2 sm:items-end">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-foreground dark:border-border/50 dark:bg-background/60">
                                            {data.status || card.status}
                                        </span>
                                        <span className="rounded-full border border-red-200/70 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                                            {data.priority || card.priority}
                                        </span>
                                    </div>
                                    {saveIndicator}
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-6">
                                <Card className="rounded-2xl border border-border/60 bg-background/90 shadow-sm dark:border-border/50 dark:bg-background/70">
                                    <CardHeader>
                                        <CardTitle className="text-base">Issue Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-5">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="md:col-span-2">
                                                    <InputLabel htmlFor="title" value="Title" />
                                                    <TextInput id="title" value={data.title} onChange={(e) => updateField('title', e.target.value, { schedule: true })} onBlur={flushTextSave} />
                                                    <InputError message={errors.title} />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <InputLabel htmlFor="description" value="Description" />
                                                    <textarea
                                                        id="description"
                                                        value={data.description}
                                                        onChange={(e) => updateField('description', e.target.value, { schedule: true })}
                                                        className="mt-1 flex min-h-32 w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 dark:border-border/60 dark:bg-background/70"
                                                        placeholder="Describe the scope, context, or expected outcome"
                                                    onBlur={flushTextSave}
                                                    />
                                                    <InputError message={errors.description} />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="status" value="Status" />
                                                    <Select value={data.status} onValueChange={(value) => updateField('status', value, { immediate: true })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {statuses.map((status) => (
                                                                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="priority" value="Priority" />
                                                    <Select value={data.priority} onValueChange={(value) => updateField('priority', value, { immediate: true })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {priorities.map((priority) => (
                                                                <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="deadline" value="Deadline" />
                                                    <TextInput type="date" id="deadline" value={data.deadline} onChange={(e) => updateField('deadline', e.target.value, { immediate: true })} />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid gap-6">
                                    <MemberCard action={route('member_card.store', { card: card.id })} members={card.members ?? []} />
                                    <TaskCard action={route('tasks.store', { card: card.id })} tasks={card.tasks ?? []} />
                                    <AttachmentCard action={route('attachments.store', { card: card.id })} attachments={card.attachments ?? []} />
                                    <CardComments card={card} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card className="rounded-2xl border border-border/60 bg-background/90 shadow-sm dark:border-border/50 dark:bg-background/70">
                                    <CardHeader>
                                        <CardTitle className="text-base">Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <MetaItem icon={Layers3} label="Workspace" value={workspace.name} />
                                        <MetaItem icon={CalendarDays} label="Created" value={card.created_at} />
                                        <MetaItem icon={CalendarDays} label="Due date" value={card.deadline_date?.format ?? card.deadline?.format ?? 'No deadline'} />
                                        <MetaItem icon={Users} label="Members" value={`${card.members_count ?? card.members?.length ?? 0} assigned`} />
                                        <MetaItem icon={ListChecks} label="Checklist" value={card.has_task ? `${card.tasks_count ?? card.tasks?.length ?? 0} task items` : 'No checklist yet'} />
                                        <MetaItem icon={FileText} label="Attachments" value={card.has_attachment ? `${card.attachments_count ?? card.attachments?.length ?? 0} files` : 'No files yet'} />
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-border/60 bg-background/90 shadow-sm dark:border-border/50 dark:bg-background/70">
                                    <CardHeader>
                                        <CardTitle className="text-base">Assigned Members</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {card.members?.length ? (
                                            card.members.map((member) => (
                                                <div key={member.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-3 dark:border-border/50 dark:bg-background/50">
                                                    <Avatar>
                                                        <AvatarImage src={member.user?.avatar} />
                                                        <AvatarFallback>{member.user?.name?.substring(0, 1) ?? '?'}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{member.user?.name}</p>
                                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No members assigned yet.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <HistoryPanel card={card} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
