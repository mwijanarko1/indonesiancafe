import { Soup, Utensils } from "lucide-react";

/** Decorative divider — dining icons flanking a gold rule */
export function ForkSpoonRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-brand-gold ${className}`}
      aria-hidden
    >
      <Utensils className="shrink-0 opacity-95" size={22} strokeWidth={1.5} />
      <span className="h-px w-14 max-w-[32vw] rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-80 sm:w-20" />
      <Soup className="shrink-0 opacity-95" size={22} strokeWidth={1.5} />
    </div>
  );
}
