param(
 [Parameter(Mandatory=$true)][string]$ReleaseFolder,
 [Parameter(Mandatory=$true)][string]$ReportPath,
 [switch]$RequireSigned
)
$ErrorActionPreference='Stop'
$folder=(Resolve-Path -LiteralPath $ReleaseFolder).Path
$exe=Join-Path $folder 'COMMAND Planner.exe'
if (!(Test-Path -LiteralPath $exe -PathType Leaf)) { throw 'Planner EXE missing from release folder' }
$signature=Get-AuthenticodeSignature -LiteralPath $exe
$files=@(Get-ChildItem -LiteralPath $folder -Recurse -File | Sort-Object FullName | ForEach-Object {
 [ordered]@{path=$_.FullName.Substring($folder.Length+1).Replace('\','/');bytes=$_.Length;sha256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash}
})
$report=[ordered]@{createdUtc=[DateTime]::UtcNow.ToString('o');signatureStatus=[string]$signature.Status;publisher=if($signature.SignerCertificate){$signature.SignerCertificate.Subject}else{$null};timestampAuthority=if($signature.TimeStamperCertificate){$signature.TimeStamperCertificate.Subject}else{$null};notice='Hashes verify file integrity, not publisher trust or antivirus approval.';files=$files}
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $ReportPath -Encoding UTF8
if($RequireSigned -and ($signature.Status -ne 'Valid' -or !$signature.TimeStamperCertificate)) { throw 'Release gate failed: a valid trusted, timestamped signature is required. See the audit report.' }
Write-Output "Release audited. Signature: $($signature.Status). Report: $ReportPath"
