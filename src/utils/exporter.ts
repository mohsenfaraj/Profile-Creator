import JSZip from "jszip";
import { ProfileState } from "../state";
import { deriveBackground } from "./color";
import { ICON_PATHS } from "./icons";

export async function exportZip(state: ProfileState) {
  const { indexHtml, stylesCss } = generateFiles(state);
  const zip = new JSZip();
  zip.file("index.html", indexHtml);
  zip.file("styles.css", stylesCss);
  const assets = zip.folder("assets")!;
  if (state.avatarFile) {
    const buf = await state.avatarFile.arrayBuffer();
    assets.file(state.avatarFileName || "avatar.png", buf);
  }
  if (state.bgImage?.file) {
    const buf = await state.bgImage.file.arrayBuffer();
    assets.file(state.bgImage.fileName || "background.png", buf);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, "glassy-profile.zip");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function generateFiles(state: ProfileState) {
  const {
    name,
    bio,
    avatar,
    socials,
    theme,
    avatarFile,
    avatarFileName,
    bgImage,
  } = state;
  const derived = deriveBackground(theme.bg);
  const avatarSrc = avatarFile
    ? `./assets/${avatarFileName}`
    : avatar || "https://i.pravatar.cc/240";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Glassy Profile • ${name || "Your Name"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <main class="site">
    <section class="card" role="region" aria-label="Profile card">
      <img class="avatar" src="${avatarSrc}" alt="Profile picture of ${
    name || "Your Name"
  }" width="160" height="160" loading="lazy" decoding="async" />
      <h1 class="name">${name || "Your Name"}</h1>
      <p class="bio" style="color:${theme.desc}">${
    bio || "A short description about yourself goes here."
  }</p>
      <nav class="social" aria-label="Social links">
        <ul>
          ${socials
            .filter((s) => s.href)
            .map(
              (s) =>
                `<li><a href="${formatHref(
                  s.label,
                  s.href
                )}" target="_blank" rel="noreferrer noopener" aria-label="${
                  s.label
                }"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="${
                  ICON_PATHS[s.icon] || ""
                }"/></svg></a></li>`
            )
            .join("\n")}
        </ul>
      </nav>
      <div class="footer">created by <a href="./creator/" target="_blank" rel="noreferrer noopener">profile creator</a></div>
    </section>
  </main>
  <script>(function(){var card=document.querySelector('.card');var parent=card&&card.parentElement;if(!card||!parent)return;parent.style.perspective='900px';function onMove(e){var r=parent.getBoundingClientRect();var x=(e.clientX-r.left)/r.width;var y=(e.clientY-r.top)/r.height;var ry=(x-0.5)*10;var rx=(0.5-y)*10;card.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';}function onLeave(){card.style.transform='rotateX(0deg) rotateY(0deg)';}parent.addEventListener('mousemove',onMove);parent.addEventListener('mouseleave',onLeave);})();</script>
</body>
</html>`;

  const hasBg = !!(bgImage && bgImage.fileName);
  const css = `:root { --bg-0: ${derived.bg0}; --bg-1: ${
    derived.bg1
  }; --text-0: ${theme.text}; --glass: ${theme.glass}; --glass-border: ${
    theme.border
  }; }
html, body { height: 100%; }
body { margin: 0; font-family: Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: var(--text-0); ${
    hasBg
      ? `background-image: url(./assets/${bgImage?.fileName}); background-size: cover; background-position: center; background-attachment: fixed;`
      : `background: radial-gradient(1200px 800px at 20% 10%, ${derived.dotA}, transparent 60%), radial-gradient(1000px 700px at 80% 20%, ${derived.dotB}, transparent 60%), linear-gradient(180deg, var(--bg-1), var(--bg-0)); background-attachment: fixed;`
  } }
.site { min-height: 100svh; display: grid; place-items: center; padding: 24px; position: relative; perspective: 900px; }
.card { width: 100%; max-width: 560px; padding: 32px 28px; border-radius: 20px; background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%); text-align: center; transform-style: preserve-3d; transition: transform 180ms ease, box-shadow 180ms ease; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
.avatar { display:block; width:160px; height:160px; margin:0 auto 16px auto; border-radius: 9999px; border: 1px solid var(--glass-border); outline: 4px solid rgba(255,255,255,0.06); object-fit: cover; }
.name { margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,0.45); }
.bio { margin: 10px auto 22px auto; font-size: 17px; line-height: 1.55; max-width: 44ch; white-space: pre-line; text-shadow: 0 1px 2px rgba(0,0,0,0.35); }
.social ul { list-style: none; display:flex; gap:14px; align-items:center; justify-content:center; margin:0; padding:0; }
.social a { --size: 44px; width: var(--size); height: var(--size); display:inline-flex; align-items:center; justify-content:center; border-radius:9999px; color:#e8eaf2; background: rgba(255,255,255,0.06); border:1px solid var(--glass-border); box-shadow: 0 6px 18px rgba(0,0,0,0.3); transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, color 160ms ease; }
.footer { margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.7); }
.footer a { color: rgba(255,255,255,0.95); }
`;

  return { indexHtml: html, stylesCss: css };
}

function hasProtocol(url: string) {
  return (
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith("mailto:") ||
    url.startsWith("tg:")
  );
}
function formatHref(label: string, href: string) {
  const val = (href || "").trim();
  if (!val) return "";
  switch (label) {
    case "Email":
      return val.startsWith("mailto:") ? val : `mailto:${val}`;
    case "Telegram": {
      const u = val.replace(/^@/, "");
      return hasProtocol(u) ? u : `https://t.me/${u}`;
    }
    case "Weblog":
      return hasProtocol(val) ? val : `https://${val}`;
    default:
      return val;
  }
}
