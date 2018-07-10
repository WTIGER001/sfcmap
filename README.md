# Sfcmap

[![Build Status](https://travis-ci.com/WTIGER001/sfcmap.svg?branch=master)](https://travis-ci.com/WTIGER001/sfcmap)

sfcmap is a simple mapping utility for roleplaying game applications. It allows you to upload maps and add markers. This allows you to create a map library for your RPG maps to augment the tabletop games. Markers and maps have simple permissions that can be applied so all your players don't see the secrets waiting for them. This ia a general approach suitible for continent spanning maps, regional maps, town and city maps, building interiors and dungeons. See the [Demo](https://sfcmap.firebaseapp.com/)

scfmap uses the services in firebase to provide a backend, storage and authentication. 

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
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0. Run npm start to start the application in debug mode

## Known Issues
- After login you have to refresh
- LOTS of requests for data when a map is calibrated

## TODO
My TODO List

### Priority 1
- Login Sequence --- Fix completely...Basically dont do anything unless they are logged in... consider anonymous users
- Data Loading order seems recursive
- Migrate to Firestore, Use batches, deeper structure. 
- Fix icons in 'fixed' mode, they seem to move around as you zoom
- Export / import icons 
- Upload Progress

### Prority 2
- Try out some plugins
-- Draw
- Router for maps and 'back button'. Router should also support a coordinate center and zoom
- Smoother zoom ( less spacing between Zoom levels) (Hard)
- Select marker from layer list
- True Layers (e.g. Country borders, quarters) and allow polygons, lines, text and markers
- Draw & edit polygons, lines, and text
- Switch to featureGroup layers and change the eventing
- Incorporate Draw Plugin (https://github.com/Leaflet/Leaflet.Editable)

### Priority 3
- Marker Snap
- Marker hover information (tooltip) / click information (popup)

### Prority 4
- Landing Page
- Loading Indicator
- Project or Game or Collection top level construct
- Class names as member variables and then standard methods (implement Clone(), Clean(), etc...)
- Recent Markers area
- Maybe ditch dialogs and instead use a fly out panel

### Prority 5
- Test on phone 
- Border Decoration for regions (a,b,c, etc)

### RPG Features ( hard stuff /// Out of scope)?
- Dice Roller
- Fog / Exposed areas (basically just draw), predefined areas too
- Character Icons
- Atlas / Collection
- Chat window ( can use skype )
- White Board
- Hexegon Graticules (bigger issue)

### Other
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

