# Lighting

Lighting is the capablity that supports players navigating the map on their own and having the map dynamically lit to the extent of the characters vision. There are a few major concepts to consider for lighting. 

**Light Source** - Light sources emit light. They do so up to a given range and can have optional dim lighting effects. Light sources can be seen by players who have a direct line of sight. Players can carry their own sources of light
**Vision**- Tokens can have vision. Vision is for seeing in various lighting conditions. For instance Dark vision and lowlight vision..Maybe we just add special visions
**Barriers** - Barriers block light.. Thats it!

## Approach

**Draw Barriers**
The GM selects either the polygon, polyline or rectangle tool from the annotation tab. They draw a shape and save the shape.  Once they are happy with the shape (the color does not matter) then they click on the "Convert to Lighting Barrier" button. This will tag it as a barrier and remove it from normal display. Under the covers this is still a shapeannotation but we will filter it out by default 

**Add Light Sources** 
Light sources are attached to annotations (typically tokens, but it can also be an image or marker). So first the GM must add a token or other annotation. Then they will see on the "Light Source" control. Enabling this will show the light source controls. They enter the information about the light source. This adds the light to the map tab for easy enable / disable toggling.

_Lighting Library_ (or whatever a good name is) is a collection of pregenerated light sources. These are available for simple addition to the map. 

**Vision** 
The Player or GM sets up each player, character or token with vision. There are a few choices. Normal vision, low light vision and dark vision are the types of vision available. This is editable in the character sheet