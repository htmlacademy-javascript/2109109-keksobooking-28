import { filterData } from './mapUtils.js';
import { debounce } from './utility.js';

const RERENDER_DELAY = 500;
const priceRanges = {
  middle: { minRange: 10000, maxRange: 50000 },
  low: { maxRange: 10000 },
  high: { minRange: 50000 },
};
const defaultFilterValue = 'any';
const filterForm = document.querySelector('.map__filters');

const filters = {
  selectedType: defaultFilterValue,
  selectedPrice: defaultFilterValue,
  selectedRooms: defaultFilterValue,
  selectedGuests: defaultFilterValue,
  selectedFeatures: [],
};

filterForm.addEventListener('change', handleFilterChange);

function handleFilterChange(event) {
  const { target } = event;

  const selectedSelect = target.closest('select');
  const selectedInput = target.closest('input');

  if (selectedSelect) {
    const filterType = selectedSelect.id.replace(/housing-/g, '');
    const filterValue = selectedSelect.value;
    filters[filterType] = filterValue;
  } else if (selectedInput) {
    const filterInput = selectedInput;

    if (filterInput.checked) {
      filters.selectedFeatures.push(filterInput.value);
    } else {
      filters.selectedFeatures = filters.selectedFeatures.filter(
        (feature) => feature !== filterInput.value,
      );
    }
  }

  debounce(() => filterData(), RERENDER_DELAY)();
}

function filterByType(data) {
  if (filters.selectedType === defaultFilterValue) {
    return data;
  } else {
    return data.filter((item) => item.offerType === filters.selectedType);
  }
}

function filterByPrice(data) {
  const { selectedPrice } = filters;

  if (selectedPrice === defaultFilterValue) {
    return data;
  }

  const priceFilter = {
    middle: (item) =>
      item.offerPrice >= priceRanges.middle.minRange &&
      item.offerPrice < priceRanges.middle.maxRange,
    low: (item) => item.offerPrice < priceRanges.low.maxRange,
    high: (item) => item.offerPrice >= priceRanges.high.minRange,
  };

  return data.filter(priceFilter[selectedPrice]);
}

function filterByRooms(data) {
  if (filters.selectedRooms === defaultFilterValue) {
    return data;
  } else {
    return data.filter(
      (item) => item.offerRooms === parseInt(filters.selectedRooms, 10),
    );
  }
}

function filterByGuests(data) {
  if (filters.selectedGuests === defaultFilterValue) {
    return data;
  } else {
    return data.filter(
      (item) => item.offerGuests === parseInt(filters.selectedGuests, 10),
    );
  }
}

function filterByFeatures(data) {
  return data.filter((item) => {
    if (filters.selectedFeatures.length === 0) {
      return true;
    }
    return filters.selectedFeatures.every(
      (feature) => item.offerFeatures && item.offerFeatures.includes(feature),
    );
  });
}

function resetFilters() {
  filterForm.reset();
}

export {
  filters,
  filterByType,
  filterByPrice,
  filterByRooms,
  filterByGuests,
  filterByFeatures,
  resetFilters,
};
