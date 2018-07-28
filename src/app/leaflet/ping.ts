/**
 * Ping creates a ping for users to see where the other users are pointing. This works by 
 * creating a mouse listener on the map and on a long press the ping is fired. Once fired
 * the ping creates a temporary SVG annotation on the map that is animated. The ping fires
 * an event off to the firebase database and then deletes that item after a few seconds. 
 * The client that recieves the event and shows the ping (and maybe plays the ping sound).
 * 
 */

export class Ping {

}