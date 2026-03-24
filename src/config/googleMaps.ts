import { Client } from "@googlemaps/google-maps-services-js";

const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";

export const googleMapsClient = new Client({});

export async function geocodeAddress(address: string) {
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY not set");
  const res = await googleMapsClient.geocode({ params: { address, key: apiKey } });
  return res.data;
}

export async function distanceMatrix(origin: string | string[], destination: string | string[]) {
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY not set");
  const res = await googleMapsClient.distancematrix({
    params: {
      origins: Array.isArray(origin) ? origin : [origin],
      destinations: Array.isArray(destination) ? destination : [destination],
      key: apiKey
    }
  });
  return res.data;
}