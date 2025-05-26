export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block text-sm font-medium leading-relaxed text-foreground ` + className}>
            {value ? value : children}
        </label>
    );
}
