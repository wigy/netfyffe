class Api  {

  public static investors() {
    fetch('http://localhost:9003/investors')
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
      })
      .catch((err) => {
        console.error('API ERROR:', err);
      })
    return 1;
  }
}

export default Api;
