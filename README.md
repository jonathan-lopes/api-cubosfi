# API CubosFi

![Logo](https://i.imgur.com/7q8TLfc.png)

API-CubosFi é uma REST API desenvolvida para a aplicação frontend [CubosFi](https://github.com/jonathan-lopes/front-integral-m05-desafio), nessa api você pode cadastrar os clientes e as suas cobranças.

![GitHub Actions](https://github.com/jonathan-lopes/api-cubosfi/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/jonathan-lopes/api-cubosfi/graph/badge.svg?token=XFIMEOED1J)](https://codecov.io/gh/jonathan-lopes/api-cubosfi)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![Swagger Validator](https://img.shields.io/swagger/valid/3.0?specUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fjonathan-lopes%2Fapi-cubosfi%2Fdevelop%2Fswagger.json) ![GitHub last commit](https://img.shields.io/github/last-commit/jonathan-lopes/api-cubosfi)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Para testa no insomnia

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=cubosFi&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fjonathan-lopes%2Fapi-cubosfi%2Fdevelop%2Fcollection%2Finsomnia.json)

## Documentação

Documentação utiliza a especificação OpenAPI (anteriormente Swagger Specification) para descrever os endpoints disponíveis e as operações em cada um deles.
A especificação da API foi escrita em [JSON](https://pt.wikipedia.org/wiki/JSON) e pode ser encontrado no arquivo [swagger.json](https://github.com/jonathan-lopes/api-cubosfi/blob/master/swagger.json) na raiz do repositório.

A duas formas de acessar a documentação:

### Primeira Forma

Pela rota `/api-docs` disponibilizada pela própria api que utilizar Swagger UI para renderiza definições de OpenAPI como documentação interativa.

### Segunda Forma

A outra forma é pelo serviço da [bump.sh](https://bump.sh/) que gera a documentação apartir das especificações OpenAPI, para acessar [clique aqui](https://bump.sh/jonathan-lopes/doc/api-cubosfi).

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

```properties
PORT

DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
DB_CLIENT

SECRET_TOKEN

# Tempo em segundos ou uma string descrevendo um intervalo de tempo ex: 10m
EXPIRES_IN_TOKEN

SECRET_REFRESH_TOKEN

# Tempo em segundos ou uma string descrevendo um intervalo de tempo ex: 5d
EXPIRES_IN_REFRESH_TOKEN

# Número de dias para expirar o token ex: 10
EXPIRES_REFRESH_TOKEN_DAYS

# O salto a ser usado na criptografia ex: 10
SALT_ROUNDS
```

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

Crie um arquivo .env.dev e adicione as variáveis como na seção [Variáveis de Ambiente](#variáveis-de-ambiente)

Inicie o servidor

```bash
  npm run dev
```

## Rodando os testes

Primeiro crie um arquivo .env.test adicione as seguintes variáveis de ambiente

```properties
PORT

DB_CLIENT=better-sqlite3

SECRET_TOKEN
EXPIRES_IN_TOKEN

SECRET_REFRESH_TOKEN
EXPIRES_IN_REFRESH_TOKEN
EXPIRES_REFRESH_TOKEN_DAYS

SALT_ROUNDS
```

Rode o seguinte comando

```bash
  npm t ou npm test
```

## Versionamento

Usamos [Versionamento Semântico](http://semver.org/) para versionamento. Para as versões
disponível, veja as [tags neste
repositório](https://github.com/jonathan-lopes/api-cubosfi/tags).
