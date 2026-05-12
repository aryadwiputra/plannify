import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, onErrors, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="mt-2">
            <input
                {...props}
                type={type}
                className={
                    'block w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-foreground shadow-sm outline-none placeholder:text-muted-foreground transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 dark:border-border/60 dark:bg-background/70 sm:text-sm sm:leading-6 ' +
                    className
                }
                ref={localRef}
            />
            {onErrors}
        </div>
    );
});
