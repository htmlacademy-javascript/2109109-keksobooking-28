import { createAdsArray } from './data.js';

const usersAds = createAdsArray();
const adsCardTemplate = document
  .querySelector('#card')
  .content.querySelector('.popup');

const housingTypeCaptions = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

function hideUnusedFeatures(featureElements, features) {
  featureElements.forEach((element) => {
    const isFeatureUsed = features.includes(element.dataset.feature);
    if (!isFeatureUsed) {
      element.classList.add('hidden');
    }
  });
}

function createAdPopup({ author, offer }) {
  const adCard = adsCardTemplate.cloneNode(true);

  adCard.querySelector('.popup__title').textContent = offer.title;
  adCard.querySelector('.popup__text--address').textContent = offer.address;
  adCard.querySelector(
    '.popup__text--price',
  ).textContent = `${offer.price}₽/ночь`;
  adCard.querySelector('.popup__type').textContent =
    housingTypeCaptions[offer.type];
  adCard.querySelector(
    '.popup__text--capacity',
  ).textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  adCard.querySelector(
    '.popup__text--time',
  ).textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;

  const featuresContainer = adCard.querySelector('.popup__features');
  const featureList = featuresContainer.querySelectorAll('.popup__feature');
  if (offer.features.length === 0) {
    featuresContainer.classList.add('hidden');
  } else {
    hideUnusedFeatures(featureList, offer.features);
  }

  const popupDescription = adCard.querySelector('.popup__description');
  if (!offer.description) {
    popupDescription.classList.add('hidden');
  } else {
    popupDescription.textContent = offer.description;
  }

  const photoContainer = adCard.querySelector('.popup__photos');
  const popupPhotoInit = photoContainer.querySelector('.popup__photo');
  if (offer.photos.length === 0) {
    popupPhotoInit.classList.add('hidden');
  } else {
    offer.photos.forEach((photo) => {
      const popupPhotoClone = popupPhotoInit.cloneNode(true);
      popupPhotoClone.src = photo;
      photoContainer.append(popupPhotoClone);
    });
    popupPhotoInit.remove();
  }

  const popupAvatar = adCard.querySelector('.popup__avatar');
  popupAvatar.src = author.avatar || 'img/avatars/default.png';

  return adCard;
}

export { housingTypeCaptions, createAdPopup, usersAds };
