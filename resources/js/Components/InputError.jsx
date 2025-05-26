export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'mt-2 text-sm tracking-tighter text-red-600 ' + className}>
            {message}
        </p>
    ) : null;
}
