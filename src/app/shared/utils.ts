import {getDistance} from "ol/sphere";
import {toLonLat} from "ol/proj";

function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  return getDistance(toLonLat(coord1), toLonLat(coord2));
}

export const utilsFunctions={
  calculateDistance
}
