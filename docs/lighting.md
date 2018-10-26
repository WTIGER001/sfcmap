# Lighting

Lighting is the capablity that supports players navigating the map on their own and having the map dynamically lit to the extent of the characters vision. There are a few major concepts to consider for lighting. The lighting capablity models the concept of emitters, recievers and barriers. These concepts apply to each type of 'emission type'. An emmission type is the type of the emission that can be detected by the reciever. For instance: visible light, magic, scent, good, evil, etc. An emitter 'broadcasts' this 'light' and a reciever can detect it, up to a given range. A barrier can block the emission.

# Emission Types
The emission types are configurable by game system and for the most part they are just represented by names. The following emission types are the default for the pathfinder system. 
- light - E.g. Visible light
- darkness - This refers to magical darkness
- magic - This is typically the result of a detect magic spell or similar ability
- scent - This is used to 'see' inivisble people that have a scent. Not used for tracking... but that is cool idea
- good, evil, chaos, law - detect those of a certain alignment
- invisible - detect invisibile
- incorporeal - detect incorporeal

# Emitter Attributes
name - Name of the emitter
enabled - If this emitter is considered active
type - type of emission
distance - distance it is emitted
angle start - the start angle for the emission (0-2PI), defaults to 0
angle end - the end angle for the emission (0-2PI), defaults to 2PI

# Receiver / Detector Attributes
name - Name of the detector
enabled - If this detector is considered active
type - type of emission that can be seen
distance - distance that can be seen
amplification - the multiplicative factor that is applied to the emission (distance) (e.g. a 10' emission range would be detected at 20' by a detector with an amplication of 2 ), defaults to 1.0
angle start - the start angle for the receiver (0-2PI), defaults to 0
angle end - the end angle for the receiver (0-2PI), defaults to 2PI

# Barrier Attributes
name - Name of the barrier
enabled - if this barrier is enabled
types - types of emmissions that this barrier blocks
transmission - The amount (0-100%) of the emission that is transmitted through. E.g. if the barrier has a 50% transmission factor then a 20' emission would only emit 10'
