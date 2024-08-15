![image](https://github.com/user-attachments/assets/aed0fd89-5780-44f9-8431-580e479dedfe)

# how to use OpenLayers in maps
This project is an Angular component for viewing objectives on a map using OpenLayers.

## Functionalities

### 1. Login System
- **AuthService**: Manages user authentication.
- **LoginComponent**: The login component.
- **AuthGuard**: Protects routes to ensure access is granted only to authenticated users.

### 2. Dashboard Component
After authentication, users are redirected to the `Dashboard` component. Here, objectives are displayed on the map, and various interactions are provided. Within the `ngOnInit` method, `this.setMap()` and `this.loadObjectives()` are called.

#### Methods

1. **setMap()**
    - Initializes `vectorSource` with features from the `geojsonObject`.
    - Sets up the `Map` with a `vectorLayer`.
    - Adds listeners for `pointermove` and `click` events on the map:
       
        ```typescript
        this.map.on('pointermove', this.pointermove.bind(this));
        this.map.on('click', this.clickMap.bind(this));
        ```
    
2. **loadObjectives()**
    - Loads objectives from `MOCK_OBJ`.
    - For each objective, creates a `Feature` with a custom style and adds it to `vectorSource`.

3. **clickMap(event)**
    - Updates `marked` coordinates with the event click coordinates.
    - For each feature at the selected pixel:
        - Sets a new style.
        - Checks if any of the objectives in `MOCK_OBJ` are within the selected polygon.
        - If an objective is found in the polygon:
            - Changes the objective's style.
            - Defines a new marker on the map.
            - Calculates the distance between the objective and the initialized marker.
            - Adds the marker to `vectorSource`.

4. **pointermove(event)**
    - If the user hovers over an objective (`feature`), a popup opens, and the action is tracked.


