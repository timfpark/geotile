import unittest
from tile import Tile

class TestTile(unittest.TestCase):

  def test_tile_id_from_lat_long(self):
      tileId = Tile.tile_id_from_lat_long(36.9719, -122.0264, 10);
      self.assertEqual(tileId, '10_398_164');

  def test_tile_from_tile_id(self):
      tile = Tile.tile_from_tile_id('10_398_164');

      self.assertEqual(tile.zoom, 10);

      self.assertEqual(tile.row, 398);
      self.assertEqual(tile.column, 164);

      self.assertEqual(tile.latitude_north, 37.16031654673676);
      self.assertEqual(tile.latitude_south, 36.879620605026766);
      self.assertEqual(tile.longitude_west, -122.34375);
      self.assertEqual(tile.longitude_east, -121.9921875);
      self.assertEqual(tile.center_latitude, 37.01996857588176);
      self.assertEqual(tile.center_longitude, -122.16796875);

  def test_tile_ids_for_zoom_levels(self):
      tile_ids = Tile.tile_ids_for_zoom_levels(36.9719, -122.0264, 10, 12);

      self.assertEqual(tile_ids, [
            '12_1594_659',
            '11_797_329',
            '10_398_164'
      ]);

  def test_tile_id_from_bounding_box(self):
      tile_id = Tile.tile_id_from_bounding_box(
          37.15031654673676, 
          -121.83640625, 
          37.03009820136812,
          -121.9821875
      )

      self.assertEqual(tile_id, '11_796_330');

  def test_tile_ids_for_bounding_box(self):
      tile_ids = Tile.tile_ids_for_bounding_box({
          "north": 37.16,
          "east": -121.99,
          "south": 36.88,
          "west": -122.34
      }, 11);

      self.assertEqual(tile_ids, [
          '11_796_328',
          '11_796_329',
          '11_796_330',
          '11_797_328',
          '11_797_329',
          '11_797_330'
      ]);

  def test_children(self):
      tile = Tile.tile_from_tile_id('10_398_164')

      self.assertEqual(tile.children(), [
          '11_796_329',
          '11_796_328',
          '11_797_329',
          '11_797_328'
      ]);

  def test_neighbors(self):
      tile = Tile.tile_from_tile_id('10_398_164')

      self.assertEqual(tile.neighbors(), [
           '10_398_165',
           '10_399_165',
           '10_399_164',
           '10_399_163',
           '10_398_163',
           '10_397_163',
           '10_397_164',
           '10_397_165'
      ]);

if __name__ == '__main__':
    unittest.main()
