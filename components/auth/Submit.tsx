import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";

export function Submit({ children, ...others }: ButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button type='submit' {...others} disabled={pending}>
            {children}
        </Button>
    );
}
