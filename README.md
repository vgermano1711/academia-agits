# Academia Agits — Site Institucional

> Site institucional em WordPress para uma academia, hospedado na Hostinger com deploy contínuo via Git.

---

## Sobre o Projeto

Site institucional da Academia Agits. O conteúdo e o layout são gerenciados via WordPress (painel de administração), com plugins fornecidos pela Hostinger.

Acesse: [academiaagits.com.br](https://academiaagits.com.br)

---

## Sobre este repositório

Este repositório é o destino do deploy contínuo configurado na Hostinger: a cada push na branch `main`, a Hostinger sincroniza o servidor com o conteúdo deste repositório.

Por isso, o repositório contém a instalação completa do WordPress (núcleo, temas padrão e plugins da Hostinger) — não é código escrito neste projeto. Esses diretórios estão marcados como vendorizados em `.gitattributes`, para que as estatísticas de linguagem do GitHub não atribuam esse código a este repositório.

```
academia-agits/
├── wp-admin/, wp-includes/          # núcleo do WordPress (vendorizado)
├── wp-content/themes/               # temas padrão do WordPress (vendorizado)
├── wp-content/plugins/              # plugins da Hostinger + litespeed-cache (vendorizado)
├── .htaccess                        # configuração do servidor
├── .gitattributes                   # marca o núcleo/plugins/temas como vendorizados
└── .gitignore                       # exclui wp-config.php (credenciais) do controle de versão
```

O conteúdo real do site (páginas, textos, imagens, customizações visuais) é gerenciado pelo WordPress e vive no banco de dados — não neste repositório.

---

## Infraestrutura

| Camada | Detalhe |
|---|---|
| CMS | WordPress |
| Hospedagem | Hostinger (hospedagem compartilhada) |
| Deploy | Contínuo via Git (push na `main` sincroniza o servidor) |
| Cache | LiteSpeed Cache |

---

## Segurança

O arquivo `wp-config.php` (credenciais de banco de dados e chaves secretas do WordPress) foi removido do controle de versão e do histórico do repositório — anteriormente estava commitado e exposto publicamente. O arquivo permanece no servidor, fora do Git, conforme `.gitignore`.

---

## Autor

**Victor Germano** — Desenvolvedor Web Full Stack, IA & Automação

- Portfólio: [vgermano1711.github.io/portfolio-germano-dev](https://vgermano1711.github.io/portfolio-germano-dev)
- E-mail: dev.germanoo@gmail.com
- LinkedIn: [linkedin.com/in/victor-germano-65787b2b1](https://linkedin.com/in/victor-germano-65787b2b1)
