import { ITEMS_MOCK_DATA } from '../../mocks/continent.mock-data.js';

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
    } = filters;

    const currentPage = Math.max(1, parseInt(page, 10));
    const perPage = Math.max(1, parseInt(size, 10));
    const offset = (currentPage - 1) * perPage;

    let filteredItems = [...this.items];

    if (name) {
      filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
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
    const data = filteredItems.slice(offset, offset + perPage);

    const global = this.computeTotals(filteredItems);
    const current = this.computeTotals(data);

    return {
      metadata: {
        pagination: {
          currentPage,
          perPage,
          totalItems,
          totalPages,
        },
      },
      totals: {
        global: global,
        currentPage: current,
      },
      data: data,
    };
  }

  computeTotals(rows) {
    let area = 0;
    let population = 0;
    let countriesCount = 0;
    let count = 0;

    for (const item of rows) {
      count += 1;
      area += parseFloat(item.area || 0);
      population += parseFloat(item.population || 0);
      countriesCount += parseInt(item.countriesCount || 0);
    }

    const density = area > 0 ? parseFloat((population / area).toFixed(5)) : 0;

    return {
      count,
      area,
      population,
      countriesCount,
      density,
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
