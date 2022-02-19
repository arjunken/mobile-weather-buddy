const urlPrefix = './server/apicall.php?q='

const getCountries = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const saveHomeLocation = async (zc, abbr) => {
  const response = await fetch(urlPrefix + 'a&zc=' + zc + '&abbr=' + abbr)
  if (response.status !== 200) {
    throw new Error(
      'Please check the Zipcode format. Use only first 3 letters for alpha-numeric codes.'
    )
  }
  const data = await response.json()
  return data
}

const getWeatherData = async (lat, lon) => {
  const response = await fetch(urlPrefix + 'b&lat=' + lat + '&lon=' + lon)
  const data = await response.json()
  return data
}

const getCityName = async (lat, lon) => {
  const response = await fetch(urlPrefix + 'c&lat=' + lat + '&lon=' + lon)
  const data = await response.json()
  return data
}

export { getCountries, saveHomeLocation, getWeatherData, getCityName }
