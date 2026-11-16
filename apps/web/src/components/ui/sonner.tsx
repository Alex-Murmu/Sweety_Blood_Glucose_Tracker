import React from "react";
import {
  RiAlertLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiInformationLine,
  RiLoader4Line,
} from "react-icons/ri";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <RiCheckboxCircleLine className="size-4 text-landing-accent" />,
        info: <RiInformationLine className="size-4 text-sky-400" />,
        warning: <RiAlertLine className="size-4 text-amber-400" />,
        error: <RiCloseCircleLine className="size-4 text-red-400" />,
        loading: <RiLoader4Line className="size-4 animate-spin text-landing-accent" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-landing-panel group-[.toaster]:text-landing-text group-[.toaster]:border-landing-border group-[.toaster]:shadow-2xl rounded-xl p-4 font-sans text-sm",
          description: "group-[.toast]:text-landing-muted text-xs mt-1",
          actionButton:
            "group-[.toast]:bg-landing-accent group-[.toast]:text-white font-semibold",
          cancelButton:
            "group-[.toast]:bg-landing-panel-strong group-[.toast]:text-landing-muted",
        },
      }}
      {...props}
    />
  );
}

export { toast };

