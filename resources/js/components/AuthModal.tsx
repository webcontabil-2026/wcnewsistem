import { type FormEvent, type ReactNode, useState } from "react";
import { motion } from "motion/react";
import {
    Briefcase,
    FileText,
    Fingerprint,
    KeyRound,
    Landmark,
    Lock,
    Mail,
    ShieldCheck,
    User,
    X,
} from "lucide-react";

import { ApiError, apiRequest } from "../lib/api";
import type { User as UserType } from "../types";

interface AuthModalProps {
    mode: "LOGIN" | "REGISTER";
    onClose: () => void;
    onLogin: (user: UserType) => void;
    adminOnly?: boolean;
}

type PublicRole = "CLIENT" | "ACCOUNTANT";

const formatarCpf = (valor: string) =>
    valor
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const formatarCnpj = (valor: string) =>
    valor
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

const formatarCrc = (valor: string) =>
    valor.toUpperCase().replace(/[^A-Z0-9./-]/g, "").slice(0, 20);

export default function AuthModal({
    mode: initialMode,
    onClose,
    onLogin,
    adminOnly = false,
}: AuthModalProps) {
    const [mode, setMode] = useState<"LOGIN" | "REGISTER">(
        adminOnly ? "LOGIN" : initialMode,
    );
    const [role, setRole] = useState<PublicRole>("CLIENT");
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
        accessKey: "",
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setAuthError("");
        setIsSubmitting(true);

        try {
            const endpoint = adminOnly
                ? "/auth/admin-login"
                : mode === "LOGIN"
                  ? "/auth/login"
                  : "/auth/register";

            const requestBody = adminOnly
                ? {
                      email: formData.email,
                      password: formData.password,
                      accessKey: formData.accessKey,
                  }
                : mode === "LOGIN"
                  ? {
                        email: formData.email,
                        password: formData.password,
                    }
                  : {
                        name: formData.nome,
                        email: formData.email,
                        password: formData.password,
                        role,
                        razaoSocial:
                            role === "CLIENT"
                                ? formData.razaoSocial || null
                                : null,
                        cpf: formData.cpf || null,
                        cnpj:
                            role === "CLIENT" ? formData.cnpj || null : null,
                        crc:
                            role === "ACCOUNTANT" ? formData.crc || null : null,
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
            setAuthError(
                error instanceof ApiError
                    ? Object.values(error.errors).flat()[0] ?? error.message
                    : "Não foi possível conectar ao servidor. Tente novamente.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses =
        "wc-auth-field w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none";

    return (
        <div className="wc-auth-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                className="wc-auth-dialog max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[28px] border sm:rounded-[36px]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="wc-auth-title"
            >
                <div className="wc-auth-content relative p-5 sm:p-8 md:p-10">
                    <button
                        onClick={onClose}
                        className="wc-auth-close absolute right-4 top-4 rounded-full p-2 sm:right-6 sm:top-6"
                        type="button"
                        aria-label="Fechar autenticação"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="mx-auto max-w-xl">
                        <div className="pr-12">
                            <p className="wc-auth-label mb-2 text-brand">
                                {adminOnly
                                    ? "Acesso administrativo"
                                    : mode === "REGISTER"
                                      ? "Escolha seu perfil"
                                      : "Área segura"}
                            </p>
                            <h1
                                id="wc-auth-title"
                                className="wc-auth-title text-3xl font-extrabold tracking-tight"
                            >
                                {adminOnly
                                    ? "Administração WebContabil"
                                    : mode === "LOGIN"
                                      ? "Acessar sua conta"
                                      : "Criar nova conta"}
                            </h1>
                            <p className="wc-auth-subtitle mt-2 text-sm font-medium">
                                {adminOnly
                                    ? "Entrada exclusiva para administradores autorizados."
                                    : mode === "LOGIN"
                                      ? "Entre com seu e-mail e senha cadastrados."
                                      : "Defina primeiro se a conta é de cliente ou contador."}
                            </p>
                        </div>

                        {mode === "REGISTER" && !adminOnly && (
                            <div
                                className="wc-auth-segment mt-7 grid grid-cols-2 gap-1 rounded-2xl border p-1.5"
                                aria-label="Tipo de cadastro"
                            >
                                <RoleOption
                                    active={role === "CLIENT"}
                                    onClick={() => setRole("CLIENT")}
                                    icon={<User className="h-4 w-4" />}
                                    label="Cliente"
                                />
                                <RoleOption
                                    active={role === "ACCOUNTANT"}
                                    onClick={() => setRole("ACCOUNTANT")}
                                    icon={<Briefcase className="h-4 w-4" />}
                                    label="Contador"
                                />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            {mode === "REGISTER" && !adminOnly && (
                                <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Nome completo">
                                            <User className="wc-auth-field-icon" />
                                            <input
                                                required
                                                minLength={3}
                                                maxLength={100}
                                                autoComplete="name"
                                                placeholder="Seu nome"
                                                className={inputClasses}
                                                value={formData.nome}
                                                onChange={(event) =>
                                                    setFormData((current) => ({
                                                        ...current,
                                                        nome: event.target.value,
                                                    }))
                                                }
                                            />
                                            <CharacterLimit current={formData.nome.length} max={100} />
                                        </Field>

                                        <Field label={role === "CLIENT" ? "CPF" : "CPF profissional"}>
                                            <Fingerprint className="wc-auth-field-icon" />
                                            <input
                                                inputMode="numeric"
                                                maxLength={14}
                                                autoComplete="off"
                                                placeholder="000.000.000-00"
                                                className={inputClasses}
                                                value={formData.cpf}
                                                onChange={(event) =>
                                                    setFormData((current) => ({
                                                        ...current,
                                                        cpf: formatarCpf(event.target.value),
                                                    }))
                                                }
                                            />
                                        </Field>
                                    </div>

                                    {role === "CLIENT" ? (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field label="Razão social (opcional)">
                                                <Landmark className="wc-auth-field-icon" />
                                                <input
                                                    maxLength={150}
                                                    placeholder="Nome da empresa"
                                                    className={inputClasses}
                                                    value={formData.razaoSocial}
                                                    onChange={(event) =>
                                                        setFormData((current) => ({
                                                            ...current,
                                                            razaoSocial: event.target.value,
                                                        }))
                                                    }
                                                />
                                                <CharacterLimit current={formData.razaoSocial.length} max={150} />
                                            </Field>
                                            <Field label="CNPJ (se houver empresa)">
                                                <FileText className="wc-auth-field-icon" />
                                                <input
                                                    inputMode="numeric"
                                                    maxLength={18}
                                                    placeholder="00.000.000/0000-00"
                                                    className={inputClasses}
                                                    value={formData.cnpj}
                                                    onChange={(event) =>
                                                        setFormData((current) => ({
                                                            ...current,
                                                            cnpj: formatarCnpj(event.target.value),
                                                        }))
                                                    }
                                                />
                                            </Field>
                                        </div>
                                    ) : (
                                        <Field label="CRC (registro profissional)">
                                            <ShieldCheck className="wc-auth-field-icon" />
                                            <input
                                                required
                                                maxLength={20}
                                                autoCapitalize="characters"
                                                placeholder="UF-123456/O-0"
                                                className={inputClasses}
                                                value={formData.crc}
                                                onChange={(event) =>
                                                    setFormData((current) => ({
                                                        ...current,
                                                        crc: formatarCrc(event.target.value),
                                                    }))
                                                }
                                            />
                                            <CharacterLimit current={formData.crc.length} max={20} />
                                        </Field>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="E-mail de acesso">
                                    <Mail className="wc-auth-field-icon" />
                                    <input
                                        required
                                        type="email"
                                        maxLength={254}
                                        autoComplete="email"
                                        placeholder="voce@exemplo.com"
                                        className={inputClasses}
                                        value={formData.email}
                                        onChange={(event) =>
                                            setFormData((current) => ({
                                                ...current,
                                                email: event.target.value,
                                            }))
                                        }
                                    />
                                </Field>
                                <Field label="Senha">
                                    <Lock className="wc-auth-field-icon" />
                                    <input
                                        required
                                        type="password"
                                        minLength={8}
                                        maxLength={72}
                                        autoComplete={mode === "LOGIN" ? "current-password" : "new-password"}
                                        placeholder="Mínimo de 8 caracteres"
                                        className={inputClasses}
                                        value={formData.password}
                                        onChange={(event) =>
                                            setFormData((current) => ({
                                                ...current,
                                                password: event.target.value,
                                            }))
                                        }
                                    />
                                </Field>
                            </div>

                            {adminOnly && (
                                <Field label="Chave administrativa">
                                    <KeyRound className="wc-auth-field-icon" />
                                    <input
                                        required
                                        type="password"
                                        maxLength={128}
                                        autoComplete="off"
                                        placeholder="Chave definida no servidor"
                                        className={inputClasses}
                                        value={formData.accessKey}
                                        onChange={(event) =>
                                            setFormData((current) => ({
                                                ...current,
                                                accessKey: event.target.value,
                                            }))
                                        }
                                    />
                                </Field>
                            )}

                            {authError && (
                                <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-semibold text-red-500">
                                    {authError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="wc-auth-primary w-full rounded-2xl py-4 font-bold transition-colors disabled:cursor-wait disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Aguarde..."
                                    : adminOnly
                                      ? "Entrar na administração"
                                      : mode === "LOGIN"
                                        ? "Entrar"
                                        : `Criar conta de ${role === "CLIENT" ? "cliente" : "contador"}`}
                            </button>
                        </form>

                        {!adminOnly && (
                            <div className="pt-6 text-center">
                                <button
                                    onClick={() => {
                                        setMode((current) => current === "LOGIN" ? "REGISTER" : "LOGIN");
                                        setAuthError("");
                                    }}
                                    className="wc-auth-switch text-xs font-bold uppercase tracking-widest"
                                    type="button"
                                >
                                    {mode === "LOGIN" ? "Criar uma conta" : "Já tenho uma conta"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function RoleOption({ active, onClick, icon, label }: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}) {
    return (
        <button type="button" onClick={onClick} data-active={active} className="wc-auth-role flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors">
            <span className="wc-auth-role-icon rounded-lg p-1.5">{icon}</span>
            {label}
        </button>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="relative block space-y-1">
            <span className="wc-auth-label block text-[10px] font-bold uppercase tracking-[0.18em]">{label}</span>
            <span className="relative block">{children}</span>
        </label>
    );
}

function CharacterLimit({ current, max }: { current: number; max: number }) {
    return <span className="wc-auth-limit mt-1 block text-right text-[10px] font-semibold">{current}/{max}</span>;
}
