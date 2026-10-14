# v2.4.1 — French and German interface

Choose Settings → Language & Region → Application language, then Save settings. English remains the default. Français and Deutsch work offline and persist after restart. Date/number formats can be selected independently for France and Germany.

Translated: main controls, settings, common feedback, faction/unit/asset type labels, presentation export controls, and all fourteen Sarge help topics. The layout and map controls are retained. Longer labels wrap within the existing controls.

Callsigns, operation text, phase names, imported equipment names, IDs, mod metadata and project JSON are never translated. Existing plans need no migration. Language changes preserve pending form edits and selection. Changing only preferences no longer rewrites the plan's saved status.

Scope: technical validation/network diagnostics may remain English. Generated Discord brief and presentation legend labels remain English; place names are part of the map imagery. Translations have been functionally tested, but have not had an independent native-speaker review.

Install: close the previous version, extract the entire Windows ZIP into a new folder, then launch COMMAND Planner.exe. Keep a manual JSON backup of important plans.

For contributors: translations.js contains English-source-to-French/German dictionaries; i18n.js localizes interface text only. Containers mixing user content and labels are excluded and localized explicitly in planner.js. Do not translate plan values or remove those exclusions. npm test includes translation/preference coverage.
