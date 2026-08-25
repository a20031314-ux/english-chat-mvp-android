import type { ReactElement } from "react";

type TabIconProps = {
  active: boolean;
  className?: string;
};

type TabId = "chat" | "read" | "study" | "video" | "vocab";

const iconBox = "h-6 w-6";

export function ChatTabIcon({ active, className = "" }: TabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${iconBox} ${className}`}
      aria-hidden
    >
      <path
        d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v7.5a2.25 2.25 0 0 1-2.25 2.25H9.3L5.4 19.8a.75.75 0 0 1-1.2-.6v-2.7A2.25 2.25 0 0 1 4.5 14.25v-7.5Z"
        className={active ? "fill-[#e8e8e4]" : "fill-white/40"}
      />
      <path
        d="M8 9.25h8M8 12.25h5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ReadTabIcon({ active, className = "" }: TabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${iconBox} ${className}`}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        className={active ? "fill-[#e8e8e4]" : "fill-white/40"}
      />
      <path
        d="M12 5.5c2.4 2 3.7 4.2 3.7 6.5S14.4 16.5 12 18.5C9.6 16.5 8.3 14.3 8.3 12S9.6 7.5 12 5.5Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M4.8 12h14.4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VideoTabIcon({ active, className = "" }: TabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${iconBox} ${className}`}
      aria-hidden
    >
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2.5"
        className={active ? "fill-[#e8e8e4]" : "fill-white/40"}
      />
      <path d="M10.2 9.2 15.3 12 10.2 14.8V9.2Z" fill="white" />
    </svg>
  );
}

export function VocabTabIcon({ active, className = "" }: TabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${iconBox} ${className}`}
      aria-hidden
    >
      <path
        d="M6.5 5.25h4.2c.7 0 1.3.3 1.8.8l.3.35.3-.35c.5-.5 1.1-.8 1.8-.8h4.2A1.75 1.75 0 0 1 20.85 7v10.1c0 .97-.78 1.75-1.75 1.75h-4.3c-.7 0-1.35.25-1.85.7l-.45.4-.45-.4a2.75 2.75 0 0 0-1.85-.7h-4.3A1.75 1.75 0 0 1 3.65 17.1V7c0-.97.78-1.75 1.75-1.75Z"
        className={active ? "fill-[#e8e8e4]" : "fill-white/40"}
      />
      <path
        d="M12.25 6.4v11.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StudyTabIcon({ active, className = "" }: TabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${iconBox} ${className}`}
      aria-hidden
    >
      <path
        d="M6.2 5.2h5.1c.7 0 1.3.3 1.7.8L13 6.2l.1-.2c.4-.5 1-.8 1.7-.8h5A1.8 1.8 0 0 1 21.6 7v10.4c0 .9-.7 1.6-1.6 1.6h-5.2c-.6 0-1.2.2-1.6.6l-.2.2-.2-.2c-.4-.4-1-.6-1.6-.6H6.2c-.9 0-1.6-.7-1.6-1.6V7c0-.9.7-1.8 1.6-1.8Z"
        className={active ? "fill-[#e8e8e4]" : "fill-white/40"}
      />
      <path
        d="M12 6.6v11.2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const TAB_ICON_META: Record<
  TabId,
  {
    Icon: (props: TabIconProps) => ReactElement;
    activeBg: string;
    idleBg: string;
  }
> = {
  chat: {
    Icon: ChatTabIcon,
    activeBg: "bg-white/10 tb-glow-platinum",
    idleBg: "hover:bg-white/5",
  },
  read: {
    Icon: ReadTabIcon,
    activeBg: "bg-white/10 tb-glow-platinum",
    idleBg: "hover:bg-white/5",
  },
  video: {
    Icon: VideoTabIcon,
    activeBg: "bg-white/10 tb-glow-platinum",
    idleBg: "hover:bg-white/5",
  },
  vocab: {
    Icon: VocabTabIcon,
    activeBg: "bg-white/10 tb-glow-platinum",
    idleBg: "hover:bg-white/5",
  },
  study: {
    Icon: StudyTabIcon,
    activeBg: "bg-white/10 tb-glow-platinum",
    idleBg: "hover:bg-white/5",
  },
};
