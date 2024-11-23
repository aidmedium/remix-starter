import { HttpTypes } from "@medusajs/types";

import { sdk } from "@/lib/config";
import medusaError from "@/lib/utils/medusa-error";

export async function listRegions() {
  return sdk.store.region
    .list({}, { next: { tags: ["regions"] } })
    .then(({ regions }) => regions)
    .catch(medusaError);
}

export async function retrieveRegion(id: string) {
  return sdk.store.region
    .retrieve(id, {}, { next: { tags: ["regions"] } })
    .then(({ region }) => region)
    .catch(medusaError);
}

const regionMap = new Map<string, HttpTypes.StoreRegion>();

export async function getRegion(countryCode: string) {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode);
    }

    const regions = await listRegions();

    if (!regions) {
      return null;
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region);
      });
    });

    const region = countryCode ? regionMap.get(countryCode) : regionMap.get("us");

    return region;
  } catch (e: any) {
    return null;
  }
}
