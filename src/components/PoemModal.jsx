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
    const [audioFile, setAudioFile] = useState(null);
    const [audioError, setAudioError] = useState('');
    const maxAudioSize = 15 * 1024 * 1024;

    useEffect(() => {
        setForm(initial ? { ...initial } : EMPTY);
        setAudioFile(null);
        setAudioError('');
    }, [initial, isOpen]);

    const formatBytes = (bytes) => {
        if (!bytes && bytes !== 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        const index = bytes > 0 ? Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1) : 0;
        const value = bytes / 1024 ** index;
        return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
    };

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleAudioChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setAudioFile(null);
            setAudioError('');
            return;
        }

        if (!file.type.startsWith('audio/')) {
            setAudioError('Solo se permiten archivos de audio.');
            setAudioFile(null);
            return;
        }

        if (file.size > maxAudioSize) {
            setAudioError('El audio debe ser menor a 15 MB.');
            setAudioFile(null);
            return;
        }

        setAudioError('');
        setAudioFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSubmit(form, audioFile);
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
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 16 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-card via-card/95 to-card/80 shadow-[0_24px_80px_-30px_rgba(10,10,20,0.6)]"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/90 shadow-sm transition-colors hover:bg-primary-foreground/20"
                            aria-label="Cerrar"
                            id="btn-modal-close"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent/80 px-8 pb-9 pt-10">
                            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary-foreground/10" />
                            <div className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-primary-foreground/10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="relative"
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
                                        className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                                        className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                                    className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                                    className="min-h-[180px] w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm leading-relaxed shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    required
                                />
                            </div>

                            <div className="space-y-3 rounded-2xl border border-border/50 bg-background/70 px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Audio (opcional)</p>
                                        <p className="text-xs text-muted-foreground">
                                            Adjunta un audio para el poema. Maximo 15 MB.
                                        </p>
                                    </div>
                                    {initial?.hasAudio && (
                                        <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                            Ya tiene audio
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <input
                                        id="audio"
                                        name="audio"
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleAudioChange}
                                        className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary"
                                    />
                                    {audioFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAudioFile(null);
                                                setAudioError('');
                                            }}
                                            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            Quitar archivo
                                        </button>
                                    )}
                                </div>

                                {audioFile && (
                                    <div className="rounded-xl border border-border/50 bg-background px-3 py-2 text-xs text-muted-foreground">
                                        {audioFile.name} · {formatBytes(audioFile.size)}
                                    </div>
                                )}

                                {audioError && (
                                    <p className="text-xs font-semibold text-destructive">{audioError}</p>
                                )}
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-18px_rgba(14,84,160,0.9)] transition-colors hover:bg-primary/90 disabled:opacity-60"
                                    disabled={saving || !!audioError}
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
