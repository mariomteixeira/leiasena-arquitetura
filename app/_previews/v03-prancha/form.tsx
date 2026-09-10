"use client";

/**
 * Same validation and endpoint as app/_components/contact-form.tsx,
 * re-marked up as a title-block form so it stays inside this world's palette
 * (the shared component's red/green states are outside the pinned palette).
 */

import { useState, type FormEvent } from "react";
import { copy } from "./data";
import { AlertIcon, CheckIcon } from "./icons";
import { ArrowIcon } from "./sheet";

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

export default function PranchaForm() {
    const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipoProjeto: "" });
    const [touched, setTouched] = useState({ nome: false, telefone: false, email: false, tipoProjeto: false });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const phoneError = touched.telefone && form.telefone.length > 0 && !isPhoneComplete(form.telefone);
    const emailError = touched.email && form.email.length > 0 && !isValidEmail(form.email);

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
        <div className="pr-form-frame">
            <div className="pr-form-head pr-mono">{copy.formTitle}</div>
            <form className="pr-form" onSubmit={handleSubmit} noValidate>
                <div className="pr-field">
                    <label className="pr-mono" htmlFor="pr-nome">
                        Nome
                    </label>
                    <input
                        id="pr-nome"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Seu nome"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        onBlur={() => setTouched({ ...touched, nome: true })}
                    />
                </div>

                <div className={`pr-field${phoneError ? " is-bad" : ""}`}>
                    <label className="pr-mono" htmlFor="pr-tel">
                        Telefone
                    </label>
                    <input
                        id="pr-tel"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        placeholder="(00) 00000-0000"
                        aria-invalid={phoneError || undefined}
                        aria-describedby={phoneError ? "pr-tel-msg" : undefined}
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                        onBlur={() => setTouched({ ...touched, telefone: true })}
                    />
                    {phoneError && (
                        <p className="pr-field-msg pr-mono" id="pr-tel-msg">
                            <AlertIcon />
                            Telefone incompleto — (XX) XXXXX-XXXX
                        </p>
                    )}
                </div>

                <div className={`pr-field${emailError ? " is-bad" : ""}`}>
                    <label className="pr-mono" htmlFor="pr-email">
                        E-mail
                    </label>
                    <input
                        id="pr-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="voce@email.com"
                        aria-invalid={emailError || undefined}
                        aria-describedby={emailError ? "pr-email-msg" : undefined}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        onBlur={() => setTouched({ ...touched, email: true })}
                    />
                    {emailError && (
                        <p className="pr-field-msg pr-mono" id="pr-email-msg">
                            <AlertIcon />
                            E-mail inválido
                        </p>
                    )}
                </div>

                <div className="pr-field">
                    <label className="pr-mono" htmlFor="pr-tipo">
                        Tipo de projeto
                    </label>
                    <select
                        id="pr-tipo"
                        required
                        value={form.tipoProjeto}
                        onChange={(e) => {
                            setForm({ ...form, tipoProjeto: e.target.value });
                            setTouched({ ...touched, tipoProjeto: true });
                        }}
                    >
                        <option value="" disabled>
                            Selecione
                        </option>
                        <option value="Residencial">Residencial</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Institucional">Institucional</option>
                    </select>
                </div>

                <button type="submit" className="pr-btn pr-btn-fill pr-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Enviando" : "Enviar"}
                    <ArrowIcon />
                </button>

                <p className="pr-form-note pr-mono" role="status">
                    {status === "success" && (
                        <>
                            <CheckIcon /> Mensagem enviada
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <AlertIcon /> Erro ao enviar — tente novamente
                        </>
                    )}
                </p>
            </form>
        </div>
    );
}
