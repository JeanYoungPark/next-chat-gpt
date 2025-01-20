import { Button, ButtonProps } from "../ui/button";

export function Submit({ children, ...others }: ButtonProps) {
    return (
        <Button type='submit' {...others}>
            {children}
        </Button>
    );
}
