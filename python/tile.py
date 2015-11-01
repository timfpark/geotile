import math

class Tile:

    MAX_ZOOM = 16;
    MIN_ZOOM = 0;

    @classmethod
    def tile_id_from_lat_long(cls, latitude, longitude, zoom):
        row = int(Tile.row_from_latitude(latitude, zoom))
        column = int(Tile.column_from_longitude(longitude, zoom))

        return Tile.tile_id_from_row_column(row, column, zoom)

    @classmethod
    def row_from_latitude(cls, latitude, zoom):
        return math.floor((1 - math.log(math.tan(latitude * math.pi / 180) + 1 / math.cos(latitude * math.pi / 180)) / math.pi) / 2 * (2 ** zoom))

    @classmethod
    def column_from_longitude(cls, longitude, zoom):
        return math.floor((longitude + 180.0) / 360.0 * (2 ** zoom))

    @classmethod
    def latitude_from_row(cls, row, zoom):
        n = math.pi - 2.0 * math.pi * row / (2 ** zoom);
        return (180.0 / math.pi * math.atan(0.5 * (math.exp(n) - math.exp(-n))))

    @classmethod
    def longitude_from_column(cls, column, zoom):
        return float(column) / (2 ** zoom) * 360.0 - 180.0;

    @classmethod
    def tile_from_tile_id(cls, tile_id):
        parts = tile_id.split('_')
        if len(parts) != 3:
            return

        tile = Tile()

        tile.tile_id = tile_id
        tile.zoom = int(parts[0])
        tile.row = int(parts[1])
        tile.column = int(parts[2])

        tile.latitude_north = Tile.latitude_from_row(tile.row, tile.zoom)
        tile.latitude_south = Tile.latitude_from_row(tile.row + 1, tile.zoom)

        tile.longitude_west = Tile.longitude_from_column(tile.column, tile.zoom)
        tile.longitude_east = Tile.longitude_from_column(tile.column + 1, tile.zoom)

        tile.center_latitude = (tile.latitude_north + tile.latitude_south) / 2.0
        tile.center_longitude = (tile.longitude_east + tile.longitude_west) / 2.0

        return tile;

    @classmethod
    def tile_id_from_row_column(cls, row, column, zoom):
        return str(zoom) + "_" + str(row) + "_" + str(column)

    def parent_id(self):
        return Tile.tile_id_from_lat_long(self.center_latitude, self.center_longitude, self.zoom-1)

    def parent(self):
        return Tile.tile_from_tile_id(self.parent_id())

    @classmethod
    def decode_tile_id(cls, tileId):
        parts = tileId.split('_');
        if len(parts) != 3:
            return;

        return {
            "id": tileId,
            "zoom": int(parts[0]),
            "row": int(parts[1]),
            "column": int(parts[2])
        };

    @classmethod
    def tile_ids_for_all_zoom_levels(cls, tileId):
        tile = Tile.tile_from_tile_id(tileId)
        tileIds = []
        for zoom in range(Tile.MAX_ZOOM, Tile.MIN_ZOOM, -1):
            tileId = Tile.tile_id_from_lat_long(tile.center_latitude, tile.center_longitude, zoom)
            tileIds.append(tileId)
        return tileIds

    def children(self):
        midNorthLatitude = (self.center_latitude + self.latitude_north) / 2;
        midSouthLatitude = (self.center_latitude + self.latitude_south) / 2;
        midEastLongitude = (self.center_longitude + self.longitude_east) / 2;
        midWestLongitude = (self.center_longitude + self.longitude_west) / 2;
        return [
            Tile.tile_id_from_lat_long(midNorthLatitude, midEastLongitude, self.zoom + 1),
            Tile.tile_id_from_lat_long(midNorthLatitude, midWestLongitude, self.zoom + 1),
            Tile.tile_id_from_lat_long(midSouthLatitude, midEastLongitude, self.zoom + 1),
            Tile.tile_id_from_lat_long(midSouthLatitude, midWestLongitude, self.zoom + 1)
        ]