import { Pencil, Trash2 } from 'lucide-react';

export default function PoemCard({ poem, onEdit, onDelete, isAdmin }) {
    return (
        <article className="group relative w-full break-inside-avoid overflow-hidden rounded-2xl border border-border/40 bg-card p-7 text-left shadow-sm transition-shadow duration-500 hover:shadow-[0_24px_64px_-16px_rgba(0,13,138,0.14)]">
            <div className="absolute left-0 top-0 h-[3px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />

            <div className="mb-5 flex items-start justify-between gap-3">
                
                <h2 className="font-serif text-lg font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
                    {poem.title}
                </h2>

                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            onClick={() => onEdit(poem)}
                            title="Editar"
                            aria-label="Editar poema"
                            id={`btn-edit-${poem.id}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                            onClick={() => onDelete(poem.id)}
                            title="Eliminar"
                            aria-label="Eliminar poema"
                            id={`btn-delete-${poem.id}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <p className="mb-6 line-clamp-4 text-sm leading-[1.8] text-muted-foreground">
                {poem.content}
            </p>

            <div className="flex items-center justify-between border-t border-border/30 pt-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {poem.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-foreground/80">
                        {poem.author}
                    </span>
                </div>
                <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {poem.sede}
                </span>
            </div>
        </article>
    );
}
