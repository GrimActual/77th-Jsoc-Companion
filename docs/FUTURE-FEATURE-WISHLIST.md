# Future feature catalogue — 13 October 2026

Preserved user-supplied wishlist. [D] means discussed; [E] means an expanded proposal. Neither means delivered or individually approved for implementation. Existing functionality must be audited before extending it.

# 77th JSOC Companion — 200-feature master wishlist

## 1. ORBAT and force management

1. [D] Advanced ORBAT hierarchy management.
2. [D] Nested command structures from headquarters to individual personnel.
3. [D] Unit and group organization tools.
4. [D] Editable unit identities and designations.
5. [D] Equipment and loadout profiles.
6. [E] Custom organizational templates.
7. [E] Unit readiness states.
8. [E] Personnel availability tracking.
9. [E] Vehicle assignment to units.
10. [E] Unit capability summaries.
11. [E] Formation presets.
12. [E] Reinforcement and reserve-force pools.
13. [E] Task organization for individual missions.
14. [E] Unit relationship and attachment management.
15. [E] Historical ORBAT snapshots.
16. [E] ORBAT comparison between mission versions.
17. [E] Import and export of standardized ORBAT data.
18. [E] Unit-specific notes and operational restrictions.
19. [E] Force strength and composition reports.
20. [E] Reusable faction and force libraries.

## 2. Map and mission planning

21. [D] Advanced interactive operational maps.
22. [D] Multiple terrain support beyond Everon.
23. [D] Objective placement and editing.
24. [D] Mission phase planning.
25. [D] HVT and point-of-interest management.
26. [D] Map-based unit positioning.
27. [E] Route creation and editing.
28. [E] Waypoint sequencing.
29. [E] Operational boundaries and zones.
30. [E] Assembly areas and staging points.
31. [E] Named control measures.
32. [E] Custom map symbols and icon libraries.
33. [E] Layer visibility and filtering.
34. [E] Map annotations and freehand drawing.
35. [E] Measurement and coordinate tools.
36. [E] Mission planning templates.
37. [E] Alternate and contingency plans.
38. [E] Objective dependencies.
39. [E] Mission progress visualization.
40. [E] Map state presets for different operational roles.

## 3. Briefings, exports and mission documentation

41. [D] Structured mission briefing generation.
42. [D] Improved briefing exports.
43. [D] Mission package preservation.
44. [E] Automatically generated ORBAT annexes.
45. [E] Automatically generated objective lists.
46. [E] Map snapshot exports.
47. [E] Role-specific briefing versions.
48. [E] Commander overview documents.
49. [E] Squad-level mission extracts.
50. [E] Mission change summaries.
51. [E] Exportable operational timelines.
52. [E] Briefing revision history.
53. [E] Custom document templates.
54. [E] Printable mission cards.
55. [E] Consistent naming and numbering across exports.

## 4. Companion Core — your independent engine

56. [D] Separate the application's core logic from its interface.
57. [D] Build an independent Companion engine.
58. [D] Create a modular ORBAT engine.
59. [D] Create a scenario engine.
60. [D] Create a Game Master engine.
61. [D] Create a simulation engine.
62. [D] Create a synchronization engine.
63. [D] Create a replay engine.
64. [D] Support operation without Arma running.
65. [D] Support optional Enfusion-linked operation.
66. [D] Keep the engine independent of the renderer.
67. [D] Define shared JSON schemas between components.
68. [E] Version the engine's public APIs.
69. [E] Create a deterministic simulation clock.
70. [E] Introduce an internal event bus.
71. [E] Support engine modules and extensions.
72. [E] Separate persistent plans from temporary world state.
73. [E] Validate all engine commands before execution.
74. [E] Add engine diagnostics and health reporting.
75. [E] Build automated compatibility tests between modules.

## 5. Game Master mode

76. [D] Dedicated Game Master console.
77. [D] Manual control of simulated units.
78. [D] Manual objective state changes.
79. [D] Manual mission phase changes.
80. [D] GM-triggered scenario events.
81. [D] JSON-driven scenario definitions.
82. [D] Conditional event triggers.
83. [D] Time-based event triggers.
84. [D] Objective-completion triggers.
85. [D] Zone-entry triggers.
86. [D] Reinforcement events.
87. [D] Simulated radio and intelligence reports.
88. [D] Event prerequisites and consequences.
89. [D] Resource-limited scenario events.
90. [D] Automated Game Master rules.
91. [D] AI-assisted Game Master suggestions.
92. [D] Human approval before AI-generated state changes.
93. [E] GM event library.
94. [E] Scenario difficulty controls.
95. [E] GM-only hidden information.
96. [E] Event scheduling and cancellation.
97. [E] GM action undo where safe.
98. [E] Scenario pause, resume and reset.
99. [E] GM action history.
100. [E] Reusable Game Master scenario templates.

## 6. Simulation and persistent campaigns

101. [D] Synthetic units independent of live players.
102. [D] Simulated unit movement.
103. [D] Simulated resource consumption.
104. [D] Scenario progression based on world state.
105. [D] Persistent campaign state.
106. [D] Units retaining identity between missions.
107. [D] Mission consequences carrying into later scenarios.
108. [D] Exercise director controls.
109. [D] Scenario rehearsal.
110. [D] Decision evaluation during exercises.
111. [E] Simulated logistics and supply networks.
112. [E] Unit fatigue and readiness models.
113. [E] Environmental scenario variables.
114. [E] Probabilistic event outcomes.
115. [E] Reproducible simulation seeds.
116. [E] Scenario branching.
117. [E] Campaign progression rules.
118. [E] Simulation speed controls.
119. [E] Background synthetic unit behavior.
120. [E] Campaign archive and restoration.

## 7. Enfusion and Arma Reforger integration

121. [D] Officially supported Enfusion integration layer.
122. [D] Dedicated-server adapter.
123. [D] Server-authorized live position reporting.
124. [D] Multiple friendly-unit positions, subject to authorization.
125. [D] Authorized unit status updates.
126. [D] Authorized vehicle status updates.
127. [D] Live objective synchronization.
128. [D] Game-to-Companion event reporting.
129. [D] Companion-to-game GM action requests where supported.
130. [D] Server-side validation of every requested game action.
131. [D] Confirmation of accepted or rejected commands.
132. [D] Clear distinction between simulated and real game state.
133. [D] Opt-in server connections.
134. [D] Graceful disconnection and reconnection.
135. [D] Stale-data indicators.
136. [D] Game-version compatibility handling.
137. [E] Server adapter capability negotiation.
138. [E] Live synchronization diagnostics.
139. [E] Controlled event subscription filters.
140. [E] Safe fallback when a game API changes.

## 8. Reforger Tools, Workbench and resource importing

141. [D] Import permitted metadata from local Reforger resources.
142. [D] Workbench-compatible resource inspection.
143. [D] Terrain metadata import.
144. [D] Object and entity identifier import.
145. [D] Faction metadata import.
146. [D] Coordinate-system compatibility.
147. [D] Local-only resource processing where appropriate.
148. [D] Avoid bundling proprietary assets without permission.
149. [D] Dedicated resource import gateway.
150. [D] Licensing and usage checks for imported data.
151. [E] Resource format version detection.
152. [E] Import preview and validation.
153. [E] Duplicate resource detection.
154. [E] Asset reference resolution.
155. [E] Missing-resource warnings.
156. [E] User-selectable import directories.
157. [E] Incremental resource indexing.
158. [E] Import compatibility reports.
159. [E] Resource cache management.
160. [E] Clear provenance records for imported content.

## 9. Collaboration, security and abuse prevention

161. [D] Shared operational picture for multiple operators.
162. [D] Collaborative mission annotations.
163. [D] Shared mission revisions.
164. [D] Role-based access control.
165. [D] Separate planner, observer and Game Master permissions.
166. [D] Server-owner opt-in and control.
167. [D] Server-authoritative actions.
168. [D] Strictly defined allowed commands.
169. [D] Authenticated bridge connections.
170. [D] Revocable session credentials.
171. [D] Emergency connection shutdown.
172. [D] Administrative audit logs.
173. [D] Privacy-conscious log retention.
174. [D] Abuse evidence export.
175. [D] A reporting pathway for suspected misuse.
176. [D] Potential cooperation with Bohemia on abuse handling.
177. [D] No unauthorized process memory manipulation.
178. [D] No hidden player tracking.
179. [E] Per-action rate limits and quotas.
180. [E] Approval workflows for sensitive GM actions.
181. [E] Permission checks at the server, not just in the UI.
182. [E] Conflict handling for simultaneous edits.
183. [E] Session and connection activity dashboards.
184. [E] Security-focused integration tests.
185. [E] Documented threat model and trust boundaries.

## 10. User experience, replay and platform growth

186. [D] Move toward a native interface if beneficial.
187. [D] Evaluate C#/.NET with Avalonia.
188. [D] Evaluate Godot for an interactive simulation interface.
189. [D] Keep Electron as an option while extracting the core.
190. [D] After-action event replay.
191. [D] After-action report generation.
192. [D] Recorded operational event timelines.
193. [D] Community plugin architecture.
194. [D] Multiple game and simulation adapters.
195. [D] Game-independent planning capabilities.
196. [E] Better tutorials and first-run onboarding.
197. [E] Reliable automatic backups and recovery.
198. [E] Repeatable builds and release verification.
199. [E] Plugin compatibility and permission management.
200. [D] A unified platform connecting ORBAT planning, Game Master control, simulation, live situational awareness and after-action analysis.

## What all 200 features are building toward

THE OVERALL PRODUCT VISION

# 77th JSOC Companion

Integrated Simulation & Operations Platform

Planning and ORBAT

40

Independent engine and GM

40

Simulation and campaigns

20

Enfusion integration and resources

40

Collaboration and security

25

Documentation, UX and platform growth

35

Grouped feature counts from this wishlist, not development progress.

One important reality check: the most consequential items aren't necessarily the flashiest. The engine boundary, JSON schemas, server authority, permission system and event history are what would let the Game Master, simulation and Enfusion integrations work together safely.

And I wouldn't treat all 200 as equally essential. Some are core architecture, some are user-facing features, and some are optional extensions.

But as a master vision for what your two-day project could grow into, this is a substantial, coherent direction — and it doesn't require pretending that every capability already exists.