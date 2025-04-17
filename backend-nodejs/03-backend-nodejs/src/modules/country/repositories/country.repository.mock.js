import { ITEMS_MOCK_DATA } from '../../../data/mocks/country.mock-data.js';
import { BACKEND_MOCK_SUFFIX } from '../../../shared/constants/routes/backend-mock.constants.js';

class MockRepository {
  constructor() {
    this.items = JSON.parse(JSON.stringify(ITEMS_MOCK_DATA));
  }

  async getItems(filters = {}) {
    const {
      page = 1,
      size = 10,
      sort = '-name',
      name = '',
      code = '',
      areaMin = null,
      areaMax = null,
      populationMin = null,
      populationMax = null,
      countriesCountMin = null,
      countriesCountMax = null,
      densityMin = null,
      densityMax = null,
    } = filters;

    const currentPage = Math.max(1, parseInt(page, 10));
    const perPage = Math.max(1, parseInt(size, 10));
    const offset = (currentPage - 1) * perPage;

    let filteredItems = [...this.items];

    if (name) {
      filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (code) {
      filteredItems = filteredItems.filter(item => item.code.toLowerCase().includes(code.toLowerCase()));
    }

    if (areaMin !== null) {
      filteredItems = filteredItems.filter(item => parseFloat(item.area) >= parseFloat(areaMin));
    }
    if (areaMax !== null) {
      filteredItems = filteredItems.filter(item => parseFloat(item.area) <= parseFloat(areaMax));
    }

    if (populationMin !== null) {
      filteredItems = filteredItems.filter(item => parseFloat(item.population) >= parseFloat(populationMin));
    }
    if (populationMax !== null) {
      filteredItems = filteredItems.filter(item => parseFloat(item.population) <= parseFloat(populationMax));
    }

    if (countriesCountMin !== null) {
      filteredItems = filteredItems.filter(item => parseInt(item.countriesCount) >= parseInt(countriesCountMin));
    }
    if (countriesCountMax !== null) {
      filteredItems = filteredItems.filter(item => parseInt(item.countriesCount) <= parseInt(countriesCountMax));
    }

    if (densityMin !== null) {
      filteredItems = filteredItems.filter(item => parseFloat(item.density) >= parseFloat(densityMin));
    }
    if (densityMax !== null) {
      filteredItems = filteredItems.filter(item => parseFloat(item.density) <= parseFloat(densityMax));
    }

    const sortField = sort.replace(/^-/, '');
    const sortOrder = sort.startsWith('-') ? -1 : 1;

    filteredItems.sort((itemA, itemB) => {
      const valueA = itemA[sortField];
      const valueB = itemB[sortField];
      if (valueA < valueB) { return -1 * sortOrder; };
      if (valueA > valueB) { return 1 * sortOrder; };

      return 0;
    });

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const data = filteredItems
      .slice(offset, offset + perPage)
      .map(item => ({ ...item, name: `${item.name} ${BACKEND_MOCK_SUFFIX}` }));

    return {
      metadata: {
        pagination: {
          currentPage,
          perPage,
          totalItems,
          totalPages,
        },
      },
      data: data,
    };
  }

  async getItemById(id) {
    return this.items.find((item) => item.id === id) || null;
  }

  async createItem(data) {
    const newItem = { id: this.items.length + 1, ...data };
    this.items.push(newItem);

    return newItem;
  }

  async updateItem(id, data) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) { return null; }
    this.items[index] = { ...this.items[index], ...data };

    return this.items[index];
  }

  async deleteItem(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) { return null; }

    return this.items.splice(index, 1)[0];
  }

  async existsByName(name) {
    return this.items.some(
      item => item.name.toLowerCase() === name.toLowerCase(),
    );
  }
}

export default MockRepository;
