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
- Delete Marker Group
- Export / import icons 
- Bulk edit marker types (Select a bunch and edit the anchor)
- Refilter when someone assumes a group (change to unchecklist)


## Prority 2
- Try out some plugins
-- Draw
- Router for maps and 'back button'. Router should also support a coordinate center and zoom
- Smoother zoom ( less spacing between Zoom levels) (Hard)
- Refilter when someone assumes a group (change to unchecklist)
- Use buttons for tool bar
- Toolbar fix for enablement
- Map: Square Graticules (w/ controls)
- Select marker from layer list

## Priority 3
- USe LIs for Tabs
- Distance Measure 
- Distance Calibrate
- Marker Snap
- Marker Edit mode
- Marker hover information (tooltip) / click information (popup)

## Prority 4
- Landing Page
- Loading Indicator
- Project or Game or Collection top level construct
- Class names as member variables and then standard methods (implement Clone(), Clean(), etc...)
- Recent Markers area
- Maybe ditch dialogs and instead use a fly out panel

## Prority 5
- Test on phone (need to make slide outs full pages)
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
- Graticule
-- Move (left / right / up / down)
-- X/Y Spacing

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
