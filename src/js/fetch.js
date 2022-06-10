const fetchingData = async (url, settings) => {
  try {
    let response = await fetch(url, settings);
    let data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
};

export default fetchingData;
