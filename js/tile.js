function Tile() {}

Tile.MAX_ZOOM = 18;
Tile.MIN_ZOOM = 0;

Tile.tileIdFromLatLong = function(latitude, longitude, zoom) {
    var row = Tile.rowFromLatitude(latitude, zoom);
    var column = Tile.columnFromLongitude(longitude, zoom);

    return Tile.tileIdFromRowColumn(row, column, zoom);
};

Tile.rowFromLatitude = function(latitude, zoom) {
    return Math.floor((1-Math.log(Math.tan(latitude*Math.PI/180) + 1/Math.cos(latitude*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))
};

Tile.columnFromLongitude = function(longitude, zoom) {
    return (Math.floor((longitude+180.0)/360.0*Math.pow(2,zoom)));
};

Tile.latitudeFromRow = function(row, zoom) {
    var n=Math.PI-2.0*Math.PI*row/Math.pow(2.0,zoom);
    return (180.0/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
};

Tile.longitudeFromColumn = function(column, zoom) {
    return (column/Math.pow(2,zoom)*360.0-180.0);
};

Tile.tileIdsForBoundingBox = function(bbox, zoom) {
    var tileNWId = Tile.tileIdFromLatLong(bbox.north, bbox.west, zoom);
    var tileSEId = Tile.tileIdFromLatLong(bbox.south, bbox.east, zoom);

    var tileNW = Tile.tileFromTileId(tileNWId);
    var tileSE = Tile.tileFromTileId(tileSEId);

    var rowDelta = tileSE.row - tileNW.row;
    var columnDelta = tileSE.column - tileNW.column;

    var spanningTileIds = [];
    for (var rowIdx=0; rowIdx <= rowDelta; rowIdx++) {
        for (var columnIdx=0; columnIdx <= columnDelta; columnIdx++) {
            spanningTileIds.push(
                Tile.tileIdFromRowColumn(tileNW.row + rowIdx, tileNW.column + columnIdx, zoom)
            );
        }
    }
    return spanningTileIds;
};

Tile.tileFromTileId = function(tileId) {
    var tile = Tile.decodeTileId(tileId);

    tile.latitudeNorth = Tile.latitudeFromRow(tile.row, tile.zoom);
    tile.latitudeSouth = Tile.latitudeFromRow(tile.row + 1, tile.zoom);

    tile.longitudeWest = Tile.longitudeFromColumn(tile.column, tile.zoom);
    tile.longitudeEast = Tile.longitudeFromColumn(tile.column + 1, tile.zoom);

    tile.centerLatitude = (tile.latitudeNorth + tile.latitudeSouth) / 2.0;
    tile.centerLongitude = (tile.longitudeEast + tile.longitudeWest) / 2.0;

    return tile;
};

Tile.tileIdsForZoomLevels = function(latitude, longitude, minZoom, maxZoom) {
    var tileIds = [];
    for (var zoom=minZoom; zoom <= maxZoom; zoom++) {
        var tileId = Tile.tileIdFromLatLong(latitude, longitude, zoom);
        tileIds.push(tileId);
    }

    return tileIds;
};

Tile.decodeTileId = function(tileId) {
    var parts = tileId.split('_');
    if (parts.length !== 3)
        return;

    return {
        id: tileId,
        zoom: parseInt(parts[0]),
        row: parseInt(parts[1]),
        column: parseInt(parts[2])
    };
};

Tile.tileIdFromRowColumn = function(row, column, zoom) {
    return zoom + "_" + row + "_" + column;
};

Tile.tileIndexInZoomLevel = function(row, column, zoom) {
    return Math.pow(2, zoom) * row + column;
};

Tile.childrenForTileId = function(tileId) {
    var tile = Tile.tileFromTileId(tileId);
    var midNorthLatitude = (tile.centerLatitude + tile.latitudeNorth) / 2;
    var midSouthLatitude = (tile.centerLatitude + tile.latitudeSouth) / 2;
    var midEastLongitude = (tile.centerLongitude + tile.longitudeEast) / 2;
    var midWestLongitude = (tile.centerLongitude + tile.longitudeWest) / 2;

    return [
        Tile.tileIdFromLatLong(midNorthLatitude, midEastLongitude, tile.zoom + 1),
        Tile.tileIdFromLatLong(midNorthLatitude, midWestLongitude, tile.zoom + 1),
        Tile.tileIdFromLatLong(midSouthLatitude, midEastLongitude, tile.zoom + 1),
        Tile.tileIdFromLatLong(midSouthLatitude, midWestLongitude, tile.zoom + 1)
    ]
};

Tile.childrenForTileIdAtZoom = function(tileId, zoom) {
     var tileList = Tile.childrenForTileId(tileId);
     while (Tile.tileFromTileId(tileList[0]).zoom !== zoom) {
         var currentTileId = tileList.shift();
         var children = Tile.childrenForTileId(currentTileId);
         tileList = tileList.concat(children);
     }

     return tileList;
};

Tile.neighborIds = function(tileId) {
    var decodedId = Tile.decodeTileId(tileId);

    return [
       Tile.tileIdFromRowColumn(decodedId.row,   decodedId.column+1, decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row+1, decodedId.column+1, decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row+1, decodedId.column,   decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row+1, decodedId.column-1, decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row,   decodedId.column-1, decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row-1, decodedId.column-1, decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row-1, decodedId.column,   decodedId.zoom),
       Tile.tileIdFromRowColumn(decodedId.row-1, decodedId.column+1, decodedId.zoom),
    ];
};

module.exports = Tile;
