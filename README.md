## geotile

Library for mapping latitude / longitude pairs into XYZ geo buckets
at different zoom level resolutions using a low complexity algorithm
that makes it suitable for high scale processing. Follows the
Open Street Maps / Google Maps algorithm for tile divisions
(see http://wiki.openstreetmap.org/wiki/Tiles) for low impedence use with
those systems.

Available in C#, JavaScript, and Python under the MIT license. Pull requests
gladly welcomed for other languages.

### Example Usage in JavaScript (for other languages see tests)

#### Map latitude, longitude, zoom level to tileId

```
Tile.tileIdFromLatLong(36.9719, -122.0264, 10);

==> '10_398_164'
```

#### Get tile object from tile id

```
Tile.tileFromTileId('10_398_164');

==> {
  id: '10_398_164',
  zoom: 10,
  row: 398,
  column: 164,
  latitudeNorth: 37.16031654673676,
  latitudeSouth: 36.87962060502677,
  longitudeWest: -122.34375,
  longitudeEast: -121.9921875,
  centerLatitude: 37.01996857588176,
  centerLongitude: -122.16796875
}
```

#### Get tile ids for a range of zoom levels

```
Tile.tileIdsForZoomLevels(36.9719, -122.0264, 10, 12);

==> [
    '10_398_164',
    '11_797_329',
    '12_1594_659'
]
```

#### Get tile ids for bounding box at zoom level', function(done) {

```
Tile.tileIdsForBoundingBox({
    north: 37.16,
    east: -121.99,
    south: 36.88,
    west: -122.34
}, 11);

==> [
    '11_796_328',
    '11_796_329',
    '11_796_330',
    '11_797_328',
    '11_797_329',
    '11_797_330'
]
```

#### Get children for tile id

```
Tile.childrenForTileId('10_398_164');

==> [
    '11_796_329',
    '11_796_328',
    '11_797_329',
    '11_797_328'
]
```

#### Get children for tile id at a zoom level

```
Tile.childrenForTileIdAtZoom('10_398_164', 12);

==> [
    '12_1592_659',
    '12_1592_658',
    '12_1593_659',
    '12_1593_658',
    '12_1592_657',
    '12_1592_656',
    '12_1593_657',
    '12_1593_656',
    '12_1594_659',
    '12_1594_658',
    '12_1595_659',
    '12_1595_658',
    '12_1594_657',
    '12_1594_656',
    '12_1595_657',
    '12_1595_656'
]
```

#### Get neighbors for tile id

```
Tile.neighborIds('10_398_164');

==> [
    '10_398_165',
    '10_399_165',
    '10_399_164',
    '10_399_163',
    '10_398_163',
    '10_397_163',
    '10_397_164',
    '10_397_165'
]
```