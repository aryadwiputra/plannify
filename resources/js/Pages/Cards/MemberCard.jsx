import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { flashMessage } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function MemberCard({ action, members }) {
    const { data, setData, processing, errors, reset, post, recentlySuccessful } = useForm({
        email: '',
    });

    const onHandleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    return (
        <Card className="md:col-span-2 rounded-2xl border border-border/60 bg-background/90 shadow-sm dark:border-border/50 dark:bg-background/70">
            <CardContent className="space-y-6">
                <form onSubmit={onHandleSubmit}>
                    <div className="rounded-xl border border-border/60 bg-background/70 p-4 dark:border-border/50 dark:bg-background/50">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    onErrors={errors.email && <InputError message={errors.email} />}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-2 border-t border-border/60 pt-4 dark:border-border/50">
                        <Button type="button" variant="ghost" className="hover:bg-muted" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button type="submit" variant="red" disabled={processing}>
                            Invite
                        </Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">Invited.</p>
                        </Transition>
                    </div>
                </form>

                <div className="space-y-4">
                    <ul role="list" className="divide-y divide-border/60 rounded-xl border border-border/60 bg-background/70 dark:divide-border/50 dark:border-border/50 dark:bg-background/50">
                        {members.map((member, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                            >
                                <div className="flex w-0 flex-1 items-center">
                                    <Avatar>
                                        <AvatarImage src={member.user.avatar} />
                                        <AvatarFallback>{member.user.name.substring(0, 1)}</AvatarFallback>
                                    </Avatar>

                                    <div className="ml-4 flex min-w-0 flex-col">
                                        <span className="truncate font-medium">{member.user.name}</span>
                                        <span className="hidden text-muted-foreground sm:block">
                                            {member.user.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4 flex shrink-0">
                                    {member.role !== 'Owner' ? (
                                        <Button
                                            variant="link"
                                            className="font-medium text-destructive hover:text-destructive hover:no-underline"
                                            onClick={() =>
                                                router.delete(
                                                    route('member_card.destroy', {
                                                        card: member.memberable_id,
                                                        member: member.id,
                                                    }),
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
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
                                    ) : (
                                        <Button variant="ghost">{member.role}</Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
