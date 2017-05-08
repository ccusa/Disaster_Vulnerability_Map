# This script converts the shapefiles from shapefiles
# to GeoJSON and then to tile vectors

## Installation should only be run if the programs are not installed
# Install tippecanoe using homebrew from the command line
brew install tippecanoe

# Install GDAL
brew install gdal --enable-unsupported --with-libkml --with-mysql

# Install node.js
brew install node

# Install MBTiles
npm install -g mbview

## File conversion
# SVI data is available at both county and tract level.
# In the map, we show county level data until the viewer zooms in
# to 8, when we display tract level data.

## Convert shapefile to GeoJSON
# County level data
ogr2ogr -f GeoJSON svi2014_county.geojson counties.shp -progress

# Tract level data
ogr2ogr -f GeoJSON svi2014_tract.geojson tracts.shp -progress

## Convert GeoJSON into vector tiles
# County level data
tippecanoe -o svi2014_county.mbtiles svi2014_county.geojson -Z 3 -z 7 --no-tiny-polygon-reduction --detect-shared-borders --simplification=10 --layer=SVI_County

# Tract level data
tippecanoe -o svi2014_tract.mbtiles svi2014_tract.geojson -Z 8 -z 12 --no-tiny-polygon-reduction --detect-shared-borders --simplification=10 --layer=SVI_Tract

## View data using MBTiles
# Set API key
export MAPBOX_ACCESS_TOKEN='pk.eyJ1IjoibHVrYXNtYXJ0aW5lbGxpIiwiYSI6ImNqMHBuYXEwcDAwdGoycXJ4Z2xwb2d2NjYifQ.KYk6rQNWpAZ4fBm6utbb2w'

# Launch view in browser
mbview svi2014_tract.mbtiles
