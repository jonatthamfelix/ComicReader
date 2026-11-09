#Requires -Version 5.1
<#
    Gera um executável único e autocontido em dist\ComicReader\ComicReader.Api.exe
    Uso: .\publish.ps1
#>
$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$api = Join-Path $root 'backend\ComicReader.Api'
$web = Join-Path $root 'frontend'
$wwwroot = Join-Path $api 'wwwroot'
$out = Join-Path $root 'dist\ComicReader'

Write-Host '==> Build do frontend' -ForegroundColor Cyan
Push-Location $web
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'npm run build falhou' }
} finally {
    Pop-Location
}

Write-Host '==> Copiando SPA para wwwroot' -ForegroundColor Cyan
if (Test-Path $wwwroot) { Remove-Item $wwwroot -Recurse -Force }
New-Item -ItemType Directory -Path $wwwroot | Out-Null
Copy-Item (Join-Path $web 'dist\*') $wwwroot -Recurse

Write-Host '==> Publicando executável' -ForegroundColor Cyan
if (Test-Path $out) { Remove-Item $out -Recurse -Force }

# ícone opcional (fora do repositório, gerado localmente em %LOCALAPPDATA%\ComicReader)
$icon = Join-Path $env:LOCALAPPDATA 'ComicReader\ComicReader.ico'
$iconArg = if (Test-Path $icon) { "-p:ApplicationIcon=$icon" } else { '' }

Push-Location $api
try {
    dotnet publish -c Release -r win-x64 --self-contained true `
        -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true `
        -p:OutputType=WinExe -p:DebugType=none $iconArg -o $out
    if ($LASTEXITCODE -ne 0) { throw 'dotnet publish falhou' }
} finally {
    Pop-Location
}

$exe = Join-Path $out 'ComicReader.Api.exe'
$mb = [math]::Round((Get-Item $exe).Length / 1MB, 1)
Write-Host "==> Pronto: $exe ($mb MB)" -ForegroundColor Green
