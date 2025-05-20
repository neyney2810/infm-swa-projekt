'use client';

import { useEffect, type FC, type HTMLAttributes } from 'react';
import clsx from 'clsx';
import OLMap from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Fill, Stroke, Style, Text, Icon } from 'ol/style';
import {
  Modify,
  Select,
  Snap,
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from 'ol/interaction';
import { click } from 'ol/events/condition';
import { MarkerData } from '@/app/types';
import MarkerCreator from './MarkerCreator';

interface Props extends HTMLAttributes<HTMLDivElement> {
  mapColor?: string;
  trendlineColor?: string;
  markerColor?: string;
  markers?: MarkerData[];
}

export const Map: FC<Props> = ({
  mapColor,
  trendlineColor,
  markerColor,
  markers,
  ...props
}) => {
  useEffect(() => {
    // Create a marker layer
    const markerElems: Feature[] = [];
    markers?.forEach((markerdata, index) => {
      const pieChart = new Feature({
        geometry: new Point(
          fromLonLat([Number(markerdata.lon), Number(markerdata.lat)]),
        ),
      });
      pieChart.setId('marker-' + index);
      pieChart.setStyle(() => {
        return new Style({
          image: new Icon({
            img: new MarkerCreator().createPiechart({
              innerValue: markerdata.innerValue,
              values: markerdata.values,
              colors: ['#00a64c', '#fcb900', '#ae328e', '#f50800', '#2962ff'],
              radius: markerdata.radius,
              stroke: markerdata.stroke,
            }),
          }),
          text: new Text({
            text: markerdata.innerValue.toString(),
            fill: new Fill({ color: '#000' }),
          }),
        });
      });
      markerElems.push(pieChart);
    });

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
      features: markerElems,
    });

    const vectorLayer = new VectorLayer({
      source,
      style: styleFunction,
    });

    const select = new Select({
      condition: click,
      style: new Style({
        fill: new Fill({ color: '#eeeeee' }),
        stroke: new Stroke({ color: 'rgba(255, 255, 255, 0.7)', width: 2 }),
      }),
    });

    const modify = new Modify({ features: select.getFeatures() });
    const snap = new Snap({ source });

    new OLMap({
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
  }, [mapColor, trendlineColor, markers]);

  return (
    <div className={clsx('bg-white w-full h-full', props.className)}>
      <div id="map" className="map w-full aspect-[23/26]"></div>
    </div>
  );
};

export default Map;
