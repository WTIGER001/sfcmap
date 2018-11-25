# Top Priorities

## Now


### Token Display on Map
- Show dead style on map
- Hide tokens from users (invisible)

### Token Edit / View Tab


## High
- Fix map links
- Rewrite Layers Tab
- Personal
-- Allow changing of size
- Refactor Token Record
- Conditions

## Medium

Character
- Character edit to show token details
- Update layout
- include search terms for tokens 'rpg token'

Encounters
- Round Tracking Bar for spells and haste
- Back button on the round tracker (maybe just a full dialog to edit round and turn) {SM}
- Saveable encounters that can be activated (preplace annotations ) {LG}

Maps
- Arrow buttons to move character on map {MED}
- Improve the measuring tool to have waypoints, show to other users and snap {LG} 

Model
- Better permissions {UNK - NEED DESIGN}

Tokens
- Tokens - Add organization into groups on the index page {MED}
- Tokens - Have the idea of a token pack with names and organization {MED}

UI General
- Consolidate and standardize CSS {LG}
- Reorganize Maps into hierarchial categories (or something to avoid one big bag of maps) {LG}
- Remember filter and sort state for each index
- Refactor code to have actions in services / utilities and have components only handle UI Interaction {XL}
- Allow images to be linked (e.g. provide place to paste or enter image url) {MED}

Gamesystems
- Provide standard definitions for conditions per game system
- On new character add all pathfinder attributes and rolls {MED}

Chat
- Private chat messages {MED}
- Add the abilty to provide hyperlinks in the chat to switch players to a map {MED}
- Refactor chat into a service and control, put the controls on all tabs {LG}


- Dynamic Lighting  {XL}
- Pathfinder specific lighting rules  {LG}
- [BUG] Fix map links
- [BUG] Dice history and up arrows
- [BUG] Linked maps load incorrectly, with no annotations and the old annotations are not properly cleared out
- [BUG] closing a map does not close the tabs
- [BUG] Deleting a creature from the encounter messes up initiative {MED}
- [BUG] Map map tab go away when the map is no longer visible {MED}

## Low

- Offline mode (PWA) {XL}
- Intro Web Page with login {LG}
- Styled way to show multiple tokens on the same square {SM}
- Import Vision types from HeroLab and PCGen imports {SM}
- Key bindings {MED}
- Undo / Redo {XL}
- Refactor code base into modules {XL}
- Mark characters as 'dead' {SM}
- Magic Item Support {LG}
- Spells Support {LG}
- NPCs support {XL}
- Macro language {XL}
- Support D&D5E - Monsters {XL}
- Support D&D5E - Rules {UNK}
- On new Game choose gamsystem {SM}
- On Game tile show proper game system {SM}
- In game use the rules for that game system {LG}
- Make a gamesystem a module {LG}
- Incorporate 'loot' boxes on map that allow the user to interact with (e,g, pickup) {MED}
- Create the concept of a 'party' that has a story, members and stuff {LG}
- [BUG] FIx the user login has to refresh
- Import TSV Dungeon from donjon dungeon builder including levels {XL}
- Tokens to Markers when zoomed out {LG}
- Lazy load images {MED}

## Very Low

- Weather emulation (snow, rain and wind) {MED}

## Styling 

- Icon colors
- Missing Button outlines
- Muted text too dark
- Map tab - Use Expander controls
- Better default aura color
- Filter box should be white and remove the help icon

## Epics / Milestones

- Dynamic lighting
- D&D5E support
- Offline Support
- Dungeon Importer
- Code refactor / module support
- Chat refactor
- Command driven architecture

## Done

- Drag token without having to click first  {MED}
- [BUG] Multiple of the same monsters in an encounter  {MED}
- Move measuring tool to map tool bar {SM}
- [BUG] Restyle Game Edit page to use dark theme {SM}
- Leaflet Component Overlay - Overlay a component on the map and allow dragging, resizeing, etc. {LG}
- Make Selections better / Restyle
- Hide inforamtion if the token gets too small (on the map)
- Fix Order: Bars, Rolls, Condition, Stats,  Auras, Lights
- Tokens as Angular components
- Make the token aware of selection and highlight correctly (add iconselected class)
- Show 'things' on selection
- [BUG] Fix model updates to the bar values
- Add / minus in bars
- GM become a player (for fow and lighting)
- Show Flight / Burrow speed
- Show Name / Style Name
- Allow the token configuration to be copied to the character (e.g. standard for all other drops)
- Make bars show up when selected 
- Flight / Burrow styling - Add a above/below ground field to the token {MED}
- Add aura popups up dialog to start with
- Add bar pops up dialog to start with and add values to bar
- Show the name of a token annotation on the map and update with zoom 
- [BUG] Fix flags on maps... They have not been showing up on the map anymore but they do show up on the chat {SM}
- Marker Types and Map Types - Make available on the map index 
- Allow changing of size
- Automatic auras for reach
