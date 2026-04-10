import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Search, Scroll, Plus, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PoemCard from '../components/PoemCard';
import PoemModal from '../components/PoemModal';
import PoemViewModal from '../components/PoemViewModal';
import Pagination from '../components/Pagination';
import {
    getPoems,
    createPoem,
    updatePoem,
    deletePoem,
    getCommentsByPoemId,
    createComment,
    deleteComment,
    uploadPoemAudio,
    deletePoemAudio,
} from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function PoemsPage() {
    const { isAuthenticated } = useAuth();

    const [poems, setPoems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPoem, setEditingPoem] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewPoem, setViewPoem] = useState(null);
    const [commentsByPoem, setCommentsByPoem] = useState({});
    const [commentDraft, setCommentDraft] = useState('');
    const [commentFetching, setCommentFetching] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [search, setSearch] = useState('');
    const [sedeFilter, setSedeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(12);
    const [sortBy] = useState('createdAt');
    const [sortDirection] = useState('DESC');
    const [audioUploading, setAudioUploading] = useState(false);
    const [audioDeleting, setAudioDeleting] = useState(false);

    const fetchPoems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPoems(currentPage, pageSize, sortBy, sortDirection);
            setPoems(data.poems);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setError('Error al cargar los poemas. Verifica que el backend esté activo.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortDirection]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3200);
    };

    useEffect(() => { fetchPoems(); }, [fetchPoems]);

    useEffect(() => {
        if (localStorage.getItem('loginToast')) {
            addToast('success', 'Sesion iniciada correctamente.');
            localStorage.removeItem('loginToast');
        }
    }, []);

    // Sedes únicas para el filtro
    const sedes = [...new Set(poems.map((p) => p.sede).filter(Boolean))].sort();

    // Poemas filtrados
    const filtered = poems.filter((p) => {
        const matchSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase());
        const matchSede = sedeFilter === 'all' ? true : p.sede === sedeFilter;
        return matchSearch && matchSede;
    });

    // Abrir modal para crear (cualquier usuario) o editar (solo admin)
    const openCreate = () => { setEditingPoem(null); setModalOpen(true); };
    const openEdit = (poem) => {
        setEditingPoem(poem);
        setModalOpen(true);
        fetchComments(poem.id);
    };
    const closeModal = () => { setModalOpen(false); setEditingPoem(null); };
    const updatePoemState = (updatedPoem) => {
        setPoems((prev) => prev.map((poem) => (
            poem.id === updatedPoem.id ? updatedPoem : poem
        )));
        if (viewPoem?.id === updatedPoem.id) {
            setViewPoem(updatedPoem);
        }
    };
    const fetchComments = async (poemId) => {
        setCommentFetching(true);
        try {
            const res = await getCommentsByPoemId(poemId);
            setCommentsByPoem((prev) => ({ ...prev, [poemId]: res.data }));
        } catch {
            addToast('error', 'Error al cargar los comentarios.');
        } finally {
            setCommentFetching(false);
        }
    };

    const openView = (poem) => {
        setViewPoem(poem);
        setViewOpen(true);
        setCommentDraft('');
        fetchComments(poem.id);
    };
    const closeView = () => { setViewOpen(false); setViewPoem(null); };

    const handleSubmit = async (form, audioFile) => {
        try {
            let savedPoem;
            if (editingPoem) {
                addToast('info', 'Actualizando poema...');
                const res = await updatePoem(editingPoem.id, form);
                savedPoem = res.data;
                addToast('success', 'Poema actualizado.');
            } else {
                addToast('info', 'Guardando poema...');
                const res = await createPoem(form);
                savedPoem = res.data;
                addToast('success', 'Poema creado.');
            }

            if (audioFile && savedPoem?.id) {
                try {
                    setAudioUploading(true);
                    const updatedPoem = await uploadPoemAudio(savedPoem.id, audioFile);
                    updatePoemState(updatedPoem);
                    addToast('success', 'Audio subido correctamente.');
                } catch {
                    addToast('error', 'Error al subir el audio.');
                } finally {
                    setAudioUploading(false);
                }
            } else if (savedPoem) {
                updatePoemState(savedPoem);
            }

            closeModal();
            fetchPoems();
        } catch {
            addToast('error', 'Error al guardar el poema.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este poema?')) return;
        try {
            addToast('info', 'Eliminando poema...');
            await deletePoem(id);
            addToast('success', 'Poema eliminado.');
            fetchPoems();
        } catch {
            addToast('error', 'Error al eliminar el poema.');
        }
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        if (!viewPoem || !commentDraft.trim()) return;
        try {
            setCommentSubmitting(true);
            await createComment({ poemId: viewPoem.id, content: commentDraft.trim() });
            setCommentDraft('');
            addToast('success', 'Comentario enviado.');
            fetchComments(viewPoem.id);
        } catch {
            addToast('error', 'Error al enviar el comentario.');
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!viewPoem) return;
        if (!window.confirm('¿Eliminar este comentario?')) return;
        try {
            await deleteComment(commentId);
            setCommentsByPoem((prev) => ({
                ...prev,
                [viewPoem.id]: (prev[viewPoem.id] || []).filter((comment) => comment.id !== commentId),
            }));
            addToast('success', 'Comentario eliminado.');
        } catch {
            addToast('error', 'Error al eliminar el comentario.');
        }
    };

    const handleUploadAudio = async (poemId, file) => {
        if (!file) return;
        try {
            setAudioUploading(true);
            const updatedPoem = await uploadPoemAudio(poemId, file);
            updatePoemState(updatedPoem);
            addToast('success', 'Audio actualizado.');
        } catch {
            addToast('error', 'Error al actualizar el audio.');
        } finally {
            setAudioUploading(false);
        }
    };

    const handleDeleteAudio = async (poemId) => {
        if (!window.confirm('¿Eliminar el audio de este poema?')) return;
        try {
            setAudioDeleting(true);
            await deletePoemAudio(poemId);
            setPoems((prev) => prev.map((poem) => (
                poem.id === poemId
                    ? {
                        ...poem,
                        hasAudio: false,
                        audioContentType: null,
                        audioFilename: null,
                        audioOriginalSize: null,
                        audioCompressedSize: null,
                    }
                    : poem
            )));
            if (viewPoem?.id === poemId) {
                setViewPoem((prev) => (prev ? {
                    ...prev,
                    hasAudio: false,
                    audioContentType: null,
                    audioFilename: null,
                    audioOriginalSize: null,
                    audioCompressedSize: null,
                } : prev));
            }
            addToast('success', 'Audio eliminado.');
        } catch {
            addToast('error', 'Error al eliminar el audio.');
        } finally {
            setAudioDeleting(false);
        }
    };

    const totalCount = totalElements || poems.length;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-8">
                {/* Hero */}
                <div className="mb-12 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 text-[11px] font-semibold tracking-[0.25em] text-accent uppercase"
                    >
                        Comunidad poetica
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
                    >
                        <span className="text-balance">
                            Coleccion de poemas que{' '}
                            <span className="relative inline-block text-primary">
                                conectan
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-accent"
                                />
                            </span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
                    >
                        {totalCount} {totalCount === 1 ? 'poema registrado' : 'poemas registrados'}
                        . Lee, siente y comparte un espacio donde cada verso encuentra su lector.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-8 flex items-center justify-center gap-1.5"
                    >
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        <span className="h-1 w-6 rounded-full bg-primary/30" />
                        <span className="h-1 w-1 rounded-full bg-accent" />
                    </motion.div>
                </div>

                {/* Controles */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 rounded-3xl border border-border/40 bg-card/60 p-6 shadow-sm backdrop-blur"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative flex-1 min-w-[220px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="input-search"
                                className="pl-10"
                                placeholder="Buscar por titulo o autor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Select value={sedeFilter} onValueChange={setSedeFilter}>
                                <SelectTrigger id="filter-sede" className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Todas las sedes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las sedes</SelectItem>
                                    {sedes.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={openCreate} id="btn-new-poem">
                                <Plus className="w-4 h-4 mr-2" />
                                Enviar poema
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Contenido */}
                {loading && (
                    <div className="flex min-h-[40vh] items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-5"
                        >
                            <div className="relative h-10 w-10">
                                <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/10 border-t-primary" />
                            </div>
                            <p className="text-sm tracking-wide text-muted-foreground">
                                Cargando poemas...
                            </p>
                        </motion.div>
                    </div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex min-h-[40vh] items-center justify-center"
                    >
                        <div className="rounded-2xl border border-accent/20 bg-accent/5 px-10 py-8 text-center">
                            <p className="text-sm font-medium text-accent">{error}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Intenta recargar la pagina
                            </p>
                            <Button variant="outline" onClick={fetchPoems} className="mt-4">
                                Reintentar
                            </Button>
                        </div>
                    </motion.div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
                    >
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
                            <Scroll className="h-8 w-8 text-primary/60" />
                        </div>
                        <p className="font-serif text-2xl text-foreground">
                            El lienzo esta en blanco
                        </p>
                        <p className="text-sm text-muted-foreground text-center max-w-md">
                            {search || sedeFilter !== 'all'
                                ? 'No se encontraron poemas con ese filtro.'
                                : 'Aun no hay poemas. Se el primero en enviar uno.'}
                        </p>
                    </motion.div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((poem) => (
                                <div key={poem.id} className="h-full">
                                    <PoemCard
                                        poem={poem}
                                        isAdmin={isAuthenticated}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                        onOpen={openView}
                                    />
                                </div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </main>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="border-t border-border/30 py-10 text-center"
            >
                <p className="text-[11px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                    Versos Libres - Un espacio para la poesia
                </p>
            </motion.footer>

            {/* Modal compartido: crear (todos) / editar (solo admin) */}
            <PoemModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initial={editingPoem}
                isAdmin={isAuthenticated}
                comments={editingPoem ? commentsByPoem[editingPoem.id] : []}
                commentFetching={commentFetching}
                onDeleteComment={handleDeleteComment}
                onDeleteAudio={handleDeleteAudio}
                audioDeleting={audioDeleting}
            />

            <PoemViewModal
                isOpen={viewOpen}
                onClose={closeView}
                poem={viewPoem}
                isAdmin={isAuthenticated}
                comments={viewPoem ? commentsByPoem[viewPoem.id] : []}
                commentDraft={commentDraft}
                commentFetching={commentFetching}
                commentSubmitting={commentSubmitting}
                onCommentChange={(event) => setCommentDraft(event.target.value)}
                onSubmitComment={handleSubmitComment}
                onDeleteComment={handleDeleteComment}
                onUploadAudio={handleUploadAudio}
                onDeleteAudio={handleDeleteAudio}
                audioUploading={audioUploading}
                audioDeleting={audioDeleting}
            />

            <div className="fixed right-6 top-6 z-50 flex max-w-sm flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/95 px-4 py-3 shadow-lg backdrop-blur"
                        >
                            <div className="mt-0.5">
                                {toast.type === 'success' ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : toast.type === 'info' ? (
                                    <Info className="h-5 w-5 text-accent" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-destructive" />
                                )}
                            </div>
                            <div className="flex-1 text-sm text-foreground">
                                {toast.message}
                            </div>
                            <button
                                type="button"
                                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                                aria-label="Cerrar notificacion"
                            >
                                Cerrar
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
