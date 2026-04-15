import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import aeespmLogo from '../assets/logo.png';

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
                    <motion.img
                        src={aeespmLogo}
                        alt="Logo AEESPM"
                        whileHover={{ rotate: -6, scale: 1.04 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                        className="h-11 w-11 rounded-full object-contain bg-background/80 shadow-md shadow-primary/20"
                    />
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
