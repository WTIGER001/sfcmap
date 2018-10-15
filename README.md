# Sfcmap

[![Build Status](https://travis-ci.com/WTIGER001/sfcmap.svg?branch=master)](https://travis-ci.com/WTIGER001/sfcmap)

sfcmap is a simple mapping utility for roleplaying game applications. It allows you to upload maps and add markers. This allows you to create a map library for your RPG maps to augment the tabletop games. Markers and maps have simple permissions that can be applied so all your players don't see the secrets waiting for them. This ia a general approach suitible for continent spanning maps, regional maps, town and city maps, building interiors and dungeons. See the [Demo](https://sfcmap.firebaseapp.com/)

scfmap uses the services in firebase to provide a backend, storage and authentication. *This project is in active development and will change frequently. It is certainly not ready for any real users as the data model (and even database) are being redesigned.*

![Screen shot](https://github.com/WTIGER001/sfcmap/blob/master/screenshot.png "Screenshot")

## Features
------------------------------------------------------------------------------------------------------------

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
- Long pressing on the mouse will plant a flag down at a point and notify everyon

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
- Markers, Rectangles and Images can be snapped in place

### Keyboard Actions
- CTRL+C = Copy (copy an annotation)
- CTRL+X = CUT (cut the annotation and wait for a paste. If the paste never happens then do not delete)
- CTRL+V = PASTE (paste the annotation, centered on the mouse)
- CTRL+M = New Marker (not working yet)
- CTRL+I = Ping where the mouse is (not working yet)
- DEL    = Delete the item that is selected
- CTRL+U = deselect all (not working yet)

## Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0. Run `npm start` to start the application in debug mode

## Known Issues
- You have to click on a layer twice the first time to get the effect

## To Do
------------------------------------------------------------------------------------------------------------

### Monsters 
- Figure out the cr - bug
- Look at making "Type" pages (an image for a category). This could be cool. Basicially search would kick in on 'enter' and categories of 'type', 'cr' and 'Alphabetical' can be used to limit the number of results. Card can b made programttically for each.
<link href="https://fonts.googleapis.com/css?family=MedievalSharp" rel="stylesheet"> or Lobster Two, Oleo
- Convert monsters to characters (for encounters)
- Drop on encounter
- Edit
- Duplicate detection
- Add filtering criteria to the url

### Encounters
- Create index / card / edit / view
- Add restrictions and restriction filtering
- Add an encouter screen with the maps a side piece and then other stuff on the sides
- Set Restrictiions
- Roll initiative
- Build an interface to the online monster databases
- Figure out how to get the center and the zoom level on the nav bar as the user is navigating...
- Add Buttons: Group Roll, ?
- Count Down or Count up effects (Spell Lasts for x rounds)
- Drag and Drop the peron on to the map to generate a properly sized marker
- Move encounter to the encounter index page
- Encounter Cards (large and small)
- Encounter Table 
- Search for monsters and NPCs

### Characters
- Get more information from the character import, maybe categories of attributes, maybe abilities
- Change the side panel to be ones in your cart?  
- Fix line spacing for small text
- Fix small screen size artifacts
- Improve the editor
- Drop onto an encounter
- More sort and filter options
- Add known associates
- Search by group (just like type)
- add filtering criteria to the url
- Add 'anchor' points to the image picker. 9 points in all. 

### Annotations
- Marker hover information (tooltip) / click information (popup)
- Custom Marker Annotations
- Map Link should have optional coordinates
- Need new maplink control that has type ahead and coordinates
- Image Annotation Fixes: 
-- keep aspect
- Cancel needs to revert any changes made
- Cut and paste
- Tags / Labels
- Need to merge marker types and images... I think that they are really the same thing. Images are used to scale with the map and markers are for nonscaled. This will allow me to get rid of that stupid icon cache. MarkerType-Variable = ImageOverlay and MarkerType-Fixed = Marker, ImageAnnotation-variable = Image Overlay, ImageAnnotation-fixed = Marker. I just need to figure out how to edit the marker useing the drag handles... 

### Map 
- Add map browser just like the monster browser
- Support large maps that should be tiled. This will mean that we have to figure out how to image tile (likely in a server function) and then translate it into tile urls that leaflet can understand. Serving it all from firebase storage
- Figure out the buggy loading issues
- Fog / Exposed areas (basically just draw), predefined areas too
- White Board
- Mobile Fog of war based on user vision, but aware of doors and obstacles
- Auras
- Test on Firefox and edge

### Data Management
- Export / import marker types 
- Add validation to map form
- Add validation to map Type form
- Add validation to marker Type form
- Add validation to group form

### General Application
- Remove the temporary objects like category and mergedmap type
- move the dbPath functions to the data service
- explore e2e testing
- clean up the css to the big style sheet

### Mobile Device Support 
- Measure and Calibrate dont work because there is no real 'mouse move' events
- would be nice to full screen or PWA
- swipe / Pan should close tab (not sure why this is not working... HammerJS has been included)

### Characters
- Allow the 'author' to see the character details
- Group By Folder Name
- Add "favorite" star feature
- Send to encounter or bag
Add 'Crit-Range' and 'Fumble-Range' to the dice rolls. 
request roll {
    name, expression, crit-range, fumble range, crit message, fumble message, needs confirm?
}
Example :
{
    name: "Attack",
    exp : "d20+18",
    cr : "15-20,
    fr : "1",
    crm : "Critical Threat!",
    frm : "Confirm that fumble!"
    confirm : 'true'
}

On chat
- Minimize message
- Delete Message
- Pin Message (Send to the top and don't let it go away... maybe sticky?)

/pm [anything] <--- Whatever is there keep only to this user, dont broadcast
/gm [group] [anything] <-- Whatever is there keep only to members of the group

Look into the permissions for firebase

### Game
- Tie in game logos
- Better edit page... the current one is ugly
- GM Notes
- Zoom in effect on hover for game cards
- figure our Game System and Game
- 'admins' are the GMs for games
- @Media queries


Caching Notes
- Cache to indexDB

What are the possible changes? 
- Add item
- Remove Item
- Change item

Include change date? 
- Query since change dates

Token Annotations:
- Use Arrows and numpad to move
- Highlight the selected token
- Show auras (either decimated or normal)
- Figure out what can be editted
- Toggle visiblity
- Restrictions
- Turn off snap on 'ctrl' key
- Keep track of hit points, etc or delegate
- HP Bar
- Show status effects / icons

Lighting
- Set light level (ambient)
- Get vision to work (Multiple types of emissions)
- Create standard colors for emissions (light, dark, )
- Figure out how to deal with invisible and etheral items / vision

Light Barriers
- Material and Thickness
- Convert Polylines / polygons to walls or doors


Point Emitter
The normal emitters. Emit light

Area emitters are just areas that can be detected by a certain detection type

Characters
- Add 'token' field and control
- Add vision type(s) to a character
-- Ex. Normal Vision: 120', Dark Vision 60'
- Add Light and Vision to a character
-- Include the ablility 

Monsters
- Add 'token' field and control
- Determine how to manage
- Per User? Game? Application? Game System?

Tokens
- Determine how to manage
- Per User? Game? Application?
- Consider using object-fit

Select Dialog
- Add Search / Filter
- Add Sort
- Add Double Click
- Add Favorites / Recent?
- Use virtual scroll solution

Utilities
- Draw decimated / gridded radius

Map
- Mouse over information
-- Lighting Level
-- Mouse over object(s)
- Box select

USE CASES
------------
Add Token with 

IDEAS for Decimated radius
- Just use boxes the same size as the grid and snap them in place. 

Lighting Progress
1.) Add Vision object to character
2.) Show Vision as simple circle (non editable). Display when selected or always?
3.) Darken whole map (not sure how)



Characters...
- Add Aura
-- Radius
-- Color
-- Display: Players to see

- Detector
--- Radius
