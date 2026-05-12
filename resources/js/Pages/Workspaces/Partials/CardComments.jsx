import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { flashMessage } from '@/lib/utils';
import { router, useForm } from '@inertiajs/react';
import { MessageSquareMore, Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function CommentItem({ card, comment }) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({ body: comment.body ?? '' });

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('comments.update', { card: card.id, comment: comment.id }), {
            preserveScroll: true,
            onSuccess: (success) => {
                setIsEditing(false);
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    return (
        <div className="rounded-xl border border-border/60 bg-background/75 p-3 shadow-sm dark:border-border/50 dark:bg-background/50">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage src={comment.user?.avatar} />
                        <AvatarFallback>{comment.user?.name?.substring(0, 1) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-foreground">{comment.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.created_at}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-transparent bg-background/40 p-1 dark:bg-background/20">
                    {comment.can?.update_comment && (
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setIsEditing((value) => !value)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {comment.can?.delete_comment && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:bg-muted hover:text-destructive"
                            onClick={() =>
                                router.delete(route('comments.destroy', { card: card.id, comment: comment.id }), {
                                    preserveScroll: true,
                                    onSuccess: (success) => {
                                        const flash = flashMessage(success);
                                        if (flash) toast[flash.type](flash.message);
                                    },
                                })
                            }
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={submitEdit} className="mt-3 space-y-3">
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        className="flex min-h-24 w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 dark:border-border/60 dark:bg-background/70"
                    />
                    <InputError message={errors.body} />
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => { setData('body', comment.body ?? ''); setIsEditing(false); }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="red" disabled={processing || !data.body.trim()}>
                            Save
                        </Button>
                    </div>
                </form>
            ) : (
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
            )}
        </div>
    );
}

export default function CardComments({ card }) {
    const { data, setData, post, processing, errors, reset } = useForm({ body: '' });

    const submitComment = (e) => {
        e.preventDefault();
        post(route('comments.store', { card: card.id }), {
            preserveScroll: true,
            onSuccess: (success) => {
                reset();
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    return (
        <Card className="rounded-2xl border border-border/60 bg-background/90 shadow-sm dark:border-border/50 dark:bg-background/70">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquareMore className="h-4 w-4" /> Comments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={submitComment} className="space-y-3">
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        className="flex min-h-24 w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 dark:border-border/60 dark:bg-background/70"
                        placeholder="Add a comment for collaborators"
                    />
                    <InputError message={errors.body} />
                    <div className="flex justify-end">
                        <Button type="submit" variant="red" disabled={processing || !data.body.trim()}>
                            Comment
                        </Button>
                    </div>
                </form>

                <div className="space-y-3">
                    {(card.comments ?? []).length ? (
                        card.comments.map((comment) => <CommentItem key={comment.id} card={card} comment={comment} />)
                    ) : (
                        <p className="text-sm text-muted-foreground">No comments yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
