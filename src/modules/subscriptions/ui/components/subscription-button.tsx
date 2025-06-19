import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

interface SubscriptionButtonProps
  extends Pick<ComponentProps<typeof Button>, "onClick" | "size"> {
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
