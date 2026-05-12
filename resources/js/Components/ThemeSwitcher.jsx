import { useTheme } from '@/Components/ThemeProvider';
import { Button } from '@/Components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        // Evaluate the current state.
        // If theme is 'system', we should infer what it's currently rendering
        const isDark = 
            theme === 'dark' || 
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    return (
        <Button
            onClick={toggleTheme}
            variant="outline"
            className="rounded-full dark:bg-gray-800 hover:dark:bg-gray-700 bg-white shadow-md border border-gray-200"
            size="lg"
        >
            {theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
                <div className="flex items-center gap-x-2">
                    <Sun className="h-4 w-4" />
                    <span className="text-sm font-medium leading-relaxed tracking-tighter">Light Mode</span>
                </div>
            ) : (
                <div className="flex items-center gap-x-2">
                    <Moon className="h-4 w-4" />
                    <span className="text-sm font-medium leading-relaxed tracking-tighter">Dark Mode</span>
                </div>
            )}
        </Button>
    );
}
