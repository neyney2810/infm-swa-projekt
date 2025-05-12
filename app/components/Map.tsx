'use client';

import Map from 'ol/Map';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Layer, Vector as VectorLayer } from 'ol/layer';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { type FC, useEffect, useState, type HTMLAttributes } from 'react';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import clsx from 'clsx';
import type { ColorLike } from 'ol/colorlike';
import { readData } from '@/app/utils/read-items';

type Location = {
  name: string;
  lon: string;
  lat: string;
  offsetX: number;
  offsetY: number;
  [key: string]: any;
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  mapColor?: ColorLike;
  trendlineColor?: ColorLike;
  markerColor?: ColorLike;
}

enum StyleType {
  Polygon = 'Polygon',
  MultiPolygon = 'Multipolygon',
  geoMarker = 'geoMarker',
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  LinearRing = 'LinearRing',
  MultiLineString = 'MultiLineString',
  GeometryCollection = 'GeometryCollection',
}

const markerStyle = (color: string) => {
  if (color == 'red') {
    return new Style({
      image: new CircleStyle({
        radius: 10.5,
        fill: new Fill({ color: 'rgba(255, 0, 0, 1)' }),
      }),
    });
  } else {
    return new Style({
      image: new CircleStyle({
        radius: 6.5,
        fill: new Fill({ color: 'rgba(187, 205, 81, 1)' }),
      }),
    });
  }
};

export const CustomMapSection: FC<Props> = ({
  mapColor,
  trendlineColor,
  markerColor,
  ...props
}) => {
  let hit = null;
  let element = '';
  // const [mapLabel, setMapLabel] = useState<String | number | undefined>('')
  // const [markerId, setMarkerId] = useState<number | undefined>()

  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    readData('stoffklasse', {}).then((productData: any[]) => {
      const locations =
        productData[0].locations.length > 0
          ? productData[0].locations.map((elem: any) => elem.locations_id)
          : [];
      createMap(locations);
      setLocations(locations);
    });
  }, []);

  function createMap(locations: Location[]) {
    const markers = createMarker(locations);
    const styleFunction: any = function (feature: Feature) {
      // const hello: keyof typeof StyleType = feature!.getGeometry()!.getType()
      let style: Style = new Style({});
      switch (feature!.getGeometry()!.getType()) {
        case 'Polygon': {
          style = new Style({
            stroke: new Stroke({
              color: trendlineColor || 'white',
              width: 1,
            }),
            fill: new Fill({
              color: mapColor || 'rgba(223,239,250,255)',
            }),
          });
          break;
        }
        case 'MultiPolygon': {
          style = new Style({
            stroke: new Stroke({
              color: trendlineColor || 'white',
              width: 1,
            }),
            fill: new Fill({
              color: mapColor || 'rgba(223,239,250,255)',
            }),
          });
          break;
        }
        default: {
          break;
        }
      }
      return style;
    };

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: markers,
        url: '/geo/de_niedrig.geo.json',
        format: new GeoJSON(),
      }),
      style: styleFunction,
    });

    const zoom = () => {
      if (window.innerWidth <= 660)
        return (5.5 * Math.log(window.innerWidth)) / Math.log(500);
      if (window.innerWidth <= 768) {
        return 5.74;
      }
      if (window.innerWidth <= 1024)
        return (5.3 * Math.log(window.innerWidth)) / Math.log(768);
      return 5.7;
    };

    const map = new Map({
      target: 'map',
      layers: [vectorLayer],
      view: new View({
        center: fromLonLat([10.682127, 50.510924]),
        zoom: zoom(),
      }),
      controls: [],
      interactions: [],
    });

    window.onresize = () => {
      console.log('resize1');
      map.setView(
        new View({
          center: fromLonLat([10.682127, 50.510924]),
          zoom: zoom(),
        })
      );
    };

    const updateMarkerStyle = (feature: Feature) => {
      // console.log(feature.setStyle(new Style(feature.getStyle().getText())))
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 4.5,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
          }),
        })
      );
    };

    let selected: Feature | null = null;
    let currentStyle: Style | CircleStyle = new Style({
      fill: new Fill({
        color: '#eeeeee',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
      }),
    });
    const selectStyle = new Style({
      fill: new Fill({
        color: '#eeeeee',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
      }),
    });

    // map.on("pointer", function (this: Map, evt: MapBrowserEvent<PointerEvent>) {
    //   if (selected != null) {
    //     selected.setStyle(
    //       new Style({
    //         image: new CircleStyle({
    //           radius: 6.5,
    //           fill: new Fill({ color: markerColor || "rgba(187, 205, 81, 1)" })
    //         })
    //       })
    //     );
    //     selected = null;
    //   }
    //   hit = this.forEachFeatureAtPixel(evt.pixel, (feature: any, layer: Layer) => {
    //     // setMapLabel(feature.getId())
    //     if (feature.getGeometry()?.getType() === "Point") {
    //       selected = feature;
    //       currentStyle = feature.getStyle().getImage() as CircleStyle;
    //       feature.setStyle(markerStyle("red"));
    //       return true;
    //     }
    //   });
    //   console.log("tupel: ", hit, " ,", element);
    //   if (hit) {
    //     this.getTargetElement().style.cursor = "pointer";
    //   } else {
    //     this.getTargetElement().style.cursor = "";
    //   }
    // });
  }

  function createMarker(locations: Location[]) {
    let markers: any[] = [];
    locations.forEach((element, index) => {
      let city = new Feature({
        geometry: new Point(
          fromLonLat([Number(element.lon), Number(element.lat)])
        ),
      });
      city.setId('marker-' + index);
      city.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6.5,
            fill: new Fill({ color: markerColor || 'rgba(187, 205, 81, 1)' }),
          }),
          // text: new Text({
          //   font: '12px Calibri,sans-serif',
          //   overflow: true,
          //   text: element.name,
          //   offsetX: element.offsetX,
          //   offsetY: element.offsetY,
          // }),
        })
      );
      markers.push(city);
    });
    return markers;
  }

  return (
    <div className={clsx('bg-white w-full h-full', props.className)}>
      <div id="map" className="map w-full aspect-[23/26]"></div>
    </div>
  );
};

export default CustomMapSection;
