# Reference Material

Reference material, such as monsters, spells and rules

## Things to Cache
- Monsters
- Standard NPCs
- Magic Items
- Tokens Packs



This option is to move away from the firebase database for this and instead use the storage area. THe flow would be as follows:

STARTUP
- User logs in
- Read the /cache/users/{userid} object (and subscribe)
- Read the /cache/assets/{gamesystem} (and subscribe)
- Get the 'cache-inventory' item 
- Compare each 'cached-item' with each other.
-- If they are the same version then skip
-- If the firebase item is newer then download and process
-- If the cached-item is newer then download and process (this is likely an error)

PROCESSING
Each item type should have a processor. In general the expectation is that the item is stored as a 'deflated' object
- Save the data to memory
- inflate the data
- load the data as json
- save the object into the cache (but also keep it around)

LOADING
using the cache service we can request an item and that item will be fully loaded

item$ : ReplaySubject<Monster[]> = new ReplaySubject(1)
cachesvc.load$('pathfinder/monsters').subscribe( (monsters : Monster[]) => {
  
})

ON CHANGE REMOTE
-



class Pathfinder {
  monsters$ : ReplaySubject<Monster[]> = new ReplaySubject(1)

  loadReferences()  {
    this.cachesvc = 
  }
}

pathfinder.getMonsters$().subscribe( (monsters : Monster[]) => {
  // Do something
}


user$.pipe(
  mergeMap( u => getCacheItems())
).subscribe( cachedItems => {
  validateCache(cachedItems)
}


### Structure
User / Recent Game Systems 

Game System
