import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {By} from "@angular/platform-browser";
import {View} from "ol";

describe('DashboardComponentComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let vectorSourceMock: jasmine.SpyObj<VectorSource>;
  let mapMock: any;
  let mapElement: HTMLElement;
  beforeEach(async () => {

    vectorSourceMock = jasmine.createSpyObj('VectorSource', ['addFeature']);
    mapMock = {
      addLayer: jasmine.createSpy('addLayer')
    };
    mapElement = fixture.debugElement.query(By.css('#MyMapFromHtml')).nativeElement;
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component['vectorSource'] = vectorSourceMock;
    component['map'] = mapMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add features to the vector source', () => {
    component.loadObjectives();

    expect(vectorSourceMock.addFeature.calls.count()).toBe(2);
  });


  it('should add a vector layer to the map', () => {
    component.loadObjectives();

    expect(mapMock.addLayer).toHaveBeenCalled();
    const addedLayer = mapMock.addLayer.calls.argsFor(0)[0] as VectorLayer;
    expect(addedLayer.getSource()).toBe(vectorSourceMock);
  });


  it('should initialize map and vector source correctly', () => {
    component.setMap();


    expect(component['vectorSource']).toBeDefined();
    expect(component['vectorSource'] instanceof VectorSource).toBeTrue();

    expect(component['map']).toBeDefined();
    expect(component['map'] instanceof Map).toBeTrue();

    expect(component['map']?.getView() instanceof View).toBeTrue();

    const vectorLayer = component['map']?.getLayers().getArray().find(layer => layer instanceof VectorLayer) as VectorLayer;
    expect(vectorLayer).toBeDefined();
    expect(vectorLayer.getSource()).toBe(component['vectorSource']);
  });

});
