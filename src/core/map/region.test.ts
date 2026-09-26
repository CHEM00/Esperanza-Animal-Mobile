import { isWithinBounds, regionFittingPoints, regionFromCenterZoom } from "./region";

const MEXICO = { minLat: 14.4, maxLat: 32.8, minLng: -118.6, maxLng: -86.6 };

describe("regionFromCenterZoom", () => {
  it("a más zoom, menos grados visibles", () => {
    const city = regionFromCenterZoom({ lat: 18.15, lng: -94.42 }, 12.5);
    const national = regionFromCenterZoom({ lat: 23.8, lng: -102.5 }, 4.2);
    expect(city.latitude).toBe(18.15);
    expect(city.longitudeDelta).toBeLessThan(national.longitudeDelta);
    expect(city.latitudeDelta).toBeLessThan(city.longitudeDelta);
  });
});

describe("regionFittingPoints", () => {
  it("sin puntos no hay región; un punto usa el zoom de respaldo", () => {
    expect(regionFittingPoints([], 15)).toBeNull();
    const single = regionFittingPoints([{ lat: 18.15, lng: -94.42 }], 15);
    expect(single).toEqual(regionFromCenterZoom({ lat: 18.15, lng: -94.42 }, 15));
  });

  it("encuadra varios puntos con margen", () => {
    const region = regionFittingPoints(
      [
        { lat: 18.1, lng: -94.5 },
        { lat: 18.2, lng: -94.3 },
      ],
      15,
    );
    expect(region).not.toBeNull();
    expect(region?.latitude).toBeCloseTo(18.15);
    expect(region?.longitude).toBeCloseTo(-94.4);
    expect(region?.longitudeDelta).toBeGreaterThan(0.2);
    expect(region?.latitudeDelta).toBeGreaterThan(0.1);
  });
});

describe("isWithinBounds", () => {
  it("acepta puntos de México y rechaza los de fuera", () => {
    expect(isWithinBounds({ lat: 19.43, lng: -99.13 }, MEXICO)).toBe(true);
    expect(isWithinBounds({ lat: 40.41, lng: -3.7 }, MEXICO)).toBe(false);
  });
});
