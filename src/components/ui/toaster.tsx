import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface ToasterProps {
  topBarHeight: number | undefined;
}

export function Toaster({ topBarHeight }: ToasterProps) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="bg-popover px-3 py-2 text-popover-foreground"
          >
            <div className="space-y-2.5 leading-snug">
              {title && <ToastTitle className="text-base">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-base font-medium">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport
        className="px-6 py-0 homeSm:mt-0 homeSm:pb-6"
        style={{
          marginTop: `calc(${topBarHeight}px + 1.5rem)`,
        }}
      />
    </ToastProvider>
  );
}
