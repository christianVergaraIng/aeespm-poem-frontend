import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Key, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: -8, scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
                    >
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </motion.div>
                    <div>
                        <h1 className="font-serif text-xl font-bold tracking-tight text-foreground">
                            AEESPM
                        </h1>
                        <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                            Poems
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden text-xs font-medium text-primary bg-primary/15 px-3 py-1.5 rounded-full sm:flex items-center gap-1.5">
                                <Settings className="w-3 h-3" />
                                Administrador
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                id="btn-logout"
                            >
                                <LogOut className="w-4 h-4 mr-1.5" />
                                Cerrar sesion
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/login" id="btn-admin-login">
                                <Key className="w-4 h-4 mr-1.5" />
                                Acceso Admin
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
