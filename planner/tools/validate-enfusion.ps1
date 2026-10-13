# Compile an isolated bridge copy; never publish or start a game world.
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$WorkbenchExe,
    [Parameter(Mandatory=$true)][string]$GameAddons,
    [string]$CandidatePath = (Join-Path $PSScriptRoot '../../reforger-mod/dedicated-candidate/JSOC_ORBAT_Bridge'),
    [Parameter(Mandatory=$true)][string]$EvidenceDirectory,
    [ValidateSet('PC','WORKBENCH')][string[]]$Configurations = @('PC','WORKBENCH'),
    [ValidateRange(15,180)][int]$TimeoutSeconds = 120
)
$ErrorActionPreference = 'Stop'
$workbenchPath = (Resolve-Path -LiteralPath $WorkbenchExe).Path
$addonsPath = (Resolve-Path -LiteralPath $GameAddons).Path
$candidateRoot = (Resolve-Path -LiteralPath $CandidatePath).Path
if (!(Test-Path -LiteralPath (Join-Path $candidateRoot 'addon.gproj'))) { throw 'Candidate addon.gproj is missing.' }
function SourceManifest([string]$root) {
    @(Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object { $_.Extension -in @('.c','.layout','.gproj') } | Sort-Object FullName | ForEach-Object {
        [ordered]@{ file = [IO.Path]::GetRelativePath($root,$_.FullName).Replace('\','/'); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
    })
}
$manifest = SourceManifest $candidateRoot
New-Item -ItemType Directory -Path $EvidenceDirectory -Force | Out-Null
$runRoot = Join-Path (Resolve-Path -LiteralPath $EvidenceDirectory).Path ('enfusion-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $runRoot | Out-Null
Copy-Item -LiteralPath $candidateRoot -Destination (Join-Path $runRoot 'candidate') -Recurse
$candidateCopy = Join-Path $runRoot 'candidate'
if ((SourceManifest $candidateCopy | ConvertTo-Json -Depth 4 -Compress) -ne ($manifest | ConvertTo-Json -Depth 4 -Compress)) { throw 'Candidate copy differs from source.' }
$results = @()
foreach ($configuration in $Configurations) {
    $stdout = Join-Path $runRoot ($configuration + '-stdout.txt')
    $stderr = Join-Path $runRoot ($configuration + '-stderr.txt')
    $profile = Join-Path $runRoot ($configuration + '-profile')
    $arguments = @('-gproj', ('"'+(Join-Path $candidateCopy 'addon.gproj')+'"'), '-addonsDir', ('"'+$addonsPath+'"'), '-profile', ('"'+$profile+'"'), '-wbsilent', '-wbModule=ScriptEditor', ('-validate='+$configuration))
    $timer = [Diagnostics.Stopwatch]::StartNew()
    $process = Start-Process -FilePath $workbenchPath -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    $peakBytes = 0
    $timedOut = $false
    while (!$process.WaitForExit(500)) {
        $process.Refresh()
        $peakBytes = [Math]::Max($peakBytes,$process.WorkingSet64)
        if ($timer.Elapsed.TotalSeconds -gt $TimeoutSeconds) {
            # This object belongs only to the validation process launched above.
            $process.Kill()
            $process.WaitForExit()
            $timedOut = $true
            break
        }
    }
    $timer.Stop()
    $output = Get-Content -LiteralPath $stdout -Raw
    $success = !$timedOut -and $process.ExitCode -eq 0 -and $output.Contains('Script validation successful.')
    $results += [ordered]@{ configuration=$configuration; success=$success; exitCode=$process.ExitCode; timedOut=$timedOut; seconds=[Math]::Round($timer.Elapsed.TotalSeconds,2); sampledPeakWorkingSetMB=[Math]::Round($peakBytes/1MB,1); scriptWarnings=@($output -split '\r?\n' | Where-Object { $_ -match 'warning:' }); }
    Write-Output ($configuration+': '+$(if ($success) {'PASS'} else {'FAIL'}))
}
if ((SourceManifest $candidateRoot | ConvertTo-Json -Depth 4 -Compress) -ne ($manifest | ConvertTo-Json -Depth 4 -Compress)) { throw 'Original candidate source changed during validation.' }
$report = [ordered]@{ schema='companion-enfusion-validation'; version=1; utc=[DateTime]::UtcNow.ToString('o'); source=$manifest; results=$results; worldStarted=$false; published=$false; dedicatedRuntimeTested=$false; note='Compilation only. Inspect full local logs for resource warnings; this does not test UI layout, packaging, HTTPS callbacks or a dedicated game session.' }
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $runRoot 'result.json') -Encoding utf8
Write-Output ('Evidence: '+$runRoot)
if (@($results | Where-Object { !$_.success }).Count) { exit 1 }
