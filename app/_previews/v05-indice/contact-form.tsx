"use client";

import { useId, useState, type FormEvent } from "react";
import { copy } from "../_shared/content";
import { ArrowIcon, CheckIcon, ChevronIcon } from "./icons";

/* Validation logic mirrors app/_components/contact-form.tsx; same endpoint. */

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

type FieldState = "idle" | "valid" | "invalid";

export default function ContactForm() {
    const id = useId();
    const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipoProjeto: "" });
    const [touched, setTouched] = useState({ nome: false, telefone: false, email: false, tipoProjeto: false });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const nome: FieldState = touched.nome && form.nome.trim().length > 0 ? "valid" : "idle";
    const telefone: FieldState =
        touched.telefone && form.telefone.length > 0
            ? isPhoneComplete(form.telefone) ? "valid" : "invalid"
            : "idle";
    const email: FieldState =
        touched.email && form.email.length > 0
            ? isValidEmail(form.email) ? "valid" : "invalid"
            : "idle";
    const tipo: FieldState = touched.tipoProjeto && form.tipoProjeto.length > 0 ? "valid" : "idle";

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

    return (
        <>
            <h3>{copy.formTitle}</h3>
            <form onSubmit={handleSubmit} noValidate>
                <div className="field" data-state={nome}>
                    <label htmlFor={`${id}-nome`}>Nome</label>
                    <input
                        id={`${id}-nome`}
                        type="text"
                        name="nome"
                        autoComplete="name"
                        required
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        onBlur={() => setTouched({ ...touched, nome: true })}
                    />
                    {nome === "valid" && <CheckIcon className="ic" />}
                </div>

                <div className="field" data-state={telefone}>
                    <label htmlFor={`${id}-tel`}>Telefone</label>
                    <input
                        id={`${id}-tel`}
                        type="tel"
                        name="telefone"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="(00) 00000-0000"
                        required
                        aria-invalid={telefone === "invalid" || undefined}
                        aria-describedby={telefone === "invalid" ? `${id}-tel-err` : undefined}
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                        onBlur={() => setTouched({ ...touched, telefone: true })}
                    />
                    {telefone === "valid" && <CheckIcon className="ic" />}
                    {telefone === "invalid" && (
                        <p className="err" id={`${id}-tel-err`}>Telefone incompleto. Use o formato (XX) XXXXX-XXXX</p>
                    )}
                </div>

                <div className="field" data-state={email}>
                    <label htmlFor={`${id}-email`}>E-mail</label>
                    <input
                        id={`${id}-email`}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        aria-invalid={email === "invalid" || undefined}
                        aria-describedby={email === "invalid" ? `${id}-email-err` : undefined}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        onBlur={() => setTouched({ ...touched, email: true })}
                    />
                    {email === "valid" && <CheckIcon className="ic" />}
                    {email === "invalid" && (
                        <p className="err" id={`${id}-email-err`}>E-mail inválido.</p>
                    )}
                </div>

                <div className="field" data-state={tipo}>
                    <label htmlFor={`${id}-tipo`}>Tipo de projeto</label>
                    <select
                        id={`${id}-tipo`}
                        name="tipoProjeto"
                        required
                        className={form.tipoProjeto ? undefined : "empty"}
                        value={form.tipoProjeto}
                        onChange={(e) => {
                            setForm({ ...form, tipoProjeto: e.target.value });
                            setTouched({ ...touched, tipoProjeto: true });
                        }}
                    >
                        <option value="" disabled>Selecionar</option>
                        <option value="Residencial">Residencial</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Institucional">Institucional</option>
                    </select>
                    <ChevronIcon className="ic chev" />
                </div>

                <button type="submit" className="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Enviando…" : "Enviar"}
                    <ArrowIcon />
                </button>

                {status === "success" && <p className="msg" role="status">Mensagem enviada com sucesso!</p>}
                {status === "error" && <p className="msg" role="alert">Erro ao enviar. Tente novamente.</p>}
            </form>
        </>
    );
}
