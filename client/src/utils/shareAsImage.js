export async function shareTextAsImage({ title, text, fileName = "share.png", url }) {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const padding = 32;
  const width = 900;
  const maxTextWidth = width - padding * 2;

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const { width: testWidth } = ctx.measureText(testLine);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  ctx.font = "700 28px Inter, sans-serif";
  const titleLines = wrapText(ctx, title, maxTextWidth);

  ctx.font = "400 18px Inter, sans-serif";
  const bodyLines = text
    .split("\n")
    .flatMap((line) => wrapText(ctx, line || "", maxTextWidth));

  const lineHeight = 28;
  const allLines = [...titleLines, "", ...bodyLines];
  const height = padding * 2 + allLines.length * lineHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#011F5B";
  ctx.font = "700 28px Inter, sans-serif";
  ctx.textBaseline = "top";

  let y = padding;
  titleLines.forEach((line) => {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  });

  y += lineHeight / 2;
  ctx.font = "400 18px Inter, sans-serif";

  bodyLines.forEach((line) => {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  });

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) return false;

  const file = new File([blob], fileName, { type: "image/png" });
  const fallbackMessage = text;

  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title, text: fallbackMessage, url });
      return true;
    }
  } catch (error) {
    console.warn("Image share not available:", error);
  }

  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      return true;
    }
  } catch (error) {
    console.warn("Clipboard image write failed:", error);
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fallbackMessage);
      return true;
    }
  } catch (error) {
    console.warn("Clipboard text write failed:", error);
  }

  return false;
}
