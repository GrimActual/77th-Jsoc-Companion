# COMMAND loose-source review (developer tool, unreleased)

Requires Node.js 18+ and this source checkout. No npm dependencies or engine launch are required. Run from the repository root. This is separate from the desktop app; its JSON reports are not app import/deployment files.

## English

Select a folder containing 1-64 loose .sqf/.sqm/.ext/.hpp text files. Nested folders, config.cpp, PBO/WRP and audio are not inspected. Sources are never executed or changed. Output must be a new folder outside the source tree with an existing parent directory.

```powershell
node tools/sqf-review/review.cjs --input "A:/LegacySource" --output "A:/Reviews/LegacyReview"
node tools/sqf-review/verify.cjs --review "A:/Reviews/LegacyReview"
```

Open REVIEW.md for the summary. The seven analysis JSON files contain source locations/previews and unresolved findings. manifest.json records review artifact hashes. source-receipt.json records original file byte hashes and ignored directory entries. Keep source-linked reports private unless you intend to share them.

The review prints a bundleSHA256 fingerprint. Retain it separately if you need to detect replacement of the complete bundle, then verify with `--expected-sha256` followed by that exact lowercase value. Without an independently trusted expected value, verification establishes self-consistency only. It does not authenticate authorship, validate semantics or allow execution. The source receipt is outside the listed review-artifact hash scope.

All reports remain non-executable. Syntactic declaration/command candidates and source-value shapes are not proven runtime bindings, native types or converted behavior. Nothing generates .c files or sends requests to Reforger. To repeat a review after source changes, choose another output directory; existing outputs are never intentionally overwritten.

## Francais

Outil de developpement separe de l'application, avec Node.js 18+. Choisissez un dossier contenant 1 a 64 fichiers texte .sqf/.sqm/.ext/.hpp. Les sous-dossiers, config.cpp, PBO/WRP et fichiers audio ne sont pas analyses. Les sources ne sont ni executees ni modifiees. Le dossier de sortie doit etre nouveau, hors du dossier source, avec un dossier parent existant.

Utilisez les commandes ci-dessus, puis ouvrez REVIEW.md. Les rapports JSON contiennent des emplacements/extraits de source et des points non resolus. Le manifeste conserve les empreintes des rapports; source-receipt.json conserve les empreintes des fichiers source et les entrees ignorees. Ne partagez ces rapports que volontairement.

Conservez separement bundleSHA256 pour utiliser --expected-sha256 avec cette valeur exacte. La verification ne prouve ni l'origine, ni la validite du comportement, ni une autorisation d'execution. Sans empreinte de confiance, elle controle seulement la coherence interne. Le recu source est distinct des rapports couverts par le manifeste. Aucun code Enforce n'est genere; aucune commande n'est envoyee au jeu. Pour une nouvelle analyse, choisissez un autre dossier de sortie.

## Deutsch

Entwicklerwerkzeug ausserhalb der Desktop-App, mit Node.js 18+. Waehlen Sie einen Ordner mit 1 bis 64 losen Textdateien .sqf/.sqm/.ext/.hpp. Unterordner, config.cpp, PBO/WRP und Audiodateien werden nicht untersucht. Quelldateien werden weder ausgefuehrt noch veraendert. Der Ausgabeordner muss neu sein, ausserhalb des Quellordners liegen und einen vorhandenen Elternordner haben.

Fuehren Sie die Befehle oben aus und oeffnen Sie REVIEW.md. Die JSON-Berichte enthalten Quellpositionen/Ausschnitte und offene Befunde. Das Manifest enthaelt Bericht-Pruefsummen; source-receipt.json enthaelt Quelldatei-Pruefsummen und ignorierte Eintraege. Teilen Sie diese Berichte nur bewusst.

Bewahren Sie bundleSHA256 getrennt auf und uebergeben Sie den exakten Wert mit --expected-sha256. Die Pruefung bestaetigt weder Urheberschaft noch Verhaltensgleichheit oder Ausfuehrungsrechte. Ohne vertrauenswuerdigen Vergleichswert wird nur die interne Konsistenz geprueft. Der Quellbeleg ist vom Pruefumfang der Bericht-Artefakte getrennt. Es wird kein Enforce-Code erzeugt und kein Befehl an das Spiel gesendet. Fuer eine erneute Analyse waehlen Sie einen anderen Ausgabeordner.

## Implementation and tests

See docs/SQF-BINDING-VALUE-IR.md and docs/test-evidence/sqf-binding-value-ir.json. The default full source test script includes these new gates; focused commands are:

```powershell
node --test planner/sqf-source-semantics.test.js planner/sqf-source-semantics-validation.test.js planner/sqf-binding-review.test.js planner/sqf-command-expressions.test.js planner/sqf-value-ir.test.js planner/sqf-review-package.test.js tools/sqf-review/review.test.cjs tools/sqf-review/verify.test.cjs
```

Do not repeat passing gates without a relevant change, failure or unresolved concern. Native behavior is untested in this checkpoint. The current installed app and its guides/settings remain unchanged; the developer workflow is documented here in EN/FR/DE.


## Source shape and potential-effect review (English / Francais / Deutsch)

English: source-semantics.json distinguishes compatible known shapes, unresolved operands and known mismatches. It records possible effects and callback scheduling/cleanup requirements. This is not whole-mod behavior verification; no code or condition string is evaluated and no target type is authorized. Strict JSON validation is structural, not proof of native equivalence. Old review formats remain readable.

Francais : source-semantics.json distingue les formes connues compatibles, les operandes non resolus et les incompatibilites connues. Il conserve les effets possibles et les obligations de planification/nettoyage des rappels. Aucun code ni texte de condition n'est execute. La validation structurelle ne prouve pas l'equivalence native; les anciens formats restent lisibles.

Deutsch: source-semantics.json unterscheidet kompatible bekannte Formen, ungeklaerte Operanden und bekannte Unvereinbarkeiten. Moegliche Effekte sowie Callback-Zeitpunkt und Aufraeumpflichten bleiben sichtbar. Code und Bedingungstexte werden nicht ausgefuehrt. Strukturelle Pruefung beweist keine native Verhaltensgleichheit; aeltere Berichtsformate bleiben lesbar.


## Include dependency review / Dependances / Abhaengigkeiten (developer-only)

**English:** Prepare a UTF-8 JSON file with exactly `files` (relative `{name,text}` records) and `mounts` (`{prefix,root}` records, empty array allowed). Example: `{"files":[{"name":"addons/main/init.sqf","text":"#include \"script_component.hpp\""},{"name":"addons/main/script_component.hpp","text":"#define DEMO 1"}],"mounts":[{"prefix":"/z/demo/addons/main","root":"addons/main"}]}`. Supply your own local text; this tool does not traverse directories or fetch missing dependencies. Names preserve package-relative paths. No macro expansion, config symbol resolution or Enforce generation is performed.

```powershell
node tools/sqf-review/dependencies.cjs --source-set "A:/Reviews/source-set.json" --output "A:/Reviews/new-dependencies.json"
```

Review unresolved/case/unsafe-path results and potential cycles. Exact include paths do not prove active branches, function bindings or conversion readiness. Processing uses a cancellable bounded Node worker. The new report must not overwrite an existing file and is not an app import/deployment contract. See docs/SQF-SOURCE-DEPENDENCIES.md for limits and examples.

**Francais :** Creez un fichier JSON UTF-8 avec seulement `files` (noms relatifs et textes) et `mounts` (prefixes virtuels et racines relatives, tableau vide autorise). Utilisez la commande ci-dessus avec un nouveau fichier de sortie. Aucun dossier ou fichier manquant n'est charge automatiquement. Le worker Node analyse les directives sans executer les sources ni developper les macros. Examinez les chemins manquants, ambigus ou dangereux et les cycles potentiels. Un chemin trouve ne prouve ni une branche active, ni une fonction resolue, ni une conversion executable. Outil de developpement, pas une nouvelle fonction de l'application.

**Deutsch:** Erstellen Sie eine UTF-8-JSON-Datei nur mit `files` (relative Namen und Texte) sowie `mounts` (virtuelle Praefixe und relative Wurzeln; leeres Array erlaubt). Verwenden Sie den obigen Befehl mit einer neuen Ausgabedatei. Keine automatische Ordnersuche oder Beschaffung fehlender Dateien. Ein begrenzter Node-Worker untersucht Direktiven ohne Quellcodeausfuehrung oder Makroexpansion. Pruefen Sie fehlende, mehrdeutige oder unsichere Pfade und moegliche Zyklen. Gefundene Pfade beweisen keine aktiven Zweige, aufgeloesten Funktionen oder ausfuehrbare Konvertierung. Dies ist ein Entwicklerwerkzeug, keine neue App-Funktion.


## Function registration candidates / Fonctions / Funktionskandidaten (developer-only)

English: Add `configRoots` to an explicit source-set JSON, for exactly `{files,mounts,configRoots}`. Example root: `{"file":"mission/description.ext","root":"mission"}`. Each file is an existing selected source; roots are package-relative (empty string means the selected package root). Relative function file properties are anchored there; header folders are not guessed as mission roots. Virtual paths still require mounts. The tool inventories literal CfgFunctions declarations and lexical call/spawn name candidates, without preprocessing, function execution or runtime binding. Choose a new report filename.

```powershell
node tools/sqf-review/registrations.cjs --source-set "A:/Reviews/function-source-set.json" --output "A:/Reviews/new-registrations.json"
```

A unique name or exact source path is only a candidate. Review missing/ambiguous paths, macro/inheritance blockers and supplied-file coverage. The Node worker supports bounded analysis, deadline and cancellation. This new report is not an app import or deployable mission. See docs/SQF-FUNCTION-REGISTRATIONS.md.

Francais : Ajoutez `configRoots` au JSON de sources, avec exactement `files`, `mounts` et `configRoots`. Exemple : `{"file":"mission/description.ext","root":"mission"}`. Utilisez la commande ci-dessus et un nouveau fichier de sortie. Les racines sont relatives au paquet; aucun dossier de mission n'est devine. Les declarations litterales CfgFunctions et noms call/spawn restent des candidats, sans developpement des macros, resolution d'execution ou conversion native. Examinez les chemins manquants, ambigus et les limites de couverture. Outil de developpement separe de l'application.

Deutsch: Fuegen Sie `configRoots` zur Quelldatei-JSON hinzu, mit genau `files`, `mounts` und `configRoots`. Beispiel: `{"file":"mission/description.ext","root":"mission"}`. Nutzen Sie den obigen Befehl mit einer neuen Ausgabedatei. Wurzeln sind paketrelativ; Missionsordner werden nicht geraten. Literale CfgFunctions-Deklarationen und call/spawn-Namen bleiben Kandidaten, ohne Makroexpansion, Laufzeitbindung oder native Konvertierung. Pruefen Sie fehlende und mehrdeutige Pfade sowie Abdeckungsgrenzen. Dies ist ein Entwicklerwerkzeug ausserhalb der App.


## Literal include expansion / Inclusions / Include-Erweiterung (developer-only)

English: Prepare an explicit source-set JSON with exactly `files`, `mounts` and `entries`. An entry is `{"file":"mission/description.ext","configRoot":"mission"}`; use null for configRoot when no relative config path context is declared. The command copies only exact literal supplied-source includes and returns original UTF-16 source maps. Macro definitions, conditions, unknown directives, missing/ambiguous paths, cycles and line splicing block the entry. No partial text/candidates are returned for blocked entries. Complete literal units remain non-executable and are not full preprocessed/native output. Reports contain source text: keep them private unless you have sharing rights.

```powershell
node tools/sqf-review/expand-includes.cjs --source-set "A:/Reviews/include-source-set.json" --output "A:/Reviews/new-include-review.json"
```

The bounded Node worker supports deadline/cancellation. Output must be a new filename. The tool never automatically reads referenced files or fetches missing dependencies. Config candidate declarations can retain exact original header spans through a clearly labelled synthetic expanded file. See docs/SQF-INCLUDE-EXPANSION.md for limits and remaining gates; this is not an installed app feature or app import contract.

Francais : Le JSON contient exactement `files`, `mounts` et `entries`. Exemple d'entree : `{"file":"mission/description.ext","configRoot":"mission"}`; null signifie aucun contexte relatif declare. La commande ci-dessus insere uniquement des inclusions litterales fournies et conserve les origines UTF-16. Macros, conditions, chemins manquants/ambigus et cycles bloquent l'entree sans texte partiel ni candidats. Le resultat reste non executable et ne prouve pas une conversion native. Les rapports contiennent du code source : ne les partagez qu'avec les droits necessaires. Outil de developpement hors application.

Deutsch: Die JSON-Datei enthaelt genau `files`, `mounts` und `entries`. Beispiel: `{"file":"mission/description.ext","configRoot":"mission"}`; null bedeutet keinen deklarierten relativen Config-Kontext. Der obige Befehl fuegt nur gelieferte literale Includes ein und erhaelt UTF-16-Quellurspruenge. Makros, Bedingungen, fehlende/mehrdeutige Pfade und Zyklen blockieren den Eintrag ohne Teiltext oder Kandidaten. Das Ergebnis ist nicht ausfuehrbar und keine native Konvertierung. Berichte enthalten Quelltext; teilen Sie sie nur mit entsprechenden Rechten. Entwicklerwerkzeug ausserhalb der App.
