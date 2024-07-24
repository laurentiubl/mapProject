import {Component, OnInit, ViewChild} from '@angular/core';
import VectorLayer from "ol/layer/Vector";
import {Feature, Overlay, View} from "ol";
import Map from 'ol/Map';
import {fromLonLat, toLonLat, transform} from "ol/proj";
import VectorSource from "ol/source/Vector";
import {MOCK_OBJ} from "../mock/mock-obj";
import {Point} from "ol/geom";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {Coordinate, toStringHDMS} from "ol/coordinate";
import {GeoJSON} from "ol/format";
import {geojsonObject} from "../data/countries";
import {utilsFunctions} from "../shared/utils";


@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  map!: Map;
  marked: any;
  vectorSource: VectorSource;
  userActions = [];
  @ViewChild('popupContent') private popupContent: any;

  constructor() {
  }

  ngOnInit(): void {
    this.setMap();
    this.loadObjectives();
  }


  setMap(): void {

    this.vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
    });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target: 'MyMapFromHtml',
      layers: [
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    });

    this.map.getView().fit(this.vectorSource.getExtent());


    this.map.on('pointermove', this.pointermove.bind(this));
    this.map.on('click', this.clickMap.bind(this));

    let thiss = this;
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      debugger
      const thirdActionIndex = 2;
      if (thiss.userActions.length > thirdActionIndex) {
        const thirdAction = thiss.userActions[thirdActionIndex];
        thiss.revertAction(thirdAction);
        thiss.userActions.splice(thirdActionIndex, 1);
      }
    });

  }

  loadObjectives(): void {

    let objectives = MOCK_OBJ;
    for (let i = 0; i < objectives.length; i++) {

      const feature = new Feature({
        geometry: new Point(fromLonLat(objectives[i].coordinates)),
        name: objectives[i].name,
        myObjectives: 'true'
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({
            color: '#ff0000'
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 3
          })
        })
      }));

      this.vectorSource.addFeature(feature);
    }

    const vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.map.addLayer(vectorLayer);
  }


  clickMap(event: any) {

    this.marked = event.coordinate;

    this.map.forEachFeatureAtPixel(event.pixel, (feature: Feature) => {


      const stroke = new Stroke({color: 'blue', width: 4});
      const styleNew = new Style({stroke});
      feature.setStyle(styleNew);
      const polygonGeometry = feature.getGeometry();


      MOCK_OBJ.forEach(myObj => {

        const transformedPointCoords = transform(myObj.coordinates, 'EPSG:4326', 'EPSG:3857');
        const pointInsidePolygon = polygonGeometry.intersectsCoordinate(transformedPointCoords);

        if (pointInsidePolygon) {

          const highlightStyle = new Style({
            stroke: new Stroke({
              color: 'rgba(255, 0, 0, 1)',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.1)',
            }),
          });
          feature.setStyle(highlightStyle);


          let ourFeatureFromVector = this.vectorSource.getFeatures().find(feature => feature.get('name') === myObj.name);
          ourFeatureFromVector.setStyle(new Style({
            image: new CircleStyle({
              radius: 20,
              fill: new Fill({
                color: 'blue'
              }),
              stroke: new Stroke({
                color: '#000000',
                width: 3
              })
            })
          }));

          let p: Point = <Point>ourFeatureFromVector.getGeometry();
          let c: Coordinate = p.getCoordinates();
          console.log('Coordonatele obiectivului meu ' + c);

          const distance = this.marked ? utilsFunctions.calculateDistance(this.marked, [c[0], c[1]]) : 0;
          const distanceKm = distance / 1000;
          const roundedKm = Math.round(distanceKm * 100) / 100;
          console.log('distanta dintre point si obiectivul meu ' + roundedKm + 'km')


          const newFeature = new Feature({
            geometry: new Point(this.marked),
            name: feature.get('name') + '<br>' + 'Distanta dintre point si obiectivul meu ' + roundedKm + 'km',
            myObjectives: 'true',
          });

          newFeature.setStyle(new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({color: 'red'}),
              stroke: new Stroke({color: 'white', width: 2})
            })
          }));

          this.vectorSource.addFeature(newFeature);


          this.trackAction({type: 'mark', element: newFeature});

        }
      })
    });


  }

  setCoordonate(event: any, feature: any) {
    const coordinate = event.coordinate;
    const hdms = toStringHDMS(toLonLat(coordinate));

    // the first time I made a request, but then I imported geoJSON
    // const country = await this.coordonateService.getCountry(toLonLat(coordinate));

    let content = this.popupContent.nativeElement;
    this.popupContent.nativeElement.querySelector('#popup-content').innerHTML = feature.get('name') + ' ' + '<br>' + hdms + '</code>';

    const overlay = new Overlay({
      element: content,
      autoPan: true
    });
    overlay.setPosition(coordinate);
    this.map.addOverlay(overlay);

    this.trackAction({type: 'mark', element: overlay});

  }

  trackAction(action) {
    this.userActions.push(action);
  }

  pointermove(event: any) {
    const pixel = event.pixel;
    const feature = this.map.forEachFeatureAtPixel(pixel, (feature) => feature);
    if (feature?.get('myObjectives')) {
      this.setCoordonate(event, feature);
    }
  }


  revertAction(action) {
    switch (action.type) {
      case 'highlight':
        this.map.removeLayer(action.element);
        break;
      case 'mark':
        //this.map.removeLayer(action.element);
        this.vectorSource.removeFeature(action.element)
        break;
      case 'distance':
        this.map.removeLayer(action.element);
        break;
      default:
        console.error('Unknown action type:', action.type);
    }
  }
}
