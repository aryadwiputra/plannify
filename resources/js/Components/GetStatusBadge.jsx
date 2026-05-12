import { CheckCircle2, CircleDashed, CircleEllipsis, LoaderCircle, SearchCheck } from 'lucide-react';
import { STATUS } from '@/lib/utils';
import { Badge } from './ui/badge';

export function GetStatusBadge({ status }) {
    const { TODO, INPROGRESS, ONREVIEW, DONE, UNKNOWN } = STATUS;

    const map = {
        [TODO]: {
            text: TODO,
            icon: CircleDashed,
            className:
                'border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
        },
        [INPROGRESS]: {
            text: INPROGRESS,
            icon: LoaderCircle,
            className:
                'border-amber-200/80 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300',
        },
        [ONREVIEW]: {
            text: ONREVIEW,
            icon: SearchCheck,
            className:
                'border-sky-200/80 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-300',
        },
        [DONE]: {
            text: DONE,
            icon: CheckCircle2,
            className:
                'border-emerald-200/80 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300',
        },
        [UNKNOWN]: {
            text: UNKNOWN,
            icon: CircleEllipsis,
            className:
                'border-border/70 bg-background/80 text-muted-foreground hover:bg-muted dark:border-border/60 dark:bg-background/70',
        },
    };

    const current = map[status] ?? map[UNKNOWN];
    const Icon = current.icon;

    return (
        <Badge className={`gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none ${current.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {current.text}
        </Badge>
    );
}
