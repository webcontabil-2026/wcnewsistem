/*
 * Define os locais em que a logo pode ser utilizada.
 * Cada opção possui seu próprio tamanho definido no CSS.
 */
type BrandLogoSize =
    | "header"
    | "footer"
    | "client"
    | "accountant"
    | "admin";

interface BrandLogoProps {
    size: BrandLogoSize;
    className?: string;
}

export default function BrandLogo({ size, className = "" }: BrandLogoProps) {
    return (
        <span
            className={`brand-logo brand-logo--${size} ${className}`.trim()}
            role="img"
            aria-label="WebContabil"
        >
            <span className="brand-logo__symbol" aria-hidden="true" />
        </span>
    );
}
