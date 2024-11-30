const functions = require('firebase-functions');
const axios = require('axios');

exports.getPlacesAutocomplete = functions.https.onCall(async (data, context) => {
  const apiKey = functions.config().googleplaces.apikey;
  const { input } = data; // The user's input from the app

  if (!input) {
    throw new functions.https.HttpsError('invalid-argument', 'Input text is required.');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input,
          key: apiKey,
          language: 'en',
          limit: 5,
        },
      }
    );

    return response.data; // Return the autocomplete predictions
  } catch (error) {
    console.error('Error fetching autocomplete data:', error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch autocomplete data.');
  }
});

exports.getPlaceDetails = functions.https.onCall(async (data, context) => {
  const apiKey = functions.config().googleplaces.apikey;
  const { placeId } = data; // The place ID from the autocomplete result

  if (!placeId) {
    throw new functions.https.HttpsError('invalid-argument', 'Place ID is required.');
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: apiKey,
          language: 'en',
        },
      }
    );

    return response.data; // Return the place details
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch place details.');
  }
});
