# Reforger Game Master references and roadmap fit

Reviewed 13 October 2026. These references add implementation guidance; they do not replace Companion's current goal, branding, data model or interface. This is research/planning, not a delivered native property adapter or UI redesign.

## Official entity-property tutorial

[Bohemia: Game Master Entity Property Creation](https://community.bistudio.com/wiki/Arma_Reforger:Game_Master:_Entity_Property_Creation) describes editor attributes on replicated targets. ReadVariable determines applicability and returns typed attribute data; WriteVariable checks the target/components again before applying changes. The framework offers checkbox, slider and selection layouts, configured through attribute lists and categories. Edit, Photo and Admin modes serve different audiences. Is Server controls where reads/writes run; other hooks, including preview and entries, may still run on clients.

Proposed Companion use: build a small explicitly supported property catalogue for a future Enfusion adapter. Keep offline exercise properties separate from real engine attributes. Identify each property's allowed entity/component, value range, units, visibility and permission. Map an authorised request to a supported server operation and require acknowledgement. The tutorial establishes a native editor extension mechanism; it does not create a desktop network API or grant permission to control entities remotely. Pairing credentials remain in the existing private connection flow rather than replicated entity attributes.

Owners: packages 07, 10, 11 and 12. Next integration gate remains an actual dedicated runtime test; compilation alone does not deliver writable properties.

## GRAD COOP Template

[Repository](https://github.com/gruppe-adler/GRAD-COOP-Template-Reforger), reviewed main-tree snapshot `7ffeed26f4123e99c54aafb4bb273dd2fa3422f8` (tree ID, not a commit ref).

The README describes a saved Game Master COOP mission template and labels it experimental. The reviewed source separates a terrain-parent subscene, game-mode layer and mission header. The layer contains save/load configuration. Its budget attribute override illustrates finding a target component before returning an editor value; its arsenal override makes supply costs zero.

Useful inspiration for our own implementation:
- Keep a future Companion test scenario small and separate its mission header, world inheritance and game-mode setup. Resolve references against installed resources, with our own GUIDs and addon identity.
- Use the game's save/load lifecycle as an integration boundary to verify, rather than treating an external planner JSON document as a native GM save.
- Expose narrow configurable GM properties through verified component access and an explicit authority policy.
- Retain our current budgets, supply rules, garbage handling and loadouts. Changes to those are gameplay features requiring their own scope and performance evaluation.

Evidence files reviewed: `Missions/GRAD_GM_Eden.conf`, `Worlds/GRAD_GM_Eden.ent`, `Worlds/GRAD_GM_Eden_Layers/gamemode.layer`, `scripts/Game/Editor/Containers/Attributes/GRAD_BasePlayerBudgetEditorAttribute.c`, `scripts/Game/Components/Arsenal/GRAD_ArsenalItem.c`, `LICENSE.md`, `AUTHORS.txt`.

[GRAD's licence](https://github.com/gruppe-adler/GRAD-COOP-Template-Reforger/blob/main/LICENSE.md) names the Arma Public License and credits Gruppe Adler. [Bohemia's licence FAQ](https://www.bohemia.net/en/licenses/faq) identifies attribution, noncommercial and Arma-only requirements. This is source available with restrictions; it is not an unrestricted MIT-style dependency. No GRAD code, textures, resource database or other assets were copied into Companion. If direct reuse is later selected, verify the specific material's licence, retain notices and attribution, and document modifications in the applicable addon. The Companion licence is not changed by this research.

Owners: packages 10/11/12/16. This reference supplies design examples, not proof that its older files work on our installed engine or that any adapter is complete.

## User's Reforger UI screenshot

Local reference retained outside the source/release trees at `A:/Everon-ORBAT-Development/work/references/reforger-gm-ui-reference.png`.

Observed structure: compact top command strip and GM mode indicator, a bottom asset browser with category/action controls and item cards, compact environment information, and a selection-related information card beside the main view.

Proposed Companion adaptation: evaluate an optional compact GM workspace with a collapsible asset drawer, clearly marked active tool/mode and a focused selection/property inspector. Preserve our map, colours, ORBAT assets, existing menus, full-map controls and settings compatibility. Do not imply a 3D engine viewport in the desktop planner. Any layout change needs keyboard/focus checks, narrow-window and full-map testing, representative asset browsing performance and updated Sarge guidance when actually delivered. Use our own interface assets; the screenshot is a local reference, not bundled product artwork.

Owner: package 14, coordinated with packages 03/05/07. Native property displays depend on verified data contracts and permissions from packages 10/11.

No application code changed for this research, so no application, bridge or performance test gates were repeated and no new build was packaged.
