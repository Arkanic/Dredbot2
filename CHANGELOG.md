## 13/7/21 b1
- Finally started making changelogs
- Dredbot now connects to a mongodb server and uses that as storage for previous ships
- Added `velocity` command that shows the ships that are gaining or loosing the most points
- Ported `players` command from old dredbot, which shows the current online players
- Ported `help` command from old dredbot, which shows all commands and their descriptions
- Massively refactored the caching system, so that it doesn't sit in `index.ts`
- Added command description and an optional "visible" boolean to the command object