import { Badge } from '@/Components/ui/badge';
import { PRIORITY } from '@/lib/utils';

export function GetPriorityBadge({ priority }) {
    const { URGENT, HIGH, MEDIUM, LOW, UNKNOWN } = PRIORITY;
    let badge, text;

    switch (priority) {
        case URGENT:
            badge = 'bg-red-500 hover:bg-red-600';
            text = URGENT;
            break;
        case HIGH:
            badge = 'bg-yellow-500 hover:bg-yellow-600';
            text = HIGH;
            break;
        case MEDIUM:
            badge = 'bg-blue-500 hover:bg-blue-600';
            text = MEDIUM;
            break;
        case LOW:
            badge = 'bg-green-500 hover:bg-green-600';
            text = LOW;
            break;

        default:
            badge = '';
            text = UNKNOWN;
            break;
    }

    return <Badge className={badge}>{text}</Badge>;
}
