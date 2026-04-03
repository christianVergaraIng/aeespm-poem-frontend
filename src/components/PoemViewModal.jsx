import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

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

    if (!poem) return null;

    const scrollByAmount = (amount) => {
        if (contentRef.current) {
            contentRef.current.scrollBy({ top: amount, behavior: 'smooth' });
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

                        <div
                            ref={contentRef}
                            className="mb-6 max-h-[45vh] overflow-y-auto pr-2 text-sm leading-[1.9] text-muted-foreground"
                        >
                            <p className="whitespace-pre-wrap">
                                {poem.content}
                            </p>
                        </div>

                        <div className="mb-6 flex items-center justify-between rounded-full border border-border/40 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
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

                        <div className="mt-6 border-t border-border/30 pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                                        Comentarios
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        El usuario: Raton de Biblioteca
                                    </p>
                                </div>
                                <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                    {comments?.length ?? 0} comentarios
                                </span>
                            </div>

                            <form onSubmit={onSubmitComment} className="space-y-3">
                                <textarea
                                    value={commentDraft}
                                    onChange={onCommentChange}
                                    placeholder="Escribe tu comentario..."
                                    rows={3}
                                    className="w-full resize-none rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm leading-relaxed shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    required
                                />
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
                                {(comments ?? []).map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                                El usuario
                                            </p>
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
                                    <p className="text-sm text-muted-foreground">
                                        Aun no hay comentarios. Se el primero en comentar.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.article>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
