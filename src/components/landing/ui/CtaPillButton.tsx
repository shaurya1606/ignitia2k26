
import * as React from 'react';
import { cn } from '@/lib/utils';

export type CtaButtonVariant = 'primary' | 'outline';

export interface CtaPillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CtaButtonVariant;
}

/**
 * Large pill-shaped CTA button used in the hero (Register / Brochure).
 */
const CtaPillButton = React.forwardRef<HTMLButtonElement, CtaPillButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-2xl min-w-[200px] px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-[0.24em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

    const variantStyles: Record<CtaButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 text-black cursor-pointer hover:scale-105 hover:brightness-110 ease-in-out transition-transform ',
      outline:
        'border border-amber-300/80 bg-black/75 text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-amber-200 hover:text-amber-50 cursor-pointer hover:scale-105 ease-in-out transition-transform ',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CtaPillButton.displayName = 'CtaPillButton';

export default CtaPillButton;
