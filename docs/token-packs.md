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


Link to create a new token pack
Edit Page
- Layout
- Drop new image
- Drop url
- Create new Token
- Save Function
- Cancel Function
- Maintainers
View Page
- Layout
- Show Items
- Add function
Index Page
- Show Token Packs
- Subscribe to Token Packs
- View and Edit Actions
- Limit edit to 'maintainers'
Token Packs
- Verify download
- Verify Edit and publish path
- Make sure they show up in the selection panel
My Tokens / Game Tokens
- Allow users to upload tokens - Not sure how
User Picker Control (based on tags)