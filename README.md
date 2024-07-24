![image](https://github.com/user-attachments/assets/aed0fd89-5780-44f9-8431-580e479dedfe)

# mapProject
This project is an Angular component for viewing objectives on a map using OpenLayers.

**Angular Material**: pentru componente UI.
- **OpenLayers**: pentru integrarea hărților interactive.
- **AuthService și LoginComponent**: pentru gestionarea autentificării.
- **AuthGuard**: pentru protejarea rutelor.
- **CoordonateService**: pentru accesarea unui API și preluarea țărilor pe baza coordonatelor.

## Funcționalități

### 1. Sistem de Login
- **AuthService**: gestionează autentificarea utilizatorilor.
- **LoginComponent**: componenta de login.
- **AuthGuard**: protejează rutele pentru a permite accesul doar utilizatorilor autentificați.

### 2. Dashboard Component
După autentificare, utilizatorii sunt redirecționați către componenta `Dashboard`. Aici sunt afișate obiectivele pe hartă și sunt oferite diverse interacțiuni. În cadrul metodei `ngOnInit`, sunt apelate `this.setMap()` și `this.loadObjectives()`.

#### Metode

1. **setMap()**
    - Inițializează `vectorSource` cu features din `geojsonObject`.
    - Inițializează harta `Map` cu un `vectorLayer`.
    - Adaugă listeneri pentru evenimentele `pointermove` și `click` pe hartă:
       
        this.map.on('pointermove', this.pointermove.bind(this));
        this.map.on('click', this.clickMap.bind(this));
     
    
2. **loadObjectives()**
    - Încarcă obiectivele din `MOCK_OBJ`.
    - Pentru fiecare obiectiv, creează un `Feature` cu un stil personalizat și îl adaugă în `vectorSource`.

3. **clickMap(event)**
    - Actualizează coordonatele `marked` cu cele ale evenimentului click.
    - Pentru fiecare feature de la pixelul selectat:
        - Setează un nou stil.
        - Verifică dacă unul dintre obiectivele din `MOCK_OBJ` se află în poligonul selectat.
        - Dacă obiectivul este găsit în poligon:
            - Schimbă stilul obiectivului.
            - Defineste un nou marker pe hartă.
            - Calculează distanța dintre obiectiv și markerul inițializat.
            - Adaugă markerul în `vectorSource`.

4. **pointermove(event)**
    - Dacă utilizatorul face hover peste un obiectiv (`feature`), se deschide un popup și se face track de acțiune.

