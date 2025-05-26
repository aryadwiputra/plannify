import { GetPriorityBadge } from '@/Components/GetPriorityBadge';
import { GetStatusBadge } from '@/Components/GetStatusBadge';
import Header from '@/Components/Header';
import { Card, CardContent } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ card, page_settings }) {
    return (
        <>
            <Header title={page_settings.title} subtitle={page_settings.subtitle} />

            <Card>
                <CardContent className="mt-4">
                    <div className="border-t border-gray-100">
                        <div className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="text-sm font-medium leading-6 text-foreground">Title</div>
                                <div className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                    {card.title}
                                </div>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="text-sm font-medium leading-6 text-foreground">Description</div>
                                <div className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                    {card.description}
                                </div>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="text-sm font-medium leading-6 text-foreground">Deadline</div>
                                <div className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                    {card.deadline.format}
                                </div>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="text-sm font-medium leading-6 text-foreground">Status</div>
                                <div className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                    <GetStatusBadge status={card.status} />
                                </div>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <div className="text-sm font-medium leading-6 text-foreground">Priority</div>
                                <div className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                                    <GetPriorityBadge priority={card.priority} />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

Show.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
