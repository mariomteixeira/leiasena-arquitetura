"use client";

/**
 * Mesma lógica de validação e mesmo endpoint de app/_components/contact-form.tsx,
 * com a marcação e os estados desenhados para o mundo "Marquise · Lente".
 */
import { useState, type FormEvent } from "react";
import { copy } from "../_shared/content";
import { IconAlert, IconArrow, IconCheck, IconChevron } from "./icons";

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

type State = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
    const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipoProjeto: "" });
    const [touched, setTouched] = useState({ nome: false, telefone: false, email: false, tipoProjeto: false });
    const [status, setStatus] = useState<State>("idle");

    const nomeValid = touched.nome && form.nome.trim().length > 0;
    const phoneError = touched.telefone && form.telefone.length > 0 && !isPhoneComplete(form.telefone);
    const phoneValid = touched.telefone && isPhoneComplete(form.telefone);
    const emailError = touched.email && form.email.length > 0 && !isValidEmail(form.email);
    const emailValid = touched.email && form.email.length > 0 && isValidEmail(form.email);
    const tipoValid = touched.tipoProjeto && form.tipoProjeto.length > 0;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!isPhoneComplete(form.telefone) || !isValidEmail(form.email)) return;
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

    const state = (valid: boolean, error: boolean) => (error ? "error" : valid ? "valid" : undefined);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <p className="max-w-[34ch] font-serif text-[1.35rem] leading-[1.3] text-navy sm:text-[1.55rem]">
                {copy.formTitle}
            </p>

            <div className="ln-field">
                <label htmlFor="ln-nome" className="sr-only">
                    Nome
                </label>
                <input
                    id="ln-nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Nome"
                    required
                    value={form.nome}
                    data-state={state(nomeValid, false)}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    onBlur={() => setTouched({ ...touched, nome: true })}
                    className="ln-input"
                />
            </div>

            <div className="ln-field">
                <label htmlFor="ln-tel" className="sr-only">
                    Telefone
                </label>
                <input
                    id="ln-tel"
                    name="telefone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(00) 00000-0000"
                    required
                    value={form.telefone}
                    aria-invalid={phoneError}
                    aria-describedby={phoneError ? "ln-tel-erro" : undefined}
                    data-state={state(phoneValid, phoneError)}
                    onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                    onBlur={() => setTouched({ ...touched, telefone: true })}
                    className="ln-input"
                />
                {phoneError && (
                    <p id="ln-tel-erro" className="ln-field-note">
                        <IconAlert className="h-4 w-4 shrink-0" />
                        Telefone incompleto — use (XX) XXXXX-XXXX
                    </p>
                )}
            </div>

            <div className="ln-field">
                <label htmlFor="ln-email" className="sr-only">
                    Email
                </label>
                <input
                    id="ln-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    aria-invalid={emailError}
                    aria-describedby={emailError ? "ln-email-erro" : undefined}
                    data-state={state(emailValid, emailError)}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className="ln-input"
                />
                {emailError && (
                    <p id="ln-email-erro" className="ln-field-note">
                        <IconAlert className="h-4 w-4 shrink-0" />
                        Email inválido
                    </p>
                )}
            </div>

            <div className="ln-field">
                <label htmlFor="ln-tipo" className="sr-only">
                    Tipo de projeto
                </label>
                <select
                    id="ln-tipo"
                    name="tipoProjeto"
                    required
                    value={form.tipoProjeto}
                    data-state={state(tipoValid, false)}
                    onChange={(e) => {
                        setForm({ ...form, tipoProjeto: e.target.value });
                        setTouched({ ...touched, tipoProjeto: true });
                    }}
                    className={`ln-input ln-select ${form.tipoProjeto ? "" : "text-navy/55"}`}
                >
                    <option value="" disabled>
                        Tipo de projeto
                    </option>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Institucional">Institucional</option>
                </select>
                <IconChevron className="pointer-events-none absolute right-1 bottom-4 h-4 w-4 text-navy/60" />
            </div>

            <button
                type="submit"
                disabled={status === "sending"}
                className="ln-cta group mt-1 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-navy px-9 text-[0.8rem] font-light uppercase tracking-[0.18em] text-cream hover:bg-navy/90 disabled:opacity-60"
            >
                {status === "sending" ? "Enviando" : "Enviar"}
                <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>

            <p aria-live="polite" className="min-h-[1.25rem]">
                {status === "success" && (
                    <span className="ln-field-note">
                        <IconCheck className="h-4 w-4 shrink-0" />
                        Mensagem enviada. Em breve entro em contato.
                    </span>
                )}
                {status === "error" && (
                    <span className="ln-field-note">
                        <IconAlert className="h-4 w-4 shrink-0" />
                        Não foi possível enviar. Tente novamente.
                    </span>
                )}
            </p>
        </form>
    );
}
