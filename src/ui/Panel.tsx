import React from "react";
import { ProfileState } from "../state";

export function Panel({
  state,
  setState,
  onReset,
}: {
  state: ProfileState;
  setState: React.Dispatch<React.SetStateAction<ProfileState>>;
  onReset: () => void;
}) {
  const update = (key: keyof ProfileState, value: any) =>
    setState((prev) => ({ ...prev, [key]: value }));
  const updateTheme = (key: keyof ProfileState["theme"], value: string) =>
    setState((prev) => ({ ...prev, theme: { ...prev.theme, [key]: value } }));
  const updateSocial = (i: number, value: string) =>
    setState((prev) => {
      const next = prev.socials.slice();
      next[i] = { ...next[i], href: value };
      return { ...prev, socials: next };
    });

  return (
    <aside className="panel" aria-label="Profile Creator panel">
      <h2>Profile Creator</h2>
      <div className="group">
        <div className="row">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your Name"
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="bio">Description</label>
          <textarea
            id="bio"
            placeholder="A short description"
            value={state.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="avatar">Avatar URL</label>
          {!state.avatarFile && (
            <input
              id="avatar"
              type="url"
              placeholder="https://..."
              value={state.avatar}
              onChange={(e) => update("avatar", e.target.value)}
            />
          )}
          <div className="upload-row">
            <input
              id="avatarFile"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                update("avatarFile", f);
                update("avatarFileName", f.name);
                update("avatar", URL.createObjectURL(f));
              }}
            />
            {state.avatarFile && (
              <button
                className="btn"
                onClick={() => {
                  if (state.avatar.startsWith("blob:"))
                    URL.revokeObjectURL(state.avatar);
                  update("avatarFile", null);
                  update("avatarFileName", "");
                  update("avatar", "");
                }}
              >
                Remove avatar
              </button>
            )}
          </div>
        </div>
        <div className="row">
          <label htmlFor="bgImage">Background Image (optional)</label>
          <div className="upload-row">
            <input
              id="bgImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                update("bgImage", {
                  file: f,
                  previewUrl: url,
                  fileName: f.name,
                });
              }}
            />
            {state.bgImage && (
              <button
                className="btn"
                onClick={() => {
                  if (state.bgImage?.previewUrl?.startsWith("blob:"))
                    URL.revokeObjectURL(state.bgImage.previewUrl);
                  update("bgImage", null);
                }}
              >
                Remove background
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="group">
        <label>Socials</label>
        {state.socials.map((s, i) => (
          <div className="row" key={s.label}>
            <input
              type="text"
              placeholder={`${s.label} URL`}
              value={s.href}
              onChange={(e) => updateSocial(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="group">
        <label>Theme</label>
        <div className="colors">
          <div className="color-item">
            <label>Background</label>
            <input
              type="color"
              value={state.theme.bg}
              onChange={(e) => updateTheme("bg", e.target.value)}
            />
          </div>
          <div className="color-item">
            <label>Text</label>
            <input
              type="color"
              value={state.theme.text}
              onChange={(e) => updateTheme("text", e.target.value)}
            />
          </div>
          <div className="color-item">
            <label>Description</label>
            <input
              type="color"
              value={state.theme.desc}
              onChange={(e) => updateTheme("desc", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button className="btn" onClick={onReset}>
          Reset
        </button>
        <button
          className="btn primary"
          onClick={async () => {
            const { exportZip } = await import("../utils/exporter");
            await exportZip(state);
          }}
        >
          Export ZIP
        </button>
      </div>
    </aside>
  );
}
