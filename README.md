# Mercadão do Victor

Projeto demonstrativo de mercado virtual feito com HTML, CSS e JavaScript puro.

## Arquivos

- `index.html` — página inicial, categorias e ofertas ilustrativas.
- `cadastro.html` — formulário de criação de conta.
- `login.html` — formulário de login.
- `css/style.css` — estilos responsivos.
- `js/app.js` — validação, autenticação demonstrativa e persistência com Local Storage.

## Como executar

1. Extraia a pasta do projeto.
2. Abra `index.html` no navegador. Para desenvolvimento, também pode usar a extensão Live Server do VS Code.
3. Crie uma conta na tela de cadastro.
4. Entre com o mesmo e-mail e senha na tela de login.

## Onde os dados ficam

O JavaScript salva os dados no Local Storage como JSON:

- `mercadaoVictor_users` — lista de usuários cadastrados.
- `mercadaoVictor_session` — sessão demonstrativa do usuário conectado.
- `mercadaoVictor_cart` — lista de compras simulada.

No navegador, abra as ferramentas de desenvolvedor → Application (ou Armazenamento) → Local Storage para inspecionar as chaves.

## Limitações importantes

Este projeto é apenas didático. O Local Storage é acessível pelo próprio usuário e não oferece segurança de autenticação. As senhas estão armazenadas em texto puro para manter o exemplo simples; **não use essa abordagem em um site real**. Para produção, use um backend, banco de dados e autenticação segura. Os preços e produtos são exemplos, e o carrinho não realiza pedidos reais.
