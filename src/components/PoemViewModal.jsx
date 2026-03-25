import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function PoemViewModal({ isOpen, onClose, poem }) {
    if (!poem) return null;

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

                        <p className="mb-8 whitespace-pre-wrap text-sm leading-[1.9] text-muted-foreground">
                            {poem.content}
                        </p>

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
                    </motion.article>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
