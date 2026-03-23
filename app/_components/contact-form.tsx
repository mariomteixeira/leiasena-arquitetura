'use client';

import { useState, FormEvent } from "react";

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

export default function ContactForm() {
    const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipoProjeto: "" });
    const [touched, setTouched] = useState({ nome: false, telefone: false, email: false, tipoProjeto: false });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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

    const inputClass = "w-full bg-white/60 border border-foreground/10 focus:border-foreground/40 outline-none px-4 py-3 text-base sm:text-lg font-light text-foreground placeholder:text-foreground/30 rounded-lg transition-all duration-300";
    const errorInputClass = "w-full bg-white/60 border border-red-400 focus:border-red-500 outline-none px-4 py-3 text-base sm:text-lg font-light text-foreground placeholder:text-foreground/30 rounded-lg transition-all duration-300";
    const validInputClass = "w-full bg-white/60 border border-green-400 focus:border-green-500 outline-none px-4 py-3 text-base sm:text-lg font-light text-foreground placeholder:text-foreground/30 rounded-lg transition-all duration-300";

    return (
        <form onSubmit={handleSubmit} className="bg-foreground/3 border border-foreground/10 rounded-xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base sm:text-lg uppercase tracking-widest text-foreground/50">
                Deixe suas informações e entraremos em contato:
            </h3>

            <div>
                <input
                    type="text"
                    placeholder="Nome"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    onBlur={() => setTouched({ ...touched, nome: true })}
                    className={nomeValid ? validInputClass : inputClass}
                />
            </div>

            <div>
                <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    required
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                    onBlur={() => setTouched({ ...touched, telefone: true })}
                    className={phoneError ? errorInputClass : phoneValid ? validInputClass : inputClass}
                />
                {phoneError && (
                    <p className="mt-1.5 text-sm text-red-600 font-light">Telefone incompleto. Use o formato (XX) XXXXX-XXXX</p>
                )}
            </div>

            <div>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className={emailError ? errorInputClass : emailValid ? validInputClass : inputClass}
                />
                {emailError && (
                    <p className="mt-1.5 text-sm text-red-600 font-light">Email inválido.</p>
                )}
            </div>

            <div>
                <select
                    required
                    value={form.tipoProjeto}
                    onChange={(e) => { setForm({ ...form, tipoProjeto: e.target.value }); setTouched({ ...touched, tipoProjeto: true }); }}
                    className={`${tipoValid ? validInputClass : inputClass} ${!form.tipoProjeto ? "text-foreground/30" : ""}`}
                >
                    <option value="" disabled>Tipo de Projeto</option>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Institucional">Institucional</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={status === "sending"}
                className="w-full mt-2 px-8 py-3 bg-foreground text-background text-sm sm:text-base uppercase tracking-widest font-light rounded-lg hover:bg-foreground/80 transition-colors duration-300 disabled:opacity-50"
            >
                {status === "sending" ? "Enviando..." : "Enviar"}
            </button>

            {status === "success" && (
                <p className="text-sm text-green-700 font-light text-center">Mensagem enviada com sucesso!</p>
            )}
            {status === "error" && (
                <p className="text-sm text-red-700 font-light text-center">Erro ao enviar. Tente novamente.</p>
            )}
        </form>
    );
}
