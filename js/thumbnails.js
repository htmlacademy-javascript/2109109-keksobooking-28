const adCardTemplate = document
  .querySelector('#card')
  .content.querySelector('.popup');

const housingTypeCaptions = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

function hideFeaturesWithoutNecessary(popupList, features) {
  popupList.forEach((popupListItem) => {
    const isNecessary = features.some((feature) =>
      popupListItem.classList.contains(`popup__feature--${feature}`),
    );
    if (!isNecessary) {
      popupListItem.classList.add('hidden');
    }
  });
}

function generateAdPopup({ author, offer }) {
  const adCard = adCardTemplate.cloneNode(true);
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

  if ('features' in offer) {
    hideFeaturesWithoutNecessary(featureList, offer.features);
  } else {
    featuresContainer.classList.add('hidden');
  }

  const popupDescription = adCard.querySelector('.popup__description');
  if (popupDescription.textContent === '') {
    popupDescription.classList.add('hidden');
  } else {
    popupDescription.textContent = offer.description;
  }

  const photoContainer = adCard.querySelector('.popup__photos');
  const popupPhotoInit = photoContainer.querySelector('.popup__photo');
  if ('photos' in offer) {
    offer.photos.forEach((photo) => {
      const popupPhotoClone = popupPhotoInit.cloneNode(true);
      popupPhotoClone.src = photo;
      photoContainer.append(popupPhotoClone);
      popupPhotoInit.remove();
    });
  } else {
    popupPhotoInit.classList.add('hidden');
  }

  adCard.querySelector('.popup__avatar').src =
    author.avatar.length === 0 ? 'img/avatars/default.png' : author.avatar;
  return adCard;
}

export { housingTypeCaptions, generateAdPopup };
