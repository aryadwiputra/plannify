import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { flashMessage } from '@/lib/utils';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { PiPlus, PiSquaresFour } from 'react-icons/pi';
import { toast } from 'sonner';
import TaskListChildrenCard from './TaskListChildrenCard';

export default function TaskListCard({ tasks }) {
    const { data, setData, processing, errors, reset, post, recentlySuccessful } = useForm({
        item: '',
    });

    const onHandleChane = (e) => {
        setData(e.target.name, e.target.value);
    };

    const onHandleSubmit = (e, task) => {
        e.preventDefault();

        router.post(
            route('tasks.item', {
                card: task.card_id,
                task: task.id,
            }),
            {
                item: data.item,
                _method: 'post',
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (success) => {
                    reset();

                    const flash = flashMessage(success);
                    if (flash) toast[flash.type](flash.message);
                },
            },
        );
    };

    const [showFormItem, setShowFormItem] = useState({});

    return (
        <div className="space-y-4 py-6">
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {tasks
                    .filter((task) => task.parent_id === null)
                    .map((task, index) => (
                        <li key={index}>
                            <div className="mb-4 flex flex-col space-y-4 py-4 pl-4 pr-5">
                                <div className="flex items-center justify-between text-sm leading-relaxed">
                                    <div className="flex w-0 items-center">
                                        <PiSquaresFour className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div className="ml-4 flex flex-1 gap-2">
                                            <span className="truncate font-medium">{task.title}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <Button
                                            variant="link"
                                            className="font-medium text-red-500 hover:text-red-600 hover:no-underline"
                                            onClick={() =>
                                                router.delete(
                                                    route('tasks.destroy', {
                                                        card: task.card_id,
                                                        task: task.id,
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
                                    </div>
                                </div>

                                {/* <Progress className="mb-4 h-2.5" value={task.percentage} /> */}

                                <TaskListChildrenCard children={task.children} />

                                {showFormItem[task.id] || task.children.length > 0 ? (
                                    <form onSubmit={(e) => onHandleSubmit(e, task)}>
                                        <TextInput
                                            className="mb-4"
                                            type="text"
                                            name="item"
                                            id="item"
                                            value={data.item}
                                            onChange={onHandleChane}
                                            onErrors={errors.item && <InputError message={errors.item} />}
                                            placeholder="Add item to task"
                                        />

                                        <div className="flex items-center gap-x-2">
                                            <Button type="submit" size="sm" disabled={processing}>
                                                <PiPlus className="mr-1 h-4 w-4" />
                                                Add
                                            </Button>

                                            <Button type="button" variant="outline" size="sm" onClick={() => reset()}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        className="flex w-32"
                                        onClick={() =>
                                            setShowFormItem((prevState) => ({
                                                ...prevState,
                                                [task.id]: true,
                                            }))
                                        }
                                    >
                                        Add an item
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
