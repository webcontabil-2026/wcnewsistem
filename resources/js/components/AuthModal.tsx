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
import { ApiError, apiRequest } from "../lib/api";
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState("");
    const [formData, setFormData] = useState({
        nome: "",
        razaoSocial: "",
        email: "",
        password: "",
        cpf: "",
        cnpj: "",
        crc: "",
    });

    /*
     * Envia o cadastro ou login para o Laravel.
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setAuthError("");

        /*
         * Administradores não podem ser criados pelo formulário público.
         * Contas administrativas existentes usam o mesmo login protegido.
         */
        if (role === "ADMIN" && mode === "REGISTER") {
            setAuthError(
                "Contas administrativas são criadas somente pela equipe responsável. Se já possui uma conta, escolha entrar.",
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const endpoint =
                mode === "LOGIN" ? "/auth/login" : "/auth/register";

            const requestBody =
                mode === "LOGIN"
                    ? {
                          email: formData.email,
                          password: formData.password,
                      }
                    : {
                          name: formData.nome,
                          email: formData.email,
                          password: formData.password,
                          role,
                          razaoSocial: formData.razaoSocial || null,
                          cpf: formData.cpf || null,
                          cnpj: formData.cnpj || null,
                          crc: formData.crc || null,
                      };

            const response = await apiRequest<{
                message: string;
                user: UserType;
            }>(endpoint, {
                method: "POST",
                body: JSON.stringify(requestBody),
            });

            onLogin(response.user);
        } catch (error) {
            if (error instanceof ApiError) {
                const firstValidationError = Object.values(
                    error.errors,
                ).flat()[0];

                setAuthError(firstValidationError ?? error.message);
            } else {
                setAuthError(
                    "Não foi possível conectar ao servidor. Tente novamente.",
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses =
        "wc-auth-field w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand/50 focus:border-brand/50 outline-none transition-all placeholder:text-white/20 text-white text-sm backdrop-blur-sm";
    const labelClasses =
        "wc-auth-label block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5 ml-1";

    return (
        <div className="wc-auth-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="wc-auth-dialog flex max-h-[calc(100dvh-2rem)] min-h-0 w-full max-w-2xl flex-col overflow-y-auto rounded-[28px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl md:min-h-[600px] md:flex-row md:overflow-hidden md:rounded-[40px]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="wc-auth-title"
            >
                <div className="wc-auth-rail flex w-full flex-col gap-3 border-r border-white/10 bg-white/5 p-5 md:w-56 md:gap-4 md:p-8">
                    <h3 className="wc-auth-rail-title text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
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
                    <div className="wc-auth-quote mt-auto hidden pt-6 text-[10px] italic leading-relaxed text-white/30 md:block">
                        "A ponte inteligente entre o contador e o cliente."
                    </div>
                </div>

                <div className="wc-auth-content relative flex-grow p-5 sm:p-8 md:p-10">
                    <button
                        onClick={onClose}
                        className="wc-auth-close group absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-white/10 sm:right-6 sm:top-6 md:right-8 md:top-8"
                        type="button"
                        aria-label="Fechar autenticação"
                    >
                        <X className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>

                    <div className="max-w-sm mx-auto space-y-8">
                        <div className="text-center md:text-left">
                            <h2
                                id="wc-auth-title"
                                className="wc-auth-title text-3xl font-bold text-white tracking-tight"
                            >
                                {mode === "LOGIN"
                                    ? "Acesso WebContabil"
                                    : "Nova Conta"}
                            </h2>
                            <p className="wc-auth-subtitle text-sm text-white/40 mt-1 font-medium">
                                {role === "CLIENT" &&
                                    "Área Restrita do Cliente"}
                                {role === "ACCOUNTANT" &&
                                    "Portal Oficial do Contador"}
                                {role === "ADMIN" && "Validação de Sistema"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {role === "ADMIN" && mode === "REGISTER" ? (
                                <div className="rounded-2xl border border-brand/30 bg-brand/10 p-5 text-sm leading-relaxed text-white/70">
                                    Por segurança, o cadastro público de
                                    administradores é bloqueado. Alterne para
                                    “Já possui credenciais?” para entrar com
                                    uma conta administrativa existente.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mode === "REGISTER" && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                            CNPJ
                                                        </label>
                                                        <div className="relative">
                                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                            <input
                                                                placeholder="00.000/0001-00"
                                                                className={inputClasses}
                                                                value={formData.cnpj}
                                                                onChange={(e) =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        cnpj: e.target.value,
                                                                    })
                                                                }
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
                            {authError && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-400"
                                >
                                    {authError}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="wc-auth-primary mt-4 w-full rounded-2xl bg-brand py-4 font-bold text-white shadow-xl shadow-brand/40 transition-all hover:bg-brand-light active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Aguarde..."
                                    : mode === "LOGIN"
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
                                className="wc-auth-switch text-xs font-bold text-brand hover:text-brand-light transition-colors uppercase tracking-widest"
                                type="button"
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
            type="button"
            data-active={active}
            className={cn(
                "wc-auth-role flex items-center gap-3 w-full p-3 rounded-2xl text-xs font-bold border-2 transition-all group",
                active
                    ? "bg-brand/10 border-brand/50 text-white shadow-lg shadow-brand/10"
                    : "bg-white/5 border-transparent text-white/30 hover:bg-white/10",
            )}
        >
            <div
                className={cn(
                    "wc-auth-role-icon p-2 rounded-xl transition-colors",
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
