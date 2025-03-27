# COUP

COUP é um jogo de cartas em que cada jogador possui 2 cartas e vence o último a ter cartas no jogo.
(está interessado em saber mais sobre o jogo, convido-o a ler a página de regras)

## Pré-requisitos

- [Node.js](https://nodejs.org/pt)

## Instalando as dependências

### Front-end

```bash
cd client
npm i
```

### Back-end

```bash
cd server
npm i
```

caso tente rodar esses comando dentro da pasta client, ocorrerá um erro, use `cd ..` antes.

## Rodando

### Front-end

```bash
cd client
npm run dev
```

### Back-end

```bash
cd server
npm run dev
```

### Jogando

para jogar entre no [link](http://localhost:3000) e clique em jogar, escreva o seu nickname e crie ou entre em uma sala.
para que um amigo jogue com você é necessário:
- que ambos possuam dispositivos conectados na mesma rede (no mesmo wi-fi).
- quem não está rodando deve se entrar pelo ip (http://{ip}:3000) de quem está rodando o projeto. (use ipconfig no windows para ver o seu ipv4)

### Bash completo com instalação e inicialização

```bash
cd client
npm i
npm run dev

cd ..

cd server
npm i
npm run dev
```