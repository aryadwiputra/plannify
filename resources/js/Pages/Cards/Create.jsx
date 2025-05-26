import HeaderForm from '@/Components/HeaderForm';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function Create({ page_settings, statuses, priorities, workspace }) {
    const { data, setData, processing, errors, reset, post, recentlySuccessful } = useForm({
        title: '',
        description: '',
        deadline: '',
        status: 'To Do',
        priority: 'Unknown',
        _method: page_settings.method,
    });

    const onHandleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    return (
        <div className="space-y-10 divide-y divide-dashed divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
                <HeaderForm title="Information" subtitle="Add your card information" />

                <Card className="md:col-span-2">
                    <CardContent>
                        <form onSubmit={onHandleSubmit}>
                            <div className="py-6">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="col-span-full">
                                        <InputLabel htmlFor="title" value="Title" />
                                        <TextInput
                                            type="text"
                                            name="title"
                                            id="title"
                                            isFocused={true}
                                            value={data.title}
                                            onChange={onHandleChange}
                                            onErrors={errors.title && <InputError message={errors.title} />}
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <TextInput
                                            type="text"
                                            name="description"
                                            id="description"
                                            value={data.description}
                                            onChange={onHandleChange}
                                            onErrors={errors.description && <InputError message={errors.description} />}
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <InputLabel htmlFor="deadline" value="Deadline" />
                                        <TextInput
                                            type="date"
                                            name="deadline"
                                            id="deadline"
                                            value={data.deadline}
                                            onChange={onHandleChange}
                                            onErrors={errors.deadline && <InputError message={errors.deadline} />}
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <InputLabel htmlFor="priority" value="priority" />

                                        <Select
                                            defaultValue={data.priority}
                                            onValueChange={(value) => setData('priority', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {priorities.find((priority) => priority.value === data.priority)
                                                        ?.label ?? 'Select a Priority'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {priorities.map((priority, index) => (
                                                    <SelectItem key={index} value={priority.value}>
                                                        {priority.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.priority && <InputError message={errors.priority} />}
                                    </div>

                                    <div className="col-span-full">
                                        <InputLabel htmlFor="status" value="Status" />

                                        <Select
                                            defaultValue={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {statuses.find((status) => status.value === data.status)?.label ??
                                                        'Select a Status'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status, index) => (
                                                    <SelectItem key={index} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.status && <InputError message={errors.status} />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-x-2 py-6">
                                <Button type="button" variant="ghost" onClick={() => reset()}>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Create.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
