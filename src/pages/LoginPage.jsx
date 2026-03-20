import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const { login, loading, error, setError } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setError(null);
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(form.username, form.password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-primary/5 via-background to-accent/5">
            {/* Pattern background */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000d8a' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <Card className="w-full max-w-md shadow-2xl shadow-primary/5">
                    <CardHeader className="text-center space-y-3">
                        <motion.div
                            animate={{
                                filter: [
                                    'drop-shadow(0 0 16px rgba(0, 13, 138, 0.4))',
                                    'drop-shadow(0 0 32px rgba(0, 13, 138, 0.8))',
                                    'drop-shadow(0 0 16px rgba(0, 13, 138, 0.4))',
                                ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex justify-center"
                        >
                            <Sparkles className="w-12 h-12 text-primary" />
                        </motion.div>
                        <CardTitle className="font-serif text-3xl font-bold">AEESPM</CardTitle>
                        <CardDescription className="italic">Colección de Poemas</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-username">Usuario</Label>
                                <Input
                                    id="login-username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Nombre de usuario"
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password">Contraseña</Label>
                                <Input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-destructive/15 border border-destructive text-destructive rounded-md px-4 py-3 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading} id="btn-login">
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
