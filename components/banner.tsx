import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "./animated-shiny-text";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";

function Banner() {
  return (
    <div className="z-10 flex items-center justify-center w-full">
      <div
        className={cn(
          "group w-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className="flex lg:flex-row items-center justify-center flex-col lg:gap-24 lg:px-24 px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 w-full">
          <span>
            ✨ Assistance conseils aux grandes entreprises, PME, et PTE: Montage
            financier, trésorerie, développement et gestion des entités
          </span>
          <a
            href="tel:+221338157888"
            className="hover:text-accent inline-flex items-center justify-center gap-2 text-lg text-foreground"
          >
            <PhoneCallIcon className="size-4" />+ 221 33 815 78 88
          </a>
        </AnimatedShinyText>
      </div>
    </div>
  );
}

export { Banner };
