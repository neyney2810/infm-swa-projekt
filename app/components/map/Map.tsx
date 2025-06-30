'use client';

import {
  useEffect,
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
} from 'react';
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
  defaults as defaultInteractions,
  DragRotateAndZoom,
} from 'ol/interaction';
import { MarkerData } from '@/app/types';
import MarkerCreator from './MarkerCreator';
import Legend from './Legend';

interface Props extends HTMLAttributes<HTMLDivElement> {
  mapColor?: string;
  trendlineColor?: string;
  markers?: MarkerData[];
  showType: MapShowStateType;
}

type MapShowStateType = 'point' | 'donut';

const colorPalette = [
  '#00a64c',
  '#fcb900',
  '#ae328e',
  '#f50800',
  '#2962ff',
  '#ff6f00',
  '#00bcd4',
  '#8bc34a',
  '#9c27b0',
  '#ff9800',
  '#2196f3',
  '#4caf50',
  '#e91e63',
  '#ff5722',
  '#673ab7',
  '#3f51b5',
  '#009688',
  '#cddc39',
];

export const Map: FC<Props> = ({
  mapColor,
  trendlineColor,
  markers,
  showType,
  ...props
}) => {
  // const [mapShowState, setMapShowState] = useState<boolean>(true);
  const mapRef = useRef<OLMap | null>(null); // Persist the map instance
  const featureRef = useRef<VectorLayer | null>(null); // Persist the selected feature
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  // Create map
  useEffect(() => {
    const source = new VectorSource({
      url: '/geo/de_niedrig.geo.json',
      format: new GeoJSON(),
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

    const vectorLayer = new VectorLayer({
      source,
      style: styleFunction,
    });

    mapRef.current = new OLMap({
      target: 'map',
      layers: [vectorLayer],
      view: new View({
        center: fromLonLat([10.682127, 50.9]),
        zoom: 6.2,
      }),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    });
  }, []);

  useEffect(() => {
    console.log('Markers:', markers);
    const reducedMarkers = markers?.map((marker) => {
      let sum = 0;
      let reducedMarkerValue: number[] = [];
      let ids: string[] = [];
      for (let i = 0; i < marker.values.length; i++) {
        if (sum >= marker.total * 0.8) {
          break;
        }
        let v = marker.values[i];
        if (v) {
          sum += v;
          reducedMarkerValue.push(v);
          if (marker.ids && marker.ids[i]) {
            ids.push(marker.ids[i]);
          }
        }
      }
      reducedMarkerValue.push(marker.total - sum);
      ids.push('others'); // Add a rest category for the remaining value

      return {
        ...marker,
        values: reducedMarkerValue,
        ids: ids,
      };
    });

    let colorMap: Record<string, string> = {};
    let allIds = new Set(
      markers?.reduce((acc, marker) => {
        if (marker.ids) {
          return acc.concat(marker.ids);
        }
        return acc;
      }, [] as string[]) || [],
    );
    if (allIds.size > 0) {
      colorMap = Object.fromEntries(
        Array.from(allIds).map((id, index) => [
          id,
          colorPalette[index % colorPalette.length],
        ]),
      );
    }
    setColorMap(colorMap);

    if (!mapRef.current) return;
    if (featureRef.current) {
      mapRef.current.removeLayer(featureRef.current);
      featureRef.current = null;
    }
    // if (showType === 'donut') {
    // Create a marker layer
    const markerElems: Feature[] = [];
    markers?.forEach((markerdata, index) => {
      const sortedValues = markerdata.values?.sort((a, b) => b - a) || [];
      const totalValue = markerdata.total;
      const cumulativeValues: { value: number; id: string }[] = [];
      let cumulativeSum = 0;

      while (cumulativeSum < totalValue * 0.8 && sortedValues.length > 0) {
        const value = sortedValues.shift() || 0;
        cumulativeSum += value;
        cumulativeValues.push({
          value: value,
          id: markerdata.ids?.[sortedValues.length] || '',
        });
      }

      if (markerdata.total === 0) return;

      const pieChart = new Feature({
        geometry: new Point(
          fromLonLat([Number(markerdata.lon), Number(markerdata.lat)]),
        ),
      });
      pieChart.setId('marker-' + index);
      pieChart.setStyle(() => {
        let colors: string[] = (cumulativeValues ?? []).map(
          (item) => colorMap[item.id] || colorPalette[0],
        );
        return new Style({
          image: new Icon({
            img: new MarkerCreator().createPiechart({
              total: markerdata.total,
              values: cumulativeValues.map((item) => item.value),
              colors: colors,
              radius: markerdata.radius,
              stroke: markerdata.stroke,
            }),
          }),
          text: new Text({
            text:
              markerdata.total > 10
                ? markerdata.total.toString().split('.')[0]
                : markerdata.total.toString(),
            fill: new Fill({ color: '#000' }),
            font: '12.5px sans-serif',
          }),
        });
      });

      // Add hover interaction to show Bundesland name
      const map = mapRef.current;
      if (!map) return;

      map.on('pointermove', (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
        let hoverLabel = document.getElementById('hover-label');

        if (feature === pieChart) {
          if (!hoverLabel) {
            hoverLabel = document.createElement('div');
            hoverLabel.id = 'hover-label';
            hoverLabel.style.display = 'block';
            hoverLabel.style.position = 'absolute';
            hoverLabel.style.background = 'rgba(255, 255, 255, 0.8)';
            hoverLabel.style.padding = '5px';
            hoverLabel.style.borderRadius = '3px';
            hoverLabel.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            document.body.appendChild(hoverLabel);
          }

          if (hoverLabel) {
            hoverLabel.innerHTML = markerdata.bundesland?.toString() || '';
            hoverLabel.style.left = `${event.pixel[0]}px`;
            hoverLabel.style.top = `${event.pixel[1]}px`;
            hoverLabel.style.display = 'block';
          }
        }
      });

      markerElems.push(pieChart);
    });
    var vector = new VectorLayer({
      source: new VectorSource({ features: markerElems }),
    });

    mapRef.current.addLayer(vector);
    featureRef.current = vector;

    // const snap = new Snap({ source });
    // }
  }, [showType, markers]);

  return (
    <div className={clsx('bg-white w-full h-full', props.className)}>
      <div id="map" className="map w-full h-full">
        <div
          className="absolute shadow px-2 py-1 z-10 bg-amber-50 rounded-md translate-x-10 translate-y-1/2"
          id="hover-label"
        ></div>
      </div>
      {/* Legend for the map */}
      <div className="absolute bottom-0 right-0 left-0 min-h-10">
        <Legend
          items={Object.entries(colorMap).map((item) => ({
            name: item[0],
            color: item[1],
          }))}
        />
      </div>
    </div>
  );
};

export default Map;
