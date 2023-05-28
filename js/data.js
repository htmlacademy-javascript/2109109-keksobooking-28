class Offer {
  constructor(info) {
    const { author, offer, location } = info;
    this.authorAvatar = author.avatar;
    this.offerTitle = offer.title;
    this.offerAddress = offer.address;
    this.offerPrice = offer.price;
    this.offerType = offer.type;
    this.offerRooms = offer.rooms;
    this.offerGuests = offer.guests;
    this.offerCheckin = offer.checkin;
    this.offerCheckout = offer.checkout;
    this.offerFeatures = offer.features;
    this.offerDescription = offer.description;
    this.offerPhotos = offer.photos;
    this.location = {
      lat: location.lat,
      lng: location.lng,
    };
  }
}

const createOffers = (data) => data.map((entry) => new Offer(entry));

export { createOffers };
