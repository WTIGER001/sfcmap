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
Background  - Gun Metal Gray - #2C3531
            - Blue Sapphire - #116466
Selection   - Peach - #D9B08C
            - Tan - #FFCB9A
Text        - Light - #D1E8E2


## Big
- Need to make a marker selection control...


## Misc
- Landing Page
- Loading Indicator
- Try out some plugins
-- Draw
- Group into modules? 
-- Map, Marker, User?

## Model
- Marker Groups / Layers to control visiblity easily?
- Test on phone (need to make slide outs full pages)
- Default marker at the Map Type and Map level
- Project or Game or Collection top level construct
- Class names as member variables and then standard methods
- implement Clone(), Clean(), etc...

## Services
- Refilter when someone assumes a group

## Markers Tab
- Restrictions dialog
- Use buttons for tool bar
- Toolbar fix for enablement
- Recent Markers area

## Map 
- Pan limits
- Marker to Other Map Links

## Marker Manager
- Applies to fix
- Maybe ditch dialogs and instead use a fly out panel

## Map Side Panel
- Styling and typeography
- Slide out pannel to choose more
- Collapseable

## Info Tab
- Not sure if I need to keep this... dont know what the content is...

## RPG Features?
- Dice Roller
- Chat window
- Distance Measure
- Distance Calibrate
- Marker Snap
- Marker Edit mode
- White Board
- Graticules at a predfined scale
- Hexegon Graticules (bigger issue)


## Tree Ideas
<tree>
    <tree-item *ngFor="let a of items" [value]="a" [template]="tree-item-content'>
        <tree-item [value]="a" [template]="tree-item-content' > </tree-item>
    </tree-item>
</tree>

<ng-template #tree-item-expanded>
    <fa-icon icon='caret-left' size='lg' [fixedwidth]='true'>
</ng-template>
<ng-template #tree-item-collapsed>
    <fa-icon icon='caret-down' size='lg' [fixedwidth]='true'>
</ng-template>
<ng-template #tree-item-content>
    <fa-icon icon='caret-down' size='lg' [fixedwidth]='true'>
</ng-template>
