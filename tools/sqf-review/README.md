# COMMAND loose-source review (developer tool, unreleased)

Requires Node.js 18+ and this source checkout. No npm dependencies or engine launch are required. Run from the repository root. This is separate from the desktop app; its JSON reports are not app import/deployment files.

## English

Select a folder containing 1-64 loose .sqf/.sqm/.ext/.hpp text files. Nested folders, config.cpp, PBO/WRP and audio are not inspected. Sources are never executed or changed. Output must be a new folder outside the source tree with an existing parent directory.

```powershell
node tools/sqf-review/review.cjs --input "A:/LegacySource" --output "A:/Reviews/LegacyReview"
node tools/sqf-review/verify.cjs --review "A:/Reviews/LegacyReview"
```

Open REVIEW.md for the summary. The six analysis JSON files contain source locations/previews and unresolved findings. manifest.json records review artifact hashes. source-receipt.json records original file byte hashes and ignored directory entries. Keep source-linked reports private unless you intend to share them.

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
node --test planner/sqf-binding-review.test.js planner/sqf-command-expressions.test.js planner/sqf-value-ir.test.js planner/sqf-review-package.test.js tools/sqf-review/review.test.cjs tools/sqf-review/verify.test.cjs
```

Do not repeat passing gates without a relevant change, failure or unresolved concern. Native behavior is untested in this checkpoint. The current installed app and its guides/settings remain unchanged; the developer workflow is documented here in EN/FR/DE.
