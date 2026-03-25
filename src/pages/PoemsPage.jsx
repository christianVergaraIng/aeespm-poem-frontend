import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Scroll, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PoemCard from '../components/PoemCard';
import PoemModal from '../components/PoemModal';
import PoemViewModal from '../components/PoemViewModal';
import { getPoems, createPoem, updatePoem, deletePoem } from '../services/api';
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
    const [search, setSearch] = useState('');
    const [sedeFilter, setSedeFilter] = useState('all');

    const fetchPoems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPoems();
            setPoems(res.data);
        } catch {
            setError('Error al cargar los poemas. Verifica que el backend esté activo.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPoems(); }, [fetchPoems]);

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
    const openEdit = (poem) => { setEditingPoem(poem); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditingPoem(null); };
    const openView = (poem) => { setViewPoem(poem); setViewOpen(true); };
    const closeView = () => { setViewOpen(false); setViewPoem(null); };

    const handleSubmit = async (form) => {
        try {
            if (editingPoem) {
                await updatePoem(editingPoem.id, form);
            } else {
                await createPoem(form);
            }
            closeModal();
            fetchPoems();
        } catch {
            alert('Error al guardar el poema.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este poema?')) return;
        try {
            await deletePoem(id);
            setPoems((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert('Error al eliminar el poema.');
        }
    };

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
                        {poems.length} {poems.length === 1 ? 'poema registrado' : 'poemas registrados'}
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
                    <div className="columns-1 gap-7 sm:columns-2 lg:columns-3">
                        {filtered.map((poem) => (
                            <div key={poem.id} className="mb-7 break-inside-avoid">
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
            />

            <PoemViewModal
                isOpen={viewOpen}
                onClose={closeView}
                poem={viewPoem}
            />
        </div>
    );
}
