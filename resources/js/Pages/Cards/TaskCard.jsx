import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { flashMessage } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import TaskListCard from './TaskListCard';

export default function TaskCard({ action, tasks }) {
    const { data, setData, processing, errors, reset, post, recentlySuccessful } = useForm({
        title: '',
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
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={data.title}
                                    onChange={onHandleChange}
                                    onErrors={errors.title && <InputError message={errors.title} />}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-2 border-t border-border/60 pt-4 dark:border-border/50">
                        <Button type="button" variant="ghost" className="hover:bg-muted" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button type="submit" variant="red" disabled={processing}>
                            Save
                        </Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">Saved.</p>
                        </Transition>
                    </div>
                </form>

                <TaskListCard tasks={tasks} />
            </CardContent>
        </Card>
    );
}
