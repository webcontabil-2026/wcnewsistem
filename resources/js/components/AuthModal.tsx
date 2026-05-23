/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, FormEvent } from "react";
import { motion } from "motion/react";
import {
    X,
    User,
    Briefcase,
    ShieldCheck,
    Mail,
    Lock,
    Landmark,
    FileText,
    Fingerprint,
} from "lucide-react";
import { cn } from "../lib/utils";
import { UserRole, User as UserType } from "../types";

interface AuthModalProps {
    mode: "LOGIN" | "REGISTER";
    onClose: () => void;
    onLogin: (user: UserType) => void;
}

type AuthRole = "CLIENT" | "ACCOUNTANT" | "ADMIN";

export default function AuthModal({
    mode: initialMode,
    onClose,
    onLogin,
}: AuthModalProps) {
    const [mode, setMode] = useState<"LOGIN" | "REGISTER">(initialMode);
    const [role, setRole] = useState<AuthRole>("CLIENT");
    const [formData, setFormData] = useState({
        nome: "",
        razaoSocial: "",
        email: "",
        password: "",
        cpf: "",
        cnpj: "",
        crc: "",
        adminPass: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (role === "ADMIN" && formData.adminPass !== "123") {
            alert("Senha administrativa incorreta (Dica: 123)");
            return;
        }

        const mockUser: UserType = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.nome || "Usuário Teste",
            email: formData.email,
            role: role as UserRole,
            razaoSocial: formData.razaoSocial,
            cpf: formData.cpf,
            cnpj: formData.cnpj,
            crc: formData.crc,
        };

        onLogin(mockUser);
    };

    const inputClasses =
        "w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand/50 focus:border-brand/50 outline-none transition-all placeholder:text-white/20 text-white text-sm backdrop-blur-sm";
    const labelClasses =
        "block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
            >
                <div className="w-full md:w-56 bg-white/5 border-r border-white/10 p-8 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-brand" />
                        Perfil de Acesso
                    </h3>
                    <RoleTab
                        active={role === "CLIENT"}
                        onClick={() => setRole("CLIENT")}
                        icon={<User className="w-4 h-4" />}
                        label="Cliente"
                    />
                    <RoleTab
                        active={role === "ACCOUNTANT"}
                        onClick={() => setRole("ACCOUNTANT")}
                        icon={<Briefcase className="w-4 h-4" />}
                        label="Contador"
                    />
                    <RoleTab
                        active={role === "ADMIN"}
                        onClick={() => setRole("ADMIN")}
                        icon={<ShieldCheck className="w-4 h-4" />}
                        label="Admin"
                    />
                    <div className="mt-auto pt-6 text-[10px] text-white/30 leading-relaxed italic">
                        "A ponte inteligente entre o contador e o cliente."
                    </div>
                </div>

                <div className="flex-grow p-10 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <X className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>

                    <div className="max-w-sm mx-auto space-y-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                {mode === "LOGIN"
                                    ? "Acesso WebContabil"
                                    : "Nova Conta"}
                            </h2>
                            <p className="text-sm text-white/40 mt-1 font-medium">
                                {role === "CLIENT" &&
                                    "Área Restrita do Cliente"}
                                {role === "ACCOUNTANT" &&
                                    "Portal Oficial do Contador"}
                                {role === "ADMIN" && "Validação de Sistema"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {role === "ADMIN" ? (
                                <div className="space-y-4 py-4">
                                    <div className="relative">
                                        <label className={labelClasses}>
                                            Senha Mestre
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className={inputClasses}
                                                value={formData.adminPass}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        adminPass:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mode === "REGISTER" && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label
                                                        className={labelClasses}
                                                    >
                                                        Nome
                                                    </label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                        <input
                                                            placeholder="Seu Nome"
                                                            className={
                                                                inputClasses
                                                            }
                                                            value={
                                                                formData.nome
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    nome: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label
                                                        className={labelClasses}
                                                    >
                                                        Razão Social
                                                    </label>
                                                    <div className="relative">
                                                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                        <input
                                                            placeholder="Sua Empresa"
                                                            className={
                                                                inputClasses
                                                            }
                                                            value={
                                                                formData.razaoSocial
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    razaoSocial:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label
                                                        className={labelClasses}
                                                    >
                                                        CPF / CNPJ
                                                    </label>
                                                    <div className="relative">
                                                        <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                        <input
                                                            placeholder="000.000.000-00"
                                                            className={
                                                                inputClasses
                                                            }
                                                            value={formData.cpf}
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    cpf: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {role === "ACCOUNTANT" ? (
                                                    <div className="space-y-1">
                                                        <label
                                                            className={
                                                                labelClasses
                                                            }
                                                        >
                                                            CRC (Registro)
                                                        </label>
                                                        <div className="relative">
                                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                            <input
                                                                placeholder="UF-123456"
                                                                className={
                                                                    inputClasses
                                                                }
                                                                value={
                                                                    formData.crc
                                                                }
                                                                onChange={(e) =>
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            crc: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <label
                                                            className={
                                                                labelClasses
                                                            }
                                                        >
                                                            CNPJ Secundário
                                                        </label>
                                                        <div className="relative">
                                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                            <input
                                                                placeholder="00.000/0001-00"
                                                                className={cn(
                                                                    inputClasses,
                                                                    "opacity-50",
                                                                )}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className={labelClasses}>
                                                E-mail de Acesso
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    type="email"
                                                    placeholder="contato@webcontabil.com"
                                                    className={inputClasses}
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className={labelClasses}>
                                                Sua Senha
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className={inputClasses}
                                                    value={formData.password}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            password:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:bg-brand-light transition-all shadow-xl shadow-brand/40 active:scale-[0.98] mt-4"
                            >
                                {mode === "LOGIN"
                                    ? "Autenticar"
                                    : "Cadastrar agora"}
                            </button>
                        </form>

                        <div className="text-center pt-2">
                            <button
                                onClick={() =>
                                    setMode(
                                        mode === "LOGIN" ? "REGISTER" : "LOGIN",
                                    )
                                }
                                className="text-xs font-bold text-brand hover:text-brand-light transition-colors uppercase tracking-widest"
                            >
                                {mode === "LOGIN"
                                    ? "Ainda não é membro?"
                                    : "Já possui credenciais?"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function RoleTab({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 w-full p-3 rounded-2xl text-xs font-bold border-2 transition-all group",
                active
                    ? "bg-brand/10 border-brand/50 text-white shadow-lg shadow-brand/10"
                    : "bg-white/5 border-transparent text-white/30 hover:bg-white/10",
            )}
        >
            <div
                className={cn(
                    "p-2 rounded-xl transition-colors",
                    active
                        ? "bg-brand text-white"
                        : "bg-white/5 text-white/20 group-hover:text-white/40",
                )}
            >
                {icon}
            </div>
            {label}
        </button>
    );
}
