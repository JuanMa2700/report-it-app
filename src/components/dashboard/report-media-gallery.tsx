import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Image, Video, Mic, Eye, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReportMedia, MediaType } from "@/lib/types";

const MEDIA_CONFIG: Record<
  MediaType,
  { icon: typeof Image; label: string; color: string; bg: string }
> = {
  PHOTO: {
    icon: Image,
    label: "Foto",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  VIDEO: {
    icon: Video,
    label: "Video",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  AUDIO: {
    icon: Mic,
    label: "Audio",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

function MediaItem({ media }: { media: ReportMedia }) {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const config = MEDIA_CONFIG[media.type];
  const Icon = config.icon;

  async function handleLoad() {
    if (mediaUrl) {
      setMediaUrl(null);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.get<{ url: string }>(
        `/uploads/media/${media.id}`,
      );
      setMediaUrl(data.url);
    } catch {
      console.error("Failed to get media URL");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      {mediaUrl ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMediaUrl(null)}
            className="absolute right-1 top-1 z-10 cursor-pointer rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {media.type === "PHOTO" && (
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={mediaUrl}
                alt="Evidencia"
                className="w-full object-contain"
              />
            </a>
          )}
          {media.type === "VIDEO" && (
            <video src={mediaUrl} controls className="w-full" />
          )}
          {media.type === "AUDIO" && (
            <div className="p-3">
              <audio src={mediaUrl} controls className="w-full" />
            </div>
          )}
        </div>
      ) : (
        <div className={cn("flex h-16 items-center justify-center", config.bg)}>
          <Icon className={cn("h-6 w-6", config.color)} />
        </div>
      )}
      <div className="flex items-center justify-between px-2.5 py-1.5">
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-xs cursor-pointer"
          onClick={handleLoad}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : mediaUrl ? (
            <X className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
          {mediaUrl ? "Cerrar" : "Ver"}
        </Button>
      </div>
    </div>
  );
}

export function ReportMediaGallery({ media }: { media: ReportMedia[] }) {
  if (media.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
        <Image className="h-4 w-4" />
        Evidencia ({media.length})
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {media.map((m) => (
          <MediaItem key={m.id} media={m} />
        ))}
      </div>
    </div>
  );
}
