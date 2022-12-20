# API CubosFi

![Logo](https://i.imgur.com/7q8TLfc.png)

CubosFi é uma REST API desenvolvida para a aplicação frontend [CubosFi](https://github.com/jonathan-lopes/front-integral-m05-desafio).

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/jonathan-lopes/api-cubosfi/tree/develop.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/jonathan-lopes/api-cubosfi/tree/develop) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) ![Swagger Validator](https://img.shields.io/swagger/valid/3.0?specUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fjonathan-lopes%2Fapi-cubosfi%2Fdevelop%2Fswagger.json) ![GitHub last commit](https://img.shields.io/github/last-commit/jonathan-lopes/api-cubosfi)

## Para testa no insomnia

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=CubosFi&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fjonathan-lopes%2Fapi-cubosfi%2Fmaster%2Fcollection%2FInsomnia_2022-10-22.json)

## Documentação

[Documentação](#)

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT`

`DB_HOST`<br/>
`DB_USER`<br/>
`DB_PASSWORD`<br/>
`DB_NAME`<br/>
`DB_PORT`<br/>
`DB_CLIENT`<br/>

`MONGO_DB`<br/>

`SECRET_TOKEN`<br/>
`EXPIRES_IN_TOKEN`<br/>

`SECRET_REFRESH_TOKEN`<br/>
`EXPIRES_IN_REFRESH_TOKEN`<br/>
`EXPIRES_REFRESH_TOKEN_DAYS`<br/>

`SALT_ROUNDS`

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/jonathan-lopes/api-cubosfi.git
```

Entre no diretório do projeto

```bash
  cd api-cubosfi
```

Instale as dependências

```bash
  npm i ou npm install
```

Você vai precisar adicionar as seguintes variáveis de ambiente num arquivo .env.dev
```bash
PORT

DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
DB_CLIENT

MONGO_DB

SECRET_TOKEN
EXPIRES_IN_TOKEN

SECRET_REFRESH_TOKEN
EXPIRES_IN_REFRESH_TOKEN
EXPIRES_REFRESH_TOKEN_DAYS

SALT_ROUNDS
```

Inicie o servidor

```bash
  npm run dev
```

## Rodando os testes

Primeiro crie um arquivo .env.test adicione as seguintes variáveis de ambiente

`PORT`

`DB_CLIENT=sqlite3`

`SECRET_TOKEN`<br/>
`EXPIRES_IN_TOKEN`

`SECRET_REFRESH_TOKEN`<br/>
`EXPIRES_IN_REFRESH_TOKEN`<br/>
`EXPIRES_REFRESH_TOKEN_DAYS`<br/>

`SALT_ROUNDS`

Rode o seguinte comando

```bash
  npm t ou npm run test
```
