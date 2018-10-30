# Lighting

Lighting is the capablity that supports players navigating the map on their own and having the map dynamically lit to the extent of the characters vision. There are a few major concepts to consider for lighting. 

**Light Source** - Light sources emit light. They do so up to a given range and can have optional dim lighting effects. Light sources can be seen by players who have a direct line of sight. Players can carry their own sources of light
**Vision**- Tokens can have vision. Vision is for seeing in various lighting conditions. For instance Dark vision and lowlight vision..Maybe we just add special visions
**Barriers** - Barriers block light.. Thats it!

-----------
Emits light
40' 20' dim
Checkbox ALL Players can see this light


Tourch
- Emits Normal Light 20'
- Emits Dim light 40'
- Anyone can see

Darkvision
- Emits Normal Light 60' (no color) 
- No Dim ligh
- Shared vision or just me

'Light'
- Light
- Magical Darkness
- Magical Light
- 'Vision'

'Detect' - No Range on Emission
- Magic
- Chaos / Law / Evil / Good
- Incoporeal
- Invisible
- Scent

Light Levels: 
Bright, Normal, Dim, Dark, Magical Dark

Daylight == BRIGHT
Under Trees during the day == Normal

Generate a gridded light map... All light sources and overlaying and then calculating
- Start with the ambient light (NONE)
- 

USE CASE #1
- Ambient Light None
- Torch
- Result Normal Light within20' and from 20' to 40' dim light, Darkness everywhere else
USE CASE #1A
- Ambient Light : DIM
- Torch
- Result Normal Light within 20' and from 20' to 40' NORMAL light, DIM everywhere else
DIM+DIM = NORMAL

USE CASE #2
- Ambient Light None
- Torch
- Magic Darkness 30' 10'R Away from torch
- Result At the tourch NORMAL(2) at 20' intersection of torch and darkness it is magaically dark (5)

USE CASE #3
- Ambient Light NONE
- Magical Light 20' R
- Result  Normal Light within20' and from 20' to 40' dim light

USE CASE #4
- Ambient Light None
- Magical Light
- Magic Darkness 30' 10'R Away from torch
- Result At the tourch NORMAL(2) at 20' intersection of torch and darkness it is magaically dark (5)


