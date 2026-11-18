import { cn } from "@/lib/utils";

type PageHeaderProps = { title: string; subtitle: string; eyebrow?: string; className?: string };

export function PageHeader({ title, subtitle, eyebrow, className }: PageHeaderProps) {
  return (
    <header className={cn("page-heading", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </header>
  );
}
