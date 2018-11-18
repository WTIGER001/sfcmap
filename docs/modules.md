# Modules


## Main Module
DEPENDS ON : ALL
- Tabs



## Mapping Module
DEPENDS ON: Data, COmmon, Character, Encounter
- The Map view
- The map tabs
- Selection support
- Map model objects
- leaflet

## Character Module
DEPENDS ON: Data, Common
- Character views

## Encounter Module
DEPENDS ON: Data, COmmon, Character, Monster

## Admin Module
DEPENDS ON: 
- components/admin


## Shared UI
- styles
- router
- pipes
- login
- game 
- gamesystem
- dialogs
- controls
- components

## Data / Services
DEPENDS ON: Common
- Data Service
- Key bindings 
- Message Servuce
- Cache Service
- Model
- UTIL

## Common Services (Meant for multiple applications)
DEPENDS ON : NOTHING
- Common Dialogs
- Some Utitlies
- Notify Service