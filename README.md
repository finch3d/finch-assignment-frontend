# Frontend Assignment

## Background

Typically an architect wants to change where buildings are located on a lot. In this assignment this is already fixed.

Additionally they also want to change some of the attributes, e.g. height, width and roof angle. In association with this they want to see the meta data of the buildings, e.g. name, height and floor area.

The sample setup is a project that loads building data from a file locally and renders it in a 3d canvas. Some other sample data is also rendered.

## Tasks

### Main

- Generate building data with params via an endpoint (instead of loading locally).
- Add user controls to edit individual building height, and re-generate new building data.

### Bonus (if you have the time)

- Display building meta data, i.e. `name`, `height` and `area`.
- Display floor meta data, i.e. `level` and `area`.
- Add edit of building `width` and `roofAngle`.

## Project Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 3D Rendering

The 3D rendering is handled with [three.js](https://threejs.org/) and a wrapper library [react-three-fiber](https://github.com/react-spring/react-three-fiber).

## Building Data API

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

## Kommentarer

### Vad jag har gjort

- Strukturerat om i arkitekturen lite för lättare att hitta rätt komponent att jobba med
- Lagt till Redux och Redux Saga för state-hantering
- Jag kollade på Finch hemsidan för att få till “brandingen” lite. Använde samma grå och lilla som finns på hemsidan
- Lagt till edit-kontroll för höjden på på vald byggnad
- Lagt till en info-display för vald byggnad

### Vad jag skulle vilja göra

- Allra helst skulle jag velat implementera edit pilar som användaren kan dra i för att för att ändra byggnadens attribut. Men jag förstod rätt snabbt att det skulle ta för för lång tid.
- Jobba mer på edit-panelen. När jag kom till “Update” knappen så hade jag inte mer tid helt enkelt. Jag skulle gärna göra mer här. Jag vill ha en tydlig status på det användaren har ändrat men inte sparat. Man kan uppdatera på enter, men jag ville ge användaren möjlighet att klicka på en knapp med, då vissa skulle föredra att göra det, speciellt sen när man kan fylla i fler attribut samtidigt (det skulle då bara vara en knapp för alla ändringar, inte en knapp per attribut). I kombination med detta hade jag velat bygga ett “fantom-objekt” med de nya värdena, så att användaren kan se hur den nya byggnaden blir innan hen sparar och behöver vänta på data från backenden.
  Jag skulle vilja testa denna approachen mot att autospara. Här beror det ju lite på vad användarna är vana vid. Jag tänker att en toggle med autosave av/på kan låta användaren välja själv.
- Fixa “unselect” när man klickar utanför byggnaden
- Separera hjälpfunktionerna i `Geometries` till en egen fil
- Behålla värdena för övriga byggnaderna när ett nytt värde ändras, men detta tänker jag ska skötas på backenden.
- Lägga till en loading spinner när data hämtas (just nu står det bara “Loading”)
- Mycket, mycket mer jag fick verkligen lägga band på mig för att inte gå över tiden

### Övrigt

- Jag var tvungen att göra allt med Redux som jag egentligen skulle vilja göra i `Geometries` i min `Canvas` komponent då det är en bugg i React som inte låter mig att använda det inuti en canvas (https://github.com/react-spring/react-three-fiber/issues/43). Det verkar finnas work arounds men jag hann inte titta på det nu.
- Hade jag vetat att jag skulle använda git för att lämna in uppgiften hade jag delat upp det i flera logiska commits på att det varit lättare att föra en review på PRen. Tidigare uppgifter jag har gjort har det varit väldigt viktigt att de varit anonyma så därför gjorde jag det inte.
