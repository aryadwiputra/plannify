import HeaderForm from '@/Components/HeaderForm';
import AppLayout from '@/Layouts/AppLayout';
import AttachmentCard from './AttachmentCard';
import MemberCard from './MemberCard';
import TaskCard from './TaskCard';
import UpdateCard from './UpdateCard';

export default function Edit({ card, page_settings, statuses, priorities, workspace }) {
    return (
        <>
            <div className="space-y-10 divide-y divide-dashed divide-gray-900/10">
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
                    <HeaderForm title={page_settings.title} subtitle={page_settings.subtitle} />

                    <UpdateCard card={card} page_settings={page_settings} statuses={statuses} priorities={priorities} />
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-8 pt-10 md:grid-cols-3">
                    <HeaderForm title="Members" subtitle="Please add members to the card" />

                    <MemberCard action={route('member_card.store', { card: card })} members={card.members} />
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-8 pt-10 md:grid-cols-3">
                    <HeaderForm title="Attachment" subtitle="Please add attachments to the card" />

                    <AttachmentCard
                        action={route('attachments.store', { card: card })}
                        attachments={card.attachments}
                    />
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-8 pt-10 md:grid-cols-3">
                    <HeaderForm title="Tasks" subtitle="Please add tasks to the card" />

                    <TaskCard action={route('tasks.store', { card: card })} tasks={card.tasks} />
                </div>
            </div>
        </>
    );
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
