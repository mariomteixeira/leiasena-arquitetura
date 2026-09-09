# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Pessoas em busca de projeto de arquitetura ou interiores (residencial e comercial), majoritariamente em Brasília-DF, que chegam pelo Instagram no celular e querem ver trabalho e falar com a arquiteta. (inferido do brief e do site)

## Product Purpose
Site de portfólio da arquiteta Léia Sena e, na rota `/bio`, hub de links estilo Linktree usado como link da bio do Instagram. Sucesso: visitante abre no celular, entende quem é, vê o portfólio e inicia contato.

## Positioning
Arquiteta e urbanista registrada no CAU, pós-graduada em Design de Interiores e Experiência do Ambiente (IPOG). Produz as imagens 3D que mostram o resultado antes da obra começar. Atende residencial e comercial.

## Operating Context
- Uso quase exclusivo em celular: iPhone 14+ e Galaxy S23+ (viewport 390×844 e 360×780).
- `/bio` é destino de link de bio no Instagram; tela única, sem navegação do site.

## Capabilities and Constraints
- Next.js 16 (App Router), React 19, Tailwind 4, Lenis smooth scroll no layout raiz.
- Links da `/bio` obrigatórios: Instagram, Portfólio, Site, Fale Comigo. Destinos ainda não definidos (placeholders `#`).
- Texto fixo da bio (confirmado no brief): "Registrada no CAU, com pós-graduação em Design de Interiores e Experiência do Ambiente (IPOG). Realizo projetos tanto residenciais quanto comerciais. Produzo as imagens 3D que mostram o resultado antes da sua obra começar."
- Título: "Arquiteta e urbanista".

## Brand Commitments
- Nome: Léia Sena Arquitetura.
- Logo pinada para `/bio`: `public/assets/logo/svg/svgs/VERTICAL - azul.svg` (versão só-vetor derivada: `public/assets/logo/svg/svgs/vertical-azul.svg`). Azul da marca: `#313C59`.
- Foto pinada para `/bio`, circular: `public/assets/images/about.jpg` (P&B).
- Site atual: fundo `#DDD9CE`, tipografia Geist Sans/Mono, tom minimalista.

## Evidence on Hand
- Projetos reais em `app/_lib/projects.ts` e `public/assets/projects/`.
- Contato real: WhatsApp (61) 99574-7603, contato@arqleiasena.com.br, Instagram @arqleiasena, Brasília-DF.
- Sem depoimentos, prêmios ou métricas disponíveis. Não inventar.

## Product Principles
- Celular primeiro; toque confortável (alvos ≥ 56px).
- Um único gesto: ver e tocar. Nada de explicar a interface.
- Fidelidade à marca (logo, azul, foto P&B) em qualquer variante visual.
- Sem claims inventados.
