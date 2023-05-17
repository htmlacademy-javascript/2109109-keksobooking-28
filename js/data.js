import {
  getRandomInteger,
  getRandomArbitrary,
  createRandomIdFromRangeGenerator,
  sortRandomly,
} from './util.js';

import {
  NUMBER_OF_ADS,
  MAX_ROOMS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE,
  MAX_LATITUDE,
  MIN_LATITUDE,
  MAX_LONGITUDE,
  MIN_LONGITUDE,
  AD_TITLES,
  HOUSING_TYPES,
  AVAILABLE_HOURS,
  AVAILABLE_FEATURES,
  DESCRIPTIONS,
  PHOTOS,
} from './const.js';

const generateRandomAuthorId = createRandomIdFromRangeGenerator(
  1,
  NUMBER_OF_ADS,
  getRandomInteger,
);

const generateRandomTitleIndex = createRandomIdFromRangeGenerator(
  0,
  AD_TITLES.length - 1,
  getRandomInteger,
);

function createAd() {
  const authorId = String(generateRandomAuthorId());
  const randomTitleIndex = generateRandomTitleIndex();

  const randomFeatures = sortRandomly(AVAILABLE_FEATURES).slice(
    0,
    getRandomInteger(1, AVAILABLE_FEATURES.length),
  );

  const randomPhotos = sortRandomly(PHOTOS).slice(
    0,
    getRandomInteger(1, PHOTOS.length),
  );

  const randomLatitude = getRandomArbitrary(MAX_LATITUDE, MIN_LATITUDE);
  const randomLongitude = getRandomArbitrary(MAX_LONGITUDE, MIN_LONGITUDE);

  return {
    author: {
      avatar: `img/avatars/user${authorId.padStart(2, '0')}.png`,
    },
    offer: {
      title: AD_TITLES[randomTitleIndex],
      address: `${randomLatitude}, ${randomLongitude}`,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: HOUSING_TYPES[getRandomInteger(0, HOUSING_TYPES.length - 1)],
      rooms: getRandomInteger(1, MAX_ROOMS),
      guests: getRandomInteger(1, MAX_GUESTS),
      checkin: AVAILABLE_HOURS[getRandomInteger(0, AVAILABLE_HOURS.length - 1)],
      checkout:
        AVAILABLE_HOURS[getRandomInteger(0, AVAILABLE_HOURS.length - 1)],
      features: randomFeatures,
      description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
      photos: randomPhotos,
    },
    location: {
      lat: randomLatitude,
      lng: randomLongitude,
    },
  };
}

const createAdsArray = () => Array.from({ length: NUMBER_OF_ADS }, createAd);

export { createAdsArray };
