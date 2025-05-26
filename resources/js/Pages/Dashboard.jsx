import Header from '@/Components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Widget from '@/Components/Widget';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PiBriefcase, PiNewspaperClipping, PiSquaresFour } from 'react-icons/pi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ page_settings, count, productivity_chart, tasks }) {
    const auth = usePage().props.auth.user;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Productivity Chart',
            },
        },
    };

    const data = {
        labels: productivity_chart.label,
        datasets: productivity_chart.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
        })),
    };

    return (
        <>
            <div>
                <div className="xl:pr-96">
                    <div>
                        <Header title={page_settings.title} subtitle={page_settings.subtitle} />
                        <div>
                            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <Widget
                                    icon={<PiBriefcase className="h-6 w-6 text-white" />}
                                    title="Workspace"
                                    count={count.workspaces}
                                    bgColor="bg-gradient-to-b from-green-400 to-green-600"
                                />

                                <Widget
                                    icon={<PiSquaresFour className="h-6 w-6 text-white" />}
                                    title="My Tasks"
                                    count={count.tasks}
                                    bgColor="bg-gradient-to-b from-fuchsia-400 to-fuchsia-600"
                                />

                                <Widget
                                    icon={<PiSquaresFour className="h-6 w-6 text-white" />}
                                    title="Tasks Done"
                                    count={count.dones}
                                    bgColor="bg-gradient-to-b from-sky-400 to-sky-600"
                                />
                            </dl>
                        </div>

                        <div className="mt-8 rounded-lg border bg-white px-4 pb-6 pt-5 dark:bg-gray-800 sm:px-6 sm:pt-6">
                            <Bar options={options} data={data} />
                        </div>
                    </div>
                </div>
            </div>

            <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 dark:border-gray-800 lg:px-8 xl:block">
                {/* card */}
                <Card className="mb-4">
                    <CardContent className="mt-4">
                        <div className="flex flex-col items-center">
                            <Avatar className="mb-2 h-14 w-14">
                                <AvatarImage src={auth.avatar} />
                                <AvatarFallback>{auth.name.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span className="line-clamp-1 text-lg font-semibold leading-relaxed tracking-tighter text-foreground">
                                {auth.name}
                            </span>
                            <span className="-mt-1 text-sm font-light text-muted-foreground">{auth.email}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg leading-relaxed">Your To Do list</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tasks.map((task, index) => (
                            <Link key={index} href={task.memberable.detail} className="hover:text-red-500">
                                <div className="mb-4 flex items-center gap-x-2">
                                    <div className="rounded-full bg-red-500 p-3">
                                        <PiNewspaperClipping className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="line-clamp-1 text-base font-medium leading-relaxed">
                                            {task.memberable.title}
                                        </span>
                                        <span className="text-xs font-light text-muted-foreground">
                                            {task.memberable.created_at}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </aside>
        </>
    );
}

Dashboard.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
