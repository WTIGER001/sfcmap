# Token Packs

A token pack is a set of tokens (e.g. art) that can be used in game.

## Data Model

Token Pack
- id: unique Id for the pack
- name : name of the pack
- description: description of the pack
- author: author of the pack
- (optional) image : overview picture
- tokens: [] of tokens

Token
- id: unique id of the token
- name: name of the token
- image : token image url 
- (optional) 

>Questions: Should we associate lighting and barriers? 

## Use Case

1.) User goes to the tokens page
2.) Clicks "Add Packs"
3.) gets a selection dialog for choosing a pack(s)
4.) Clicks to ones to add
5.) The packs are copied into the game 
6.) THe packs are shown

Each pack is a file (like monsters) that is cached on the local computer. When a user uploads a token then that goes in his "Uploads" Pack. The images are in firebase storage. 

Marker Packs
- Same as Token packs but each definition is that of a marker type. 
- Can they be edited? Yes... I guess so but that will mean a new version. 

Need to have an Asset Manager

## New Token Pack
1.) select '+ New Token Pack'
2.) supply information
3.) Upload images
4.) Publish changes