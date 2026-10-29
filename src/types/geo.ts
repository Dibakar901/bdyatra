import { BangladeshDivision, DestinationCategory } from './destination';

export interface DistrictInfo {
  id: string;
  name: string;
  divisionId: string;
  divisionName: BangladeshDivision;
  popularFor: string;
  topAttractions: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPin: {
    x: number;
    y: number;
  };
}

export interface DivisionInfo {
  id: string;
  name: BangladeshDivision;
  tagline: string;
  description: string;
  topAttractions: string[];
  districts: DistrictInfo[];
  bestSeason: string;
  vibe: string;
  travelTips: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  mapLabelPosition: {
    x: number;
    y: number;
  };
  svgPath: string;
  colorScheme: {
    fill: string;
    hoverFill: string;
    selectedFill: string;
    stroke: string;
    badgeBg: string;
    badgeText: string;
  };
}
