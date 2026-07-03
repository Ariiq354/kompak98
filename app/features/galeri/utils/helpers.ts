export function isImage(ext: string | null | undefined): boolean {
  if (!ext)
    return false;
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext.toLowerCase());
}

export function isVideo(ext: string | null | undefined): boolean {
  if (!ext)
    return false;
  return ["mp4", "webm", "ogg", "avi", "mov"].includes(ext.toLowerCase());
}

export function isDocument(ext: string | null | undefined): boolean {
  if (!ext)
    return false;
  return ["pdf", "doc", "docx", "txt", "rtf", "xls", "xlsx", "csv", "ppt", "pptx", "ods", "odt", "odp"].includes(ext.toLowerCase());
}

export function isArchive(ext: string | null | undefined): boolean {
  if (!ext)
    return false;
  return ["zip", "rar", "7z", "tar", "gz"].includes(ext.toLowerCase());
}

export function getFileIcon(ext: string | null | undefined): { icon: string; color: string } {
  if (!ext)
    return { icon: "i-lucide-file", color: "text-neutral-400 bg-neutral-100 dark:bg-neutral-800" };
  const e = ext.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(e)) {
    return { icon: "i-lucide-file-image", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" };
  }
  if (["mp4", "webm", "ogg", "avi", "mov"].includes(e)) {
    return { icon: "i-lucide-file-video", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" };
  }
  if (["mp3", "wav", "aac", "flac"].includes(e)) {
    return { icon: "i-lucide-file-audio", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" };
  }
  if (["pdf"].includes(e)) {
    return { icon: "i-lucide-file-text", color: "text-red-500 bg-red-50 dark:bg-red-950/20" };
  }
  if (["doc", "docx", "txt", "rtf", "odt"].includes(e)) {
    return { icon: "i-lucide-file-text", color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" };
  }
  if (["xls", "xlsx", "csv", "ods"].includes(e)) {
    return { icon: "i-lucide-file-spreadsheet", color: "text-green-500 bg-green-50 dark:bg-green-950/20" };
  }
  if (["ppt", "pptx", "odp"].includes(e)) {
    return { icon: "i-lucide-presentation", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20" };
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(e)) {
    return { icon: "i-lucide-folder-archive", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" };
  }
  return { icon: "i-lucide-file", color: "text-neutral-400 bg-neutral-50 dark:bg-neutral-900" };
}

export function formatBytes(bytes: number | null | undefined, decimals = 2): string {
  if (bytes === undefined || bytes === null)
    return "-";
  if (bytes === 0)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr)
    return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
