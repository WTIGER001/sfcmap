# Detections

Lighting is the capablity that supports players navigating the map on their own and having the map dynamically lit to the extent of the characters vision.There are a few major concepts to consider for lighting.The lighting capablity models the concept of emitters, recievers and barriers.These concepts apply to each type of 'emission type'.An emmission type is the type of the emission that can be detected by the reciever.For instance: visible light, magic, scent, good, evil, etc.An emitter 'broadcasts' this 'light' and a reciever can detect it, up to a given range.A barrier can block the emission.

## Emission Types
The emission types are configurable by game system and for the most part they are just represented by names.The following emission types are the default for the pathfinder system. 
- magic - This is typically the result of a detect magic spell or similar ability
- scent - This is used to 'see' inivisble people that have a scent.Not used for tracking...but that is cool idea
- good, evil, chaos, law - detect those of a certain alignment
- invisible - detect invisibile
- incorporeal - detect incorporeal

## Emitter Attributes
name - Name of the emitter
enabled - If this emitter is considered active
type - type of emission
distance - distance it is emitted
angle start - the start angle for the emission(0 - 2PI), defaults to 0
angle end - the end angle for the emission(0 - 2PI), defaults to 2PI

## Receiver / Detector Attributes
name - Name of the detector
enabled - If this detector is considered active
type - type of emission that can be seen
distance - distance that can be seen
amplification - the multiplicative factor that is applied to the emission(distance)(e.g.a 10' emission range would be detected at 20' by a detector with an amplication of 2 ), defaults to 1.0
angle start - the start angle for the receiver(0 - 2PI), defaults to 0
angle end - the end angle for the receiver(0 - 2PI), defaults to 2PI

## Barrier Attributes
name - Name of the barrier
enabled - if this barrier is enabled
types - types of emmissions that this barrier blocks
transmission - The amount(0 - 100 %) of the emission that is transmitted through.E.g.if the barrier has a 50 % transmission factor then a 20' emission would only emit 10'

## Maps
Maps can be designed to contain emitters, recievers and barriers.

Emitters on the map are implemented with tokens.A token can have emission elements.In general these tokens are set up with the restrictions set o view only and the snap off.Emissions can be shown in the same manner as an aura for the players.This is setup by default on selection.

  Recievers / Detectors are also implemented with tokens.Generally these are used for things like traps and alarms.Generally these items are set with restrictions of GM only and the token is never shown the the players.

Barriers are implemented in one of two ways on the map.The first way is for a custom map where the GM uses tokens to build the map.Any token can be a barrier with the same behavior as described for emitters.There is one interesting idea of supporting secret doors with tokens that the GM can dynamically change between.This idea has still yet to be properly explored.The other implementation of barriers is for the GM to draw polylines that represent the barriers.This method is used mostly in predrawn maps and is a great way to use external art in the game.

## Character and Monsters
Characters and monsters are also represented by tokens.These tokens typically will have a mix of emitters and receivers configured.Both characters and monsters can have their standard emmitters and receivers configured and copied in to the token each time a token is generated.

## Lighting Token Library
There is a reference library of lighting tokens.These are 'ready to use' items that are intened to quicken the design of maps.