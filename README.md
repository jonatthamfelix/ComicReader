# ComicReader

Leitor de quadrinhos para desktop. Backend em C# (ASP.NET Core Minimal API), frontend em React + TypeScript + Vite.

## Estrutura

```
ComicReader.slnx
backend/ComicReader.Api/     API .NET
  Endpoints/                 endpoints HTTP (um arquivo por área)
  Domain/                    entidades do domínio (Comic, Page)
  Services/                  lógica fora de HTTP e banco (leitura de .cbz/.cbr)
  Data/                      persistência (DbContext, migrations)
frontend/                    app React
  src/api/                   cliente HTTP da API
  src/pages/                 telas
  src/components/            componentes reutilizáveis
  src/types/                 tipos espelhando o contrato da API
```

## Pré-requisitos

- .NET SDK 10
- Node.js 20+
- SQL Server LocalDB (vem com SQL Server Express / Visual Studio)

## Banco

SQL Server LocalDB, instância `(localdb)\MSSQLLocalDB`, banco `ComicReader`. A connection string fica em `backend/ComicReader.Api/appsettings.json`.

Primeira vez (ou após adicionar migration):

```
cd backend/ComicReader.Api
dotnet ef database update
```

## Como rodar

Duas opções.

### Instalador / executável (uso normal)

```
.\publish.ps1
```

Gera `dist\ComicReader\ComicReader.Api.exe` (~119 MB, inclui o runtime). Dê dois cliques: ele sobe em http://localhost:5039 e abre o navegador sozinho — **sem janela de prompt**.

Ícone: se existir `%LOCALAPPDATA%\ComicReader\ComicReader.ico`, ele é embutido no executável durante o publish (o arquivo não fica no repositório).

Comportamento:

- Se já estiver rodando, o segundo clique só reabre o navegador (não cria outra instância).
- Ele fica em segundo plano. Para encerrar: Gerenciador de Tarefas → `ComicReader.Api` → Finalizar tarefa. Deixar rodando é inofensivo e até melhor: o próximo clique é instantâneo.
- Erros vão para `%LOCALAPPDATA%\ComicReader\error.log`.

Pré-requisito: SQL Server LocalDB instalado na máquina.

### Desenvolvimento

Terminal 1 (API em http://localhost:5039):

```
cd backend/ComicReader.Api
dotnet run
```

Terminal 2 (app em http://localhost:5173):

```
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173, cole o caminho completo de um `.cbz` ou `.cbr` e clique em Importar.

O Vite encaminha `/api` para a API, então não há CORS no backend.
