type Props = {
    message: string;
};

export function FormMessage({ message }: Props) {
    return <p className='text-sm text-red-600 mt-1 ml-1'>{message}</p>;
}
