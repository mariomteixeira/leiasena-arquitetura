'use client';

import { useState, FormEvent } from "react";

export default function ContactForm() {
    const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipoProjeto: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
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
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm sm:text-base uppercase tracking-widest text-foreground/50">
                Deixe suas informações e entraremos em contato
            </h3>

            <input
                type="text"
                placeholder="Nome"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground/60 outline-none py-2 text-base sm:text-lg font-light text-foreground placeholder:text-foreground/30 transition-colors duration-300"
            />

            <input
                type="tel"
                placeholder="Telefone"
                required
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground/60 outline-none py-2 text-base sm:text-lg font-light text-foreground placeholder:text-foreground/30 transition-colors duration-300"
            />

            <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground/60 outline-none py-2 text-base sm:text-lg font-light text-foreground placeholder:text-foreground/30 transition-colors duration-300"
            />

            <select
                required
                value={form.tipoProjeto}
                onChange={(e) => setForm({ ...form, tipoProjeto: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground/60 outline-none py-2 text-base sm:text-lg font-light text-foreground transition-colors duration-300"
            >
                <option value="" disabled>Tipo de Projeto</option>
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Corporativo">Corporativo</option>
            </select>

            <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 px-8 py-2.5 bg-foreground text-background text-sm sm:text-base uppercase tracking-widest font-light hover:bg-foreground/80 transition-colors duration-300 disabled:opacity-50"
            >
                {status === "sending" ? "Enviando..." : "Enviar"}
            </button>

            {status === "success" && (
                <p className="text-sm text-green-700 font-light">Mensagem enviada com sucesso!</p>
            )}
            {status === "error" && (
                <p className="text-sm text-red-700 font-light">Erro ao enviar. Tente novamente.</p>
            )}
        </form>
    );
}
