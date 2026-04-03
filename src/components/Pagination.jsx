import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    const pages = [];

    for (let i = startPage; i <= endPage; i += 1) {
        pages.push(i);
    }

    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Anterior
                </button>

                {startPage > 0 && (
                    <>
                        <button
                            type="button"
                            onClick={() => onPageChange(0)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            1
                        </button>
                        {startPage > 1 && (
                            <span className="px-1 text-xs text-muted-foreground">...</span>
                        )}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                            page === currentPage
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-primary'
                        }`}
                    >
                        {page + 1}
                    </button>
                ))}

                {endPage < totalPages - 1 && (
                    <>
                        {endPage < totalPages - 2 && (
                            <span className="px-1 text-xs text-muted-foreground">...</span>
                        )}
                        <button
                            type="button"
                            onClick={() => onPageChange(totalPages - 1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Siguiente
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Mostrando {startItem} - {endItem} de {totalElements} poemas
            </p>
        </div>
    );
}
