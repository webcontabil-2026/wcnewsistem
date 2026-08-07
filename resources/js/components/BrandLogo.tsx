type BrandLogoSize = "footer" | "client" | "accountant" | "admin";

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
