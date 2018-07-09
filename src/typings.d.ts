import * as L from 'leaflet';
import SimpleGraticule from 'leaflet-simple-graticule'
declare module 'leaflet' {
    namespace control {
        function coordinates(v: any);
    }
    
    var BoxSelect: any
    function simpleGraticule(options: any);
}
