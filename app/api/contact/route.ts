import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { nome, telefone, email, tipoProjeto } = await req.json();

        if (!nome || !telefone || !email || !tipoProjeto) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios." },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Site Leia Sena" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            replyTo: email,
            subject: `Novo contato - ${tipoProjeto} - ${nome}`,
            html: `
                <h2>Novo contato pelo site</h2>
                <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
                    <tr><td style="padding:8px 16px;font-weight:bold;">Nome</td><td style="padding:8px 16px;">${nome}</td></tr>
                    <tr><td style="padding:8px 16px;font-weight:bold;">Telefone</td><td style="padding:8px 16px;">${telefone}</td></tr>
                    <tr><td style="padding:8px 16px;font-weight:bold;">Email</td><td style="padding:8px 16px;">${email}</td></tr>
                    <tr><td style="padding:8px 16px;font-weight:bold;">Tipo de Projeto</td><td style="padding:8px 16px;">${tipoProjeto}</td></tr>
                </table>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return NextResponse.json(
            { error: "Erro ao enviar mensagem. Tente novamente." },
            { status: 500 }
        );
    }
}
