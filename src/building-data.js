const BUILDING_DATA_API_URL = "https://cchvf3mkzi.execute-api.eu-west-1.amazonaws.com/dev/build";

export async function loadBuildingData(buildingParameters) {
  const response = await fetch(BUILDING_DATA_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify(buildingParameters),
  });

  return response.json();
}
