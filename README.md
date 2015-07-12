## geo-tile

Library for mapping latitude / longitude pairs into geographically labeled buckets at different levels of resolution using a low complexity algorithm that makes is suitable for high scale processing. Follows the Open Street Maps / Google Maps algorithm for tile bounding (see http://wiki.openstreetmap.org/wiki/Tiles) making it suitable for use in prerendered map tile calculations as well.

Available in C#, JavaScript, and Python under the MIT license.

### Example Usage (JavaScript)

#### TileId from Latitude / Longitude / Zoom

    > var Tile = require('./tile.js');
    > Tile.tileIdFromLatLong(47.6097,-122.3331,18)
    '18_91548_41991'

#### Tile from TileId

    > Tile.tileFromTileId('18_91548_41991')
    { id: '18_91548_41991',
      zoom: 18,
      row: 91548,
      column: 41991,
      latitudeNorth: 47.60986653003798,
      latitudeSouth: 47.608940683080164,
      longitudeWest: -122.33413696289062,
      longitudeEast: -122.332763671875,
      centerLatitude: 47.60940360655907,
      centerLongitude: -122.33345031738281 }