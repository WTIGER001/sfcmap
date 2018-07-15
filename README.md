# Sfcmap

[![Build Status](https://travis-ci.com/WTIGER001/sfcmap.svg?branch=master)](https://travis-ci.com/WTIGER001/sfcmap)

sfcmap is a simple mapping utility for roleplaying game applications. It allows you to upload maps and add markers. This allows you to create a map library for your RPG maps to augment the tabletop games. Markers and maps have simple permissions that can be applied so all your players don't see the secrets waiting for them. This ia a general approach suitible for continent spanning maps, regional maps, town and city maps, building interiors and dungeons. See the [Demo](https://sfcmap.firebaseapp.com/)

scfmap uses the services in firebase to provide a backend, storage and authentication. *This project is in active development and will change frequently. It is certainly not ready for any real users as the data model (and even database) are being redesigned.*

![Screen shot](https://github.com/WTIGER001/sfcmap/blob/master/screenshot.png "Screenshot")

## Features

### User Login and Customization
- Firebase Authentication is used and users can authenticate with Google and Github.
- Users can temporarily 'opt-out' of a group they are part of. This allows a GM to turn off his GM role to show others his screen
- Recent maps are tracked
- Maps, Markers and other items can be restricted from viewing and editing. These restrictions apply to a named set of groups and/or users
- Groups can be created to hold users

### Map
- Map Manager allows users to upload their own maps.
- Maps can be placed in categories for organization and to limit the available markers
- Maps can be restricted from viewing or editing
- Calibrate a map to provide correct distance measurements (calibrating a map will also adjust the locations of all the markers)
- Measure distance on a map (Also provides pathfinder diagonal distances)
- Display grid lines based on a fixed spacing
- Drag and drop to change map categories
- Map images are stored on the firestorage as well as thumbnails

### Map Markers
- Marker Manager allows new types of markers to be created with custom icons
- Marker types can be restricted from viewing and editing
- Markers can be created on the map and dragged into place. 
- Markers can link to other maps, like a city on a continent map linking to the city map
- Markers can be fixed in size (screen coordinates) or change relative to the zoom level
- Markers can link to external web pages
- Markers can be selected from the map (one or more by holding down the CTRL key)
- Markers can be edited enmass an individually
- Markers can be organized into groups
- Markers and Marker Groups can be toggled from the map

## Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0. Run `npm start` to start the application in debug mode

## Known Issues
- LOTS of requests for data when a map is calibrated

## To Do

### Drawing Layers & Marker Management
- Need to refactor the layers page to allow polylines, polygons and circles. Maybe move the marker creation here too? 
- True Layers (e.g. Country borders, quarters) and allow polygons, lines, text and markers
- Select marker from layer list
- Switch to featureGroup layers and change the eventing
- Draw & edit polygons, lines, and text
- Marker Snap
- Drag and Drop a new marker on the page. 
- Marker hover information (tooltip) / click information (popup)
- Recent Markers area

### Map 
- Smoother zoom ( less spacing between Zoom levels) (I think this is a setting in the map)
- Fix icons in 'fixed' mode, they seem to move around as you zoom
- Router for maps and 'back button'. Router should also support a coordinate center and zoom
- Border Decoration for regions (a,b,c, etc)
- Switch to better scale
- Set map units
- Enable / Disable Scale
- Enable / Disable Coordinates
- Fixed Marker Size (in map units)

### Data Management
- Data Loading order seems recursive, fix this so there is not a ridiculous number of reloads
- Export / import icons 
- Upload Progress
- Redo some of the RxJS to use tap
- Migrate to Firestore, Use batches, deeper structure. 

### General Application
- Landing Page
- Loading Indicator
- Project or Game or Collection top level construct
- Maybe ditch dialogs and instead use a fly out panel
- Class names as member variables and then standard methods (implement Clone(), Clean(), etc...)

### Mobile Device Support 
- Tab icons are too small
- Measure and Calibrate dont work because there is no real 'mouse move' events
- Managers (map, marker and groups) are in dialogs and are too small - Separate to separate pages with a router - Started on this
- Auto expansion of tabs is annoying - make this a preference
- Tab close is too small. I want to swipe to close
- Map pane doesn't scroll on overflow
- would be nice to full screen or PWA
- Clicking on the measure or calibrate should diable the action
- Wipe / Pan should close tab (not sure why this is not working... HammerJS has been included)
(actually, the rest of it worked surprisingly well!)

### RPG Features ( hard stuff /// Out of scope)?
- Dice Roller
- Fog / Exposed areas (basically just draw), predefined areas too
- Character Icons
- Atlas / Collection
- Chat window ( can use skype )
- White Board
- Hexegon Graticules (bigger issue)

### Layers Tab
- Make the items selectable and aware of selections
- Select Multiple
- Replace bootstrap check box with custom one 
- Switch to LIs
- Use the List Drag and Drop to get the insertion point
- Show the Icons

## Notes
- Not sure how we should delete map types or marker categories

Got new shapes sort of working. Still need to: 
- Selection
- Circle doesnt seem to work
- Opacity is not correct...extract from the color
- Add help labels
- Delete
- Labels
