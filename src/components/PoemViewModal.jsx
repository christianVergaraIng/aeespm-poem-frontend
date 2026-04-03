import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Mouse, X } from 'lucide-react';

export default function PoemViewModal({
    isOpen,
    onClose,
    poem,
    comments,
    commentDraft,
    commentFetching,
    commentSubmitting,
    onCommentChange,
    onSubmitComment,
}) {
    const contentRef = useRef(null);
    const commentsRef = useRef(null);
    const [commentsOpen, setCommentsOpen] = useState(true);

    if (!poem) return null;

    const scrollByAmount = (amount) => {
        if (contentRef.current) {
            contentRef.current.scrollBy({ top: amount, behavior: 'smooth' });
        }
    };

    const scrollToComments = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.article
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 16 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/40 bg-card p-8 text-left shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="absolute left-0 top-0 h-[3px] w-full bg-accent" />

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label="Cerrar"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-6 pr-10">
                            <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                                Poema seleccionado
                            </p>
                            <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
                                {poem.title}
                            </h2>
                        </div>

                        <div ref={contentRef} className="max-h-[60vh] overflow-y-auto pr-2 pb-6">
                            <div className="text-sm leading-[1.9] text-muted-foreground">
                                <p className="whitespace-pre-wrap">
                                    {poem.content}
                                </p>
                            </div>

                            <div className="mb-6 mt-6 flex items-center justify-between rounded-full border border-border/40 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                                <span className="tracking-[0.2em] uppercase">Lectura</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => scrollByAmount(-240)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                        aria-label="Subir"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollByAmount(240)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                        aria-label="Bajar"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border/30 pt-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {poem.author?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="leading-tight">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                            Autor
                                        </p>
                                        <p className="text-sm font-semibold text-foreground/80">
                                            {poem.author}
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                    {poem.sede}
                                </span>
                            </div>

                            <div ref={commentsRef} className="mt-6 border-t border-border/30 pt-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                                            Comentarios
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            El usuario: Raton de Biblioteca
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                            {comments?.length ?? 0} comentarios
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setCommentsOpen((prev) => !prev)}
                                            className="rounded-full border border-border/60 bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                        >
                                            {commentsOpen ? 'Ocultar' : 'Mostrar'}
                                        </button>
                                    </div>
                                </div>

                                {commentsOpen && (
                                    <>
                                        <form onSubmit={onSubmitComment} className="space-y-3">
                                            <div className="space-y-2 pt-1">
                                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                                    Escribe tu comentario
                                                </label>
                                                <textarea
                                                    value={commentDraft}
                                                    onChange={onCommentChange}
                                                    placeholder="Escribe tu comentario..."
                                                    rows={3}
                                                    className="w-full resize-none rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm leading-relaxed shadow-sm transition focus-visible:outline-none focus-visible:border-primary/60 focus-visible:shadow-[0_0_0_1px_rgba(59,130,246,0.35)]"
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-[0_12px_30px_-18px_rgba(14,84,160,0.9)] transition-colors hover:bg-primary/90 disabled:opacity-60"
                                                    disabled={commentSubmitting}
                                                >
                                                    {commentSubmitting ? 'Enviando...' : 'Enviar comentario'}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="mt-6 space-y-4">
                                            {commentFetching && (comments?.length ?? 0) === 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Cargando comentarios...
                                                </p>
                                            )}
                                            {(comments ?? []).map((comment, index) => (
                                                <div
                                                    key={comment.id}
                                                    className={`relative max-w-[90%] rounded-2xl border border-border/40 px-4 py-3 shadow-sm ${
                                                        index % 2 === 0
                                                            ? 'mr-auto bg-background/70'
                                                            : 'ml-auto bg-primary/5'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-5 h-2.5 w-2.5 rotate-45 rounded-[3px] ${
                                                            index % 2 === 0
                                                                ? '-left-1.5 border-l border-t border-border/40 bg-background/70'
                                                                : '-right-1.5 border-r border-t border-border/40 bg-primary/5'
                                                        }`}
                                                    />
                                                    <div className="mb-2 flex items-center justify-between">
                                                        {comment.createdAt && (
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {new Date(comment.createdAt).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground/80">
                                                        {comment.nickname || 'Raton de Biblioteca'}
                                                    </p>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            ))}
                                            {(comments ?? []).length === 0 && !commentFetching && (
                                                <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center">
                                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <Mouse className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground/80">
                                                        No hay ratones en la madriguera
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Se el primero en dejar un comentario.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {!commentsOpen && (
                                    <div className="rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-4 text-center">
                                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            Comentarios ocultos
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                            {commentsOpen && (comments ?? []).length > 0 ? (
                                <button
                                    type="button"
                                    onClick={scrollToComments}
                                    className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                >
                                    Ir a comentarios
                                </button>
                            ) : !commentsOpen ? (
                                <button
                                    type="button"
                                    onClick={() => setCommentsOpen(true)}
                                    className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                >
                                    Mostrar comentarios
                                </button>
                            ) : (
                                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Sin comentarios
                                </span>
                            )}
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                Desliza para leer
                            </span>
                        </div>
                    </motion.article>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
