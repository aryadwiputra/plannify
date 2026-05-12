import { AlertTriangle, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { PRIORITY } from '@/lib/utils';

export function GetPriorityBadge({ priority }) {
    const { URGENT, HIGH, MEDIUM, LOW, UNKNOWN } = PRIORITY;

    const map = {
        [URGENT]: {
            text: URGENT,
            icon: AlertTriangle,
            className:
                'border-red-200/80 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300',
        },
        [HIGH]: {
            text: HIGH,
            icon: ArrowUp,
            className:
                'border-amber-200/80 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300',
        },
        [MEDIUM]: {
            text: MEDIUM,
            icon: Minus,
            className:
                'border-sky-200/80 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-300',
        },
        [LOW]: {
            text: LOW,
            icon: ArrowDown,
            className:
                'border-emerald-200/80 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300',
        },
        [UNKNOWN]: {
            text: UNKNOWN,
            icon: Minus,
            className:
                'border-border/70 bg-background/80 text-muted-foreground hover:bg-muted dark:border-border/60 dark:bg-background/70',
        },
    };

    const current = map[priority] ?? map[UNKNOWN];
    const Icon = current.icon;

    return (
        <Badge className={`gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none ${current.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {current.text}
        </Badge>
    );
}
