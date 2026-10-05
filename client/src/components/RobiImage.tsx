import { useState } from "react";

type RobiImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export function shouldSimulateFailure() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("qaRobiFallback") === "1";
}

export function RobiImage({ src, alt, className, loading = "lazy" }: RobiImageProps) {
  const [failed, setFailed] = useState(shouldSimulateFailure);

  if (failed) {
    return (
      <span
        className={`robi-image-fallback ${className ?? ""}`}
        role="img"
        aria-label={`${alt}; görsel yüklenemedi`}
        data-testid="robi-image-fallback"
      >
        Robi<span>rehber</span>
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />;
}
