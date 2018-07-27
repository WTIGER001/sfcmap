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

### Annoations
- Marker Manager allows new types of markers to be created with custom icons
- Annotations types can be restricted from viewing and editing
- Markers, Rectangles, Polylines and Polygons are types of Annoations that can be created
- Annoations can be created on the map and dragged into place. 
- Annoations can link to other maps, like a city on a continent map linking to the city map
- Markers can be fixed in size (screen coordinates) or change relative to the zoom level
- Annoations can link to external web pages
- Annoations can be selected from the map (one or more by holding down the CTRL key)
- Annoations can be edited enmass and individually
- Annoations can be organized into layers
- Annoations and layers can be toggled from the map

## Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0. Run `npm start` to start the application in debug mode

## Known Issues
- Annotations get disconnected when they are edited. They show up fine on the map but you have to click them again to have the tab work correctly

## To Do

### Annotations
- Marker Snap
- Marker hover information (tooltip) / click information (popup)
- Custom Marker Annotations
- Map Link should have optional coordinates
- Image Annotation Fixes: 
-- keep aspect
-- snap
- Cancel needs to revert any changes made
- Cut and paste

### Map 
- Restyle zoom buttons
- Router for maps and 'back button'. Router should also support a coordinate center and zoom
- Border Decoration for regions (a,b,c, etc)
- Fixed Marker Size (in map units)

### Data Management
- Export / import marker types 
- Add validation to map form
- Add validation to map Type form
- Add validation to marker Type form
- Add validation to group form

### General Application
- Project or Game or Collection top level construct. This would probably be a new launch page. You can choose between games. Maybe have some sort of "world" and "Chapter or Module" level structure that can add to the overall game world. Or instead of a fixed heirarchy just used tags.. I think i like that the best. Allow users to tag a map, etc. and then filter by those tags. Keep the concept of a game world. I need to figure out a good way to show an image of each world. Not sure what the "game" object looks like. a game should have members and possibly characters and npcs. 

- Remove the temporary objects like category and mergedmap type
- move the dbPath functions to the data service
- explore e2e testing
- clean up the css to the big style sheet

### Mobile Device Support 
- Tab icons are too small
- Measure and Calibrate dont work because there is no real 'mouse move' events
- would be nice to full screen or PWA
- swipe / Pan should close tab (not sure why this is not working... HammerJS has been included)

### RPG Features ( hard stuff /// Out of scope)?
- Fog / Exposed areas (basically just draw), predefined areas too
- Character Icons
- Atlas / Collection
- White Board
- Mobile Fog of war based on user vision, but aware of doors and obstacles
- Auras
- Ping Graphic, I have the sound...

## Design Thoughts
Still have to figure out how I want to grow the application to support RPGs... How much this could replace
a normal table top simulator. I think i need a 'realtime' layer somehow. That should be nothing more than
another type of list on firebase. One that save is called all the time (on a debounce).
 
I can see content for a map just for a single game or something...

Fix coordinates
Allow points to be added to line

