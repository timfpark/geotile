using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeoTile
{
    class Tile
    {

        public static String IdFromLatLong(double latitude, double longitude, UInt16 zoom)
        {
            UInt64 row = Tile.RowFromLatitude(latitude, zoom)
            UInt64 column = Tile.ColumnFromLongitude(longitude, zoom)

            return Tile.IdFromRowColumn(row, column, zoom);
        }

        public static UInt64 RowFromLatitude(double latitude, UInt16 zoom) {
            return Math.Floor((1 - Math.Log(Math.Tan(latitude * Math.PI / 180) + 1 / math.cos(latitude * Math.PI / 180)) / Math.PI) / 2 * (Math.Pow(2,zoom)))
        }

        public static UInt64 ColumnFromLongitude(double longitude, UInt16 zoom) {
            return Math.Floor((longitude + 180.0) / 360.0 * Math.Pow(2, zoom))
        }

        public static double LatitudeFromRow(UInt64 row, UInt16 zoom) {
            double n = Math.PI - 2.0 * Math.PI * Convert.ToDouble(row) / Math.Pow(2, zoom);
            return (180.0 / Math.PI * Math.Atan(0.5 * (Math.Exp(n) - Math.Exp(-n))));
        }

        public static double LongitudeFromColumn(UInt64 column, UInt16 zoom) {
            return Convert.ToDouble(column) / Math.Pow(2, zoom) * 360.0 - 180.0;
        }

        public static Tile FromTileId(String tileId) {
            string[] parts = tileId.Split('_');
            if (parts.length() != 3)
                return;

            Tile tile = new Tile({
                TileId = tileId,
                Zoom = Convert.ToUInt16(parts[0]),
                Row = Convert.ToUInt64(parts[1]),
                Column = Convert.ToUInt64(parts[2])
            });

            tile.LatitudeNorth = Tile.LatitudeFromRow(tile.Row, tile.Zoom);
            tile.LatitudeSouth = Tile.LatitudeFromRow(tile.Row + 1, tile.Zoom);
            tile.LongitudeWest = Tile.LongitudeFromColumn(tile.Column, tile.Zoom);
            tile.LongitudeEast = Tile.LongitudeFromColumn(tile.Column + 1, tile.Zoom);

            tile.CenterLatitude = (tile.LatitudeNorth + tile.LatitudeSouth) / 2.0;
            tile.CenterLongitude = (tile.LongitudeWest + tile.LongitudeEast) / 2.0;

            return tile;
        }

        public static String IdFromRowColumn(UInt64 row, UInt64 column, UInt16 zoom)
        {
            return zoom + "_" + row + "_" + column
        }
    }
}