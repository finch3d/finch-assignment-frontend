import axios from "axios";

export function getBuildingsDataFromApi(data) {
  return axios({
    method: "post",
    url:
      "https://cors-anywhere.herokuapp.com/https://87o2eq9h6k.execute-api.eu-west-1.amazonaws.com/dev/build",
    data: data,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}
