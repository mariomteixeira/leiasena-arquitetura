"use client";

import { useState, type FormEvent } from "react";
import { copy } from "../_shared/content";

// Validation logic mirrors app/_components/contact-form.tsx; same /api/contact endpoint.
function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function isPhoneComplete(value: string): boolean {
    return value.replace(/\D/g, "").length === 11;
}
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type State = "idle" | "valid" | "error";

export default function CinemaForm() {
    const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipoProjeto: "" });
    const [touched, setTouched] = useState({ nome: false, telefone: false, email: false, tipoProjeto: false });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const nome: State = touched.nome && form.nome.trim().length > 0 ? "valid" : "idle";
    const telefone: State =
        touched.telefone && form.telefone.length > 0
            ? isPhoneComplete(form.telefone)
                ? "valid"
                : "error"
            : "idle";
    const email: State =
        touched.email && form.email.length > 0 ? (isValidEmail(form.email) ? "valid" : "error") : "idle";
    const tipo: State = touched.tipoProjeto && form.tipoProjeto.length > 0 ? "valid" : "idle";

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!isPhoneComplete(form.telefone) || !isValidEmail(form.email)) {
            setTouched({ nome: true, telefone: true, email: true, tipoProjeto: true });
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus("success");
                setForm({ nome: "", telefone: "", email: "", tipoProjeto: "" });
                setTouched({ nome: false, telefone: false, email: false, tipoProjeto: false });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="cin-form" noValidate>
            <h3>{copy.formTitle}</h3>

            <div className="cin-field">
                <label htmlFor="cin-nome">Nome</label>
                <input
                    id="cin-nome"
                    className="cin-input"
                    data-state={nome}
                    type="text"
                    autoComplete="name"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    onBlur={() => setTouched({ ...touched, nome: true })}
                />
            </div>

            <div className="cin-field">
                <label htmlFor="cin-tel">Telefone</label>
                <input
                    id="cin-tel"
                    className="cin-input"
                    data-state={telefone}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    required
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                    onBlur={() => setTouched({ ...touched, telefone: true })}
                    aria-invalid={telefone === "error"}
                    aria-describedby={telefone === "error" ? "cin-tel-err" : undefined}
                />
                {telefone === "error" && (
                    <p id="cin-tel-err" className="cin-error">
                        Telefone incompleto — (XX) XXXXX-XXXX
                    </p>
                )}
            </div>

            <div className="cin-field">
                <label htmlFor="cin-email">Email</label>
                <input
                    id="cin-email"
                    className="cin-input"
                    data-state={email}
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    aria-invalid={email === "error"}
                    aria-describedby={email === "error" ? "cin-email-err" : undefined}
                />
                {email === "error" && (
                    <p id="cin-email-err" className="cin-error">
                        Email inválido
                    </p>
                )}
            </div>

            <div className="cin-field">
                <label htmlFor="cin-tipo">Tipo de projeto</label>
                <select
                    id="cin-tipo"
                    className="cin-input cin-select"
                    data-state={tipo}
                    required
                    value={form.tipoProjeto}
                    onChange={(e) => {
                        setForm({ ...form, tipoProjeto: e.target.value });
                        setTouched({ ...touched, tipoProjeto: true });
                    }}
                >
                    <option value="" disabled>
                        Selecionar
                    </option>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Institucional">Institucional</option>
                </select>
            </div>

            <div className="cin-form-foot">
                <button type="submit" className="cin-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Enviando" : "Enviar"}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 8h12M9 3l5 5-5 5" />
                    </svg>
                </button>
                {status === "success" && (
                    <p className="cin-status" role="status">
                        Mensagem enviada.
                    </p>
                )}
                {status === "error" && (
                    <p className="cin-status" role="status">
                        Erro ao enviar. Tente novamente.
                    </p>
                )}
            </div>
        </form>
    );
}
