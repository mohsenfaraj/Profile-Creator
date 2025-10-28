import React, { useEffect, useMemo, useRef } from "react";
import { ProfileState } from "../state";
import { deriveBackground } from "../utils/color";
import { Icon } from "./Icon";

function formatHref(label: string, val: string) {
  const href = (val || "").trim();
  if (!href) return "";
  if (label === "Email")
    return href.startsWith("mailto:") ? href : `mailto:${href}`;
  if (label === "Telegram")
    return /^(https?:)?\/\//i.test(href)
      ? href
      : `https://t.me/${href.replace(/^@/, "")}`;
  if (label === "Weblog")
    return /^(https?:)?\/\//i.test(href) ? href : `https://${href}`;
  return href;
}

export function Preview({ state }: { state: ProfileState }) {
  const { name, bio, avatar, socials, theme, bgImage } = state;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const derived = useMemo(
    () => deriveBackground(state.theme.bg),
    [state.theme.bg]
  );
  const siteStyle = useMemo(() => {
    if (bgImage?.previewUrl) {
      return {
        backgroundImage: `url(${bgImage.previewUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      } as React.CSSProperties;
    }
    return {
      background: `radial-gradient(1200px 800px at 20% 10%, ${derived.dotA}, transparent 60%), radial-gradient(1000px 700px at 80% 20%, ${derived.dotB}, transparent 60%), linear-gradient(180deg, ${derived.bg1}, ${derived.bg0})`,
      backgroundAttachment: "fixed",
    } as React.CSSProperties;
  }, [bgImage, derived]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const parent = el.parentElement!;
    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 10;
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    const onLeave = () => {
      el.style.transform = "rotateX(0deg) rotateY(0deg)";
    };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="preview" style={siteStyle}>
      <section className="card" ref={cardRef as any}>
        <img
          className="avatar"
          src={avatar || "https://i.pravatar.cc/240"}
          alt={name ? `Profile picture of ${name}` : "Profile picture"}
        />
        <h1 className="name">{name || "Your Name"}</h1>
        <p className="bio" style={{ color: theme.desc }}>
          {bio || "A short description about yourself goes here."}
        </p>
        <nav className="social" aria-label="Social links">
          <ul>
            {socials
              .filter((s) => s.href)
              .map((s) => (
                <li key={s.label}>
                  <a
                    href={formatHref(s.label, s.href)}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                  >
                    <Icon name={s.icon} />
                  </a>
                </li>
              ))}
          </ul>
        </nav>
        <div className="footer">
          created by{" "}
          <a href="./creator/" target="_blank" rel="noreferrer noopener">
            profile creator
          </a>
        </div>
      </section>
    </div>
  );
}
