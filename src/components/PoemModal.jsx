import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const SEDES = [
    { value: 'CUERNAVACA', label: 'CUERNAVACA' },
    { value: 'TAPACHULA', label: 'TAPACHULA' },
    { value: 'TLALPAN', label: 'TLALPAN' },
];

const EMPTY = { title: '', content: '', author: '', sede: 'CUERNAVACA' };

export default function PoemModal({
    isOpen,
    onClose,
    onSubmit,
    initial,
    isAdmin,
    comments,
    commentFetching,
    onDeleteComment,
    onDeleteAudio,
    audioDeleting,
}) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [audioError, setAudioError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
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

    const handleAudioFile = (file) => {
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

    const handleAudioChange = (event) => {
        const file = event.target.files?.[0];
        handleAudioFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (audioFile) return;
        setIsDragging(false);
        const file = event.dataTransfer?.files?.[0];
        handleAudioFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (!audioFile) setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
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
                        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/40 bg-card text-left shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="absolute left-0 top-0 h-[3px] w-full bg-accent" />
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label="Cerrar"
                            id="btn-modal-close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="max-h-[85vh] overflow-y-auto px-8 pb-8 pt-8">
                            <div className="mb-6 pr-10">
                            <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
                                Poema
                            </p>
                            <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
                                {initial ? 'Editar poema' : 'Nuevo poema'}
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Comparte tus versos con la comunidad.
                            </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                {!isAdmin && !audioFile && (
                                    <div
                                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-center text-xs text-muted-foreground transition ${
                                            isDragging
                                                ? 'border-primary/60 bg-primary/5 text-primary'
                                                : 'border-border/60 bg-background/60'
                                        }`}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                    >
                                        <p className="text-sm font-semibold text-foreground/80">
                                            Arrastra y suelta tu audio aqui
                                        </p>
                                        <p>o selecciona un archivo desde tu dispositivo</p>
                                        <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                                            Seleccionar audio
                                            <input
                                                id="audio"
                                                name="audio"
                                                type="file"
                                                accept="audio/*"
                                                onChange={handleAudioChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                )}

                                {!isAdmin && audioFile && (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <input
                                            id="audio"
                                            name="audio"
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleAudioChange}
                                            className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary"
                                        />
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
                                    </div>
                                )}

                                {isAdmin && initial?.hasAudio && (
                                    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                                        <span>Audio adjunto</span>
                                        <button
                                            type="button"
                                            onClick={() => onDeleteAudio?.(initial.id)}
                                            disabled={audioDeleting}
                                            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-destructive transition-colors hover:text-destructive/80 disabled:opacity-60"
                                        >
                                            {audioDeleting ? 'Eliminando...' : 'Eliminar audio'}
                                        </button>
                                    </div>
                                )}

                                {audioFile && (
                                    <div className="rounded-xl border border-border/50 bg-background px-3 py-2 text-xs text-muted-foreground">
                                        {audioFile.name} · {formatBytes(audioFile.size)}
                                    </div>
                                )}

                                {audioError && (
                                    <p className="text-xs font-semibold text-destructive">{audioError}</p>
                                )}
                            </div>

                            {isAdmin && initial?.id && (
                                <div className="space-y-3 rounded-2xl border border-border/50 bg-background/70 px-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Comentarios</p>
                                            <p className="text-xs text-muted-foreground">Gestion de comentarios del poema.</p>
                                        </div>
                                        <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                            {comments?.length ?? 0} comentarios
                                        </span>
                                    </div>

                                    {commentFetching && (
                                        <p className="text-xs text-muted-foreground">Cargando comentarios...</p>
                                    )}

                                    {!commentFetching && (comments ?? []).length === 0 && (
                                        <p className="text-xs text-muted-foreground">Sin comentarios por ahora.</p>
                                    )}

                                    <div className="space-y-3">
                                        {(comments ?? []).map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex items-start justify-between gap-3 rounded-xl border border-border/40 bg-background/70 px-3 py-2 text-xs"
                                            >
                                                <div>
                                                    <p className="font-semibold text-foreground/80">
                                                        {comment.nickname || 'Raton de Biblioteca'}
                                                    </p>
                                                    <p className="text-muted-foreground">{comment.content}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteComment?.(comment.id)}
                                                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-destructive transition-colors hover:text-destructive/80"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
