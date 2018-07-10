# Sfcmap

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# TODO

Colors

---THEME 1----
Background  - Gun Metal Gray    - #2C3531
            - Blue Sapphire     - #116466
Selection   - Peach             - #D9B08C
            - Tan               - #FFCB9A
Text        - Light             - #D1E8E2


## Priority 1
- Login Sequence --- Fix completely...Basically dont do anything unless they are logged in... consider anonymous users
- Data Loading order seems recursive
- Migrate to Firestore, Use batches, deeper structure. 
- Fix icons in 'fixed' mode, they seem to move around as you zoom
- Export / import icons 
- Upload Progress

## Prority 2
- Try out some plugins
-- Draw
- Router for maps and 'back button'. Router should also support a coordinate center and zoom
- Smoother zoom ( less spacing between Zoom levels) (Hard)
- Select marker from layer list
- True Layers (e.g. Country borders, quarters) and allow polygons, lines, text and markers
- Draw & edit polygons, lines, and text
- Switch to featureGroup layers and change the eventing
- Incorporate Draw Plugin (https://github.com/Leaflet/Leaflet.Editable)

## Priority 3
- Marker Snap
- Marker hover information (tooltip) / click information (popup)

## Prority 4
- Landing Page
- Loading Indicator
- Project or Game or Collection top level construct
- Class names as member variables and then standard methods (implement Clone(), Clean(), etc...)
- Recent Markers area
- Maybe ditch dialogs and instead use a fly out panel

## Prority 5
- Test on phone 
- Border Decoration for regions (a,b,c, etc)

## RPG Features ( hard stuff /// Out of scope)?
- Dice Roller
- Fog / Exposed areas (basically just draw), predefined areas too
- Character Icons
- Atlas / Collection
- Chat window ( can use skype )
- White Board
- Hexegon Graticules (bigger issue)

---------------------

Layer / Marker Selection

Layer Types:
- Image Overlay 
-- Controls: 
- Feature Group
-- List Layers
- Marker
-- 


Name Ideas:
- Atlas
- Map Book
- Gazateer
- Gallery

Collections / Atlas / Volume

id
parentId?
name
description?
image
view?
edit?

prefs
+ recentProjects

Import / Export
-------------------
Marker Types (e.g. Icon Sets)
Map
Map With Markers

Grid
----------------
Options - 5ft grid.
Zoom in to a layer... 
-- Offset X, Y
-- Size 

Layers Tab
- Make the items selectable and aware of selections
- Select Multiple
- Replace bootstrap check box with custom one 
- Switch to LIs
- Use the List Drag and Drop to get the insertion point
- Show the Icons

Map
- Switch to better scale
- Set map units
- Enable / Disable Scale
- Enable / Disable Coordinates
- Fixed Marker Size (in map units)

