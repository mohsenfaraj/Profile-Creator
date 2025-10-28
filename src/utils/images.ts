export function fileToImage(file: File) {
  return new Promise<{ img: HTMLImageElement; url: string }>(
    (resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve({ img, url });
      img.onerror = reject;
      img.src = url;
    }
  );
}

export function resizeToCanvas(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  cover = false
) {
  const canvas = document.createElement("canvas");
  let drawW = targetW,
    drawH = targetH;
  let sx = 0,
    sy = 0,
    sWidth = img.width,
    sHeight = img.height;
  if (cover) {
    const scale = Math.max(targetW / img.width, targetH / img.height);
    sWidth = targetW / scale;
    sHeight = targetH / scale;
    sx = (img.width - sWidth) / 2;
    sy = (img.height - sHeight) / 2;
  } else {
    const scale = Math.min(targetW / img.width, targetH / img.height);
    drawW = Math.round(img.width * scale);
    drawH = Math.round(img.height * scale);
  }
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, targetW, targetH);
  if (!cover) {
    const dx = Math.round((targetW - drawW) / 2);
    const dy = Math.round((targetH - drawH) / 2);
    ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, drawW, drawH);
  } else {
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
  }
  return canvas;
}

export async function resizeImageFile(
  file: File,
  targetW: number,
  targetH: number,
  cover = false,
  outName = "image"
) {
  const { img, url } = await fileToImage(file);
  const canvas = resizeToCanvas(img, targetW, targetH, cover);
  URL.revokeObjectURL(url);
  const type = file.type || "image/png";
  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b as Blob), type, 0.9)
  );
  const ext = type.split("/")[1] || "png";
  return {
    file: new File([blob], `${outName}.${ext}`, { type }),
    fileName: `${outName}.${ext}`,
  };
}
