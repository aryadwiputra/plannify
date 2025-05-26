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
                    'block w-full rounded-md border border-input bg-background p-2 text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 ' +
                    className
                }
                ref={localRef}
            />
            {onErrors}
        </div>
    );
});
