# Frontend Assignment

## Overview

Typically an architect wants to change where buildings are located on a lot. In this assignment this is already fixed.

Additionally they also want to change some of the attributes, e.g. height, width and roof angle. In association with this they want to see the meta data of the buildings, e.g. name, height and floor area.

The sample setup is a project that loads building data from a file locally and renders it in a 3d canvas. Some other sample data is also rendered.

### Project Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 3D Rendering

The 3D rendering is handled with [three.js](https://threejs.org/) and a wrapper library [react-three-fiber](https://github.com/react-spring/react-three-fiber).

### Building Data API

NOTE: This api a prototype we used to evaluate JavaScript performance and data formats. We do not know of any bugs, but they may still exist. :)

To generate new building data, make a POST request to `https://87o2eq9h6k.execute-api.eu-west-1.amazonaws.com/dev/build`.

The payload should be a json array where each item is a dictionary with params corresponding to a building that index. The params for each building can contain `height`, `width` and `roofAngle`. If any parameter is missing or null, then default values is used by the api:
```
{
  "width": 10000,
  "height": 10000,
  "roofAngle": 30
}
```

The following example request will generate buildings where the first building uses the default value, the second is 30000 mm high, and the rest use the default values.
```
curl -X POST -d '[null,{"height":30000}]' https://87o2eq9h6k.execute-api.eu-west-1.amazonaws.com/dev/build
```

The project already contains a local file with pre-generated building data, [buildings.json](./data/buildings.json), which is loaded and rendered at startup in the demo application.

## Assignment

Do your changes in a fork of this repo, and then make a pull request when you are done.

### Main Task
* Generate building data with params via an endpoint (instead of loading locally).
* Add user controls to edit individual building height, and re-generate new building data.

### Bonus Tasks (if you have the time)
* Add display of building meta data, i.e. `name`, `height` and `area`.
* Add display of floor meta data, i.e. `level` and `area`.
* Add funcitonality to edit of building `width` and `roofAngle`.
* Add functionality to duplicate the currently selected building.
