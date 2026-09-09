import Image from "next/image";

export function SpfcShield({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <Image
      src="/spfc-logo.png"
      alt="Escudo São Paulo FC"
      width={48}
      height={48}
      className={`${className} object-contain`}
      priority
    />
  );
}
