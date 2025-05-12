'use client';

import Map from 'ol/Map';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { type FC, useEffect, type HTMLAttributes } from 'react';
import clsx from 'clsx';
import type { ColorLike } from 'ol/colorlike';
import {
  Modify,
  Select,
  Snap,
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from 'ol/interaction';
import { click } from 'ol/events/condition';

interface Props extends HTMLAttributes<HTMLDivElement> {
  mapColor?: ColorLike;
  trendlineColor?: ColorLike;
  markerColor?: ColorLike;
}

export const CustomMapSection: FC<Props> = ({
  mapColor,
  trendlineColor,
  markerColor,
  ...props
}) => {
  useEffect(() => {
    createMap();
  }, []);

  function createMap() {
    //TODO: Create pie chart as markers
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

    const source = new VectorSource({
      url: '/geo/de_niedrig.geo.json',
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source,
      style: styleFunction,
    });

    const select = new Select({
      condition: click,
      style: new Style({
        fill: new Fill({
          color: '#eeeeee',
        }),
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2,
        }),
      }),
    });

    const modify = new Modify({
      features: select.getFeatures(),
    });

    const snap = new Snap({
      source: source,
    });

    new Map({
      target: 'map',
      layers: [vectorLayer],
      view: new View({
        center: fromLonLat([10.682127, 50.510924]),
        zoom: 5.9,
      }),
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom(),
        select,
        modify,
        snap,
      ]),
    });
  }

  return (
    <div className={clsx('bg-white w-full h-full', props.className)}>
      <div id="map" className="map w-full aspect-[23/26]"></div>
    </div>
  );
};

export default CustomMapSection;
