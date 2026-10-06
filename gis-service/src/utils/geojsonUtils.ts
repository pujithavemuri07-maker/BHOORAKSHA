import { LatLngCoord } from '../api/types';

export const coordsToGeoJSON = (coords: LatLngCoord[]) => {
  if (!coords || coords.length === 0) return null;
  // GeoJSON uses [longitude, latitude]
  const geojsonCoords = coords.map(([lat, lng]) => [lng, lat]);
  // Ensure closed polygon ring
  if (
    geojsonCoords[0][0] !== geojsonCoords[geojsonCoords.length - 1][0] ||
    geojsonCoords[0][1] !== geojsonCoords[geojsonCoords.length - 1][1]
  ) {
    geojsonCoords.push([geojsonCoords[0][0], geojsonCoords[0][1]]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [geojsonCoords],
    },
  };
};

export const calculateCentroid = (coords: LatLngCoord[]): LatLngCoord => {
  if (!coords || coords.length === 0) return [17.4435, 78.3772];
  let sumLat = 0;
  let sumLng = 0;
  coords.forEach(([lat, lng]) => {
    sumLat += lat;
    sumLng += lng;
  });
  return [sumLat / coords.length, sumLng / coords.length];
};

export const calculateApproxAreaAcres = (coords: LatLngCoord[]): number => {
  if (!coords || coords.length < 3) return 0;
  let area = 0;
  const numPoints = coords.length;
  for (let i = 0; i < numPoints; i++) {
    const j = (i + 1) % numPoints;
    const lat1 = (coords[i][0] * Math.PI) / 180;
    const lng1 = (coords[i][1] * Math.PI) / 180;
    const lat2 = (coords[j][0] * Math.PI) / 180;
    const lng2 = (coords[j][1] * Math.PI) / 180;
    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = (Math.abs(area) * 6378137 * 6378137) / 2.0;
  // Convert square meters to acres (1 acre = 4046.86 sq meters)
  return Number((area / 4046.86).toFixed(2));
};
