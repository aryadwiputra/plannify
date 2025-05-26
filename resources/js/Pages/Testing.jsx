import AppLayout from '@/Layouts/AppLayout';

export default function Testing() {
    return <div>Testing</div>;
}

Testing.layout = (page) => <AppLayout children={page} title="Testing" />;
