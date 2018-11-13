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

## Behavior

On browse - All token packs are listed

{
  "name" : "Name of Token Pack",
  "id" : "ID OF token Pack",
  "description" : "description", 
  


}