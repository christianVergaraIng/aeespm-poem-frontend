import { Pencil, Trash2, Volume2 } from 'lucide-react';
import { getPoemAudioUrl } from '../services/api';

export default function PoemCard({ poem, onEdit, onDelete, onOpen, isAdmin }) {
    const formatBytes = (bytes) => {
        if (bytes === null || bytes === undefined) return 'N/A';
        const units = ['B', 'KB', 'MB', 'GB'];
        const index = bytes > 0 ? Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1) : 0;
        const value = bytes / 1024 ** index;
        return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
    };

    return (
        <article
            className="group relative w-full break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-border/40 bg-card p-7 text-left shadow-sm transition-shadow duration-500 hover:shadow-[0_24px_64px_-16px_rgba(0,13,138,0.14)]"
            role="button"
            tabIndex={0}
            onClick={() => onOpen?.(poem)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen?.(poem);
                }
            }}
        >
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
                            onClick={(event) => {
                                event.stopPropagation();
                                onEdit(poem);
                            }}
                            title="Editar"
                            aria-label="Editar poema"
                            id={`btn-edit-${poem.id}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(poem.id);
                            }}
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

            {poem.hasAudio ? (
                <div
                    className="mb-6 rounded-2xl border border-border/40 bg-background/70 px-4 py-3"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                >
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Volume2 className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold uppercase tracking-[0.2em]">Audio</span>
                    </div>
                    <audio controls className="w-full">
                        <source src={getPoemAudioUrl(poem.id)} type={poem.audioContentType || 'audio/mpeg'} />
                        Tu navegador no soporta audio.
                    </audio>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                        {poem.audioFilename || 'Audio del poema'}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                        Original: {formatBytes(poem.audioOriginalSize)} · Comprimido: {formatBytes(poem.audioCompressedSize)}
                    </div>
                </div>
            ) : (
                <div className="mb-6 rounded-2xl border border-dashed border-border/50 bg-background/60 px-4 py-3 text-xs text-muted-foreground">
                    Sin audio
                </div>
            )}

            <div className="flex items-center justify-between border-t border-border/30 pt-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {poem.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-foreground/80">
                        {poem.author}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                        {poem.sede}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-medium tracking-wide uppercase ${
                        poem.hasAudio
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted/60 text-muted-foreground'
                    }`}>
                        {poem.hasAudio ? 'Con audio' : 'Sin audio'}
                    </span>
                </div>
            </div>
        </article>
    );
}
