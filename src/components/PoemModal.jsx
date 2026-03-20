import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const SEDES = [
    { value: 'CUERNAVACA', label: 'CUERNAVACA' },
    { value: 'TAPACHULA', label: 'TAPACHULA' },
    { value: 'TLALPAN', label: 'TLALPAN' },
];

const EMPTY = { title: '', content: '', author: '', sede: 'CUERNAVACA' };

export default function PoemModal({ isOpen, onClose, onSubmit, initial }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(initial ? { ...initial } : EMPTY);
    }, [initial, isOpen]);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSubmit(form);
        setSaving(false);
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

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 16 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-card shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/30 hover:text-primary-foreground"
                            aria-label="Cerrar"
                            id="btn-modal-close"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="relative overflow-hidden bg-primary px-8 pb-8 pt-10">
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20" />
                            <div className="absolute -left-4 bottom-0 h-20 w-20 rounded-full bg-primary-foreground/5" />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                            >
                                <p className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-primary-foreground/50 uppercase">
                                    Poema
                                </p>
                                <h2 className="font-serif text-2xl font-bold leading-snug text-primary-foreground sm:text-3xl">
                                    {initial ? 'Editar poema' : 'Nuevo poema'}
                                </h2>
                                <p className="mt-2 text-sm text-primary-foreground/70">
                                    Comparte tus versos con la comunidad.
                                </p>
                            </motion.div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground" htmlFor="title">
                                        Titulo
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Titulo del poema"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground" htmlFor="author">
                                        Autor
                                    </label>
                                    <input
                                        id="author"
                                        name="author"
                                        type="text"
                                        value={form.author}
                                        onChange={handleChange}
                                        placeholder="Nombre del autor"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="sede">
                                    Sede
                                </label>
                                <select
                                    id="sede"
                                    name="sede"
                                    value={form.sede}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                >
                                    {SEDES.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="content">
                                    Contenido
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    placeholder="Escribe el poema aqui..."
                                    rows={8}
                                    className="min-h-[180px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
                                    disabled={saving}
                                    id="btn-submit-poem"
                                >
                                    {saving ? 'Guardando...' : initial ? 'Actualizar' : 'Crear poema'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
