export type Social = { label: string; icon: string; href: string };

export type Theme = {
  bg: string;
  text: string;
  desc: string;
  glass: string;
  border: string;
};

export type ImageFile = {
  file: File | null;
  previewUrl: string;
  fileName: string;
};

export type ProfileState = {
  name: string;
  bio: string;
  avatar: string;
  avatarFile: File | null;
  avatarFileName: string;
  bgImage: ImageFile | null;
  socials: Social[];
  theme: Theme;
};

export function defaultState(): ProfileState {
  return {
    name: "",
    bio: "",
    avatar: "",
    avatarFile: null,
    avatarFileName: "",
    bgImage: null,
    socials: [
      { label: "GitHub", icon: "github", href: "" },
      { label: "LinkedIn", icon: "linkedin", href: "" },
      { label: "Instagram", icon: "instagram", href: "" },
      { label: "Twitter", icon: "twitter", href: "" },
      { label: "Telegram", icon: "telegram", href: "" },
      { label: "Email", icon: "email", href: "" },
      { label: "Weblog", icon: "weblog", href: "" },
    ],
    theme: {
      bg: "#121735",
      text: "#e8eaf2",
      desc: "#b9bfd3",
      glass: "rgba(255,255,255,0.08)",
      border: "rgba(255,255,255,0.22)",
    },
  };
}
