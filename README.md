# ComicReader

Leitor de quadrinhos para desktop. Backend em C# (ASP.NET Core Minimal API), frontend em React + TypeScript + Vite.

## Estrutura

```
ComicReader.slnx
backend/ComicReader.Api/     API .NET
  Endpoints/                 endpoints HTTP (um arquivo por Ã¡rea)
  Domain/                    entidades do domÃ­nio (Comic, Chapter, Page)
  Data/                      persistÃªncia (DbContext, migrations)
frontend/                    app React
  src/api/                   cliente HTTP da API
  src/pages/                 telas
  src/components/            componentes reutilizÃ¡veis
  src/types/                 tipos espelhando o contrato da API
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
npm run dev
```

O Vite encaminha `/api` para a API, entÃ£o nÃ£o hÃ¡ CORS no backend.
