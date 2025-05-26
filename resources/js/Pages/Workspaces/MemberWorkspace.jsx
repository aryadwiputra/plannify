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

export default function MemberWorkspace({ action, members }) {
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
        <Card className="md:col-span-2">
            <CardContent>
                <form onSubmit={onHandleSubmit}>
                    <div className="py-6">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    onErrors={errors.email && <InputError message={errors.email} />}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-2 py-6">
                        <Button type="button" variant="ghost" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button variant="red" type="submit" disabled={processing}>
                            Invite
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveFrom="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">Invited.</p>
                        </Transition>
                    </div>
                </form>

                <div className="space-y-4 py-6">
                    <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                        {members.map((member, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-relaxed"
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
                                <div className="ml-4 flex-shrink-0">
                                    {member.role !== 'Owner' ? (
                                        <Button
                                            variant="link"
                                            className="font-medium text-red-500 hover:text-red-600 hover:no-underline"
                                            onClick={() =>
                                                router.delete(
                                                    route('workspaces.member.destroy', {
                                                        workspace: member.memberable_id,
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
