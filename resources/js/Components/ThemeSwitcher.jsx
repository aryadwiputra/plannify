import { useTheme } from '@/Components/ThemeProvider';
import { Button } from '@/Components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };
    return (
        <Button
            onClick={toggleTheme}
            variant="outline"
            className="rounded-full dark:bg-gray-800 hover:dark:bg-gray-700"
            size="lg"
        >
            {theme === 'dark' ? (
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
