interface SweetyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function SweetyLogo({ className = "", size = "md", showText = true }: SweetyLogoProps) {
  const iconSizes = {
    sm: "size-7",
    md: "size-9",
    lg: "size-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Hallmark SVG Icon: Calibrated glucose droplet with embedded heartbeat rhythm */}
      <div
        className={`relative grid ${iconSizes[size]} place-items-center rounded-xl bg-gradient-to-br from-landing-accent to-[#1d4ed8] p-[1.5px] shadow-[0_0_20px_rgba(59,130,246,0.35)]`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-landing-bg">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5/6 text-landing-accent"
          >
            {/* Droplet outline with health geometry */}
            <path
              d="M16 3.5C16 3.5 8 13.2 8 19.2C8 23.6 11.6 27.2 16 27.2C20.4 27.2 24 23.6 24 19.2C24 13.2 16 3.5 16 3.5Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* ECG pulse inside droplet */}
            <path
              d="M11 19.5H13.2L14.6 16.5L17.4 22.5L18.8 19.5H21"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-bold tracking-tight text-landing-text ${textSizes[size]}`}
            style={{ letterSpacing: "-0.03em" }}
          >
            Sweety
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-landing-muted">
            Glucose Rhythm
          </span>
        </div>
      )}
    </div>
  );
}

export default SweetyLogo;
