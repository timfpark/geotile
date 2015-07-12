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
}

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

Tile.tileIdsForAllZoomLevels = function(tileId) {
	var tile = Tile.tileFromTileId(tileId);

    var tileIds = [];
    for (var zoom=Tile.MAX_ZOOM; zoom > Tile.MIN_ZOOM; zoom--) {
        var tileId = Tile.tileIdFromLatLong(tile.centerLatitude, tile.centerLongitude, zoom);
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

module.exports = Tile;
