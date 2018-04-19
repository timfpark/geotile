"use strict";

var assert = require("assert"),
    Tile = require("../../tile");

describe("geotile", function() {
    it("can map latitude, longitude, zoom level to tileId", function(done) {
        let tileId = Tile.tileIdFromLatLong(36.9719, -122.0264, 10);
        assert.equal(tileId, "10_398_164");
        done();
    });

    it("can create tile object from tileId", function(done) {
        let tile = Tile.tileFromTileId("10_398_164");

        assert.equal(tile.zoom, 10);

        assert.equal(tile.row, 398);
        assert.equal(tile.column, 164);

        assert.equal(tile.latitudeNorth, 37.16031654673676);
        assert.equal(tile.latitudeSouth, 36.879620605026766);
        assert.equal(tile.longitudeWest, -122.34375);
        assert.equal(tile.longitudeEast, -121.9921875);
        assert.equal(tile.centerLatitude, 37.01996857588176);
        assert.equal(tile.centerLongitude, -122.16796875);

        done();
    });

    it("can get tile ids for a range of zoom levels", function(done) {
        let tileIds = Tile.tileIdsForZoomLevels(36.9719, -122.0264, 10, 12);

        assert.deepEqual(tileIds, ["10_398_164", "11_797_329", "12_1594_659"]);

        done();
    });

    it("can get tile ids for bounding box", function(done) {
        let tileIds = Tile.tileIdsForBoundingBox(
            {
                north: 37.16,
                east: -121.99,
                south: 36.88,
                west: -122.34
            },
            11
        );

        assert.deepEqual(tileIds, [
            "11_796_328",
            "11_796_329",
            "11_796_330",
            "11_797_328",
            "11_797_329",
            "11_797_330"
        ]);

        done();
    });

    it("can get children for tile id", function(done) {
        let tileIds = Tile.childrenForTileId("10_398_164");

        assert.deepEqual(tileIds, [
            "11_796_329",
            "11_796_328",
            "11_797_329",
            "11_797_328"
        ]);

        done();
    });

    it("can get children for tile id at a zoom level", function(done) {
        let tileIds = Tile.childrenForTileIdAtZoom("10_398_164", 12);

        assert.deepEqual(tileIds, [
            "12_1592_659",
            "12_1592_658",
            "12_1593_659",
            "12_1593_658",
            "12_1592_657",
            "12_1592_656",
            "12_1593_657",
            "12_1593_656",
            "12_1594_659",
            "12_1594_658",
            "12_1595_659",
            "12_1595_658",
            "12_1594_657",
            "12_1594_656",
            "12_1595_657",
            "12_1595_656"
        ]);

        done();
    });

    it("can get neighbors for tile id", function(done) {
        let tileIds = Tile.neighborIds("10_398_164");

        assert.deepEqual(tileIds, [
            "10_398_165",
            "10_399_165",
            "10_399_164",
            "10_399_163",
            "10_398_163",
            "10_397_163",
            "10_397_164",
            "10_397_165"
        ]);

        done();
    });

    it("can get most zoomed in common zoom level for corners of bounding box", function(done) {
        let commonZoom = Tile.commonZoomFromBoundingBox({
            north: 37.050809,
            south: 36.969512,
            east: -121.871014,
            west: -121.90744
        });

        assert.equal(commonZoom, 10);

        done();
    });
});
