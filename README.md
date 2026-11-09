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
