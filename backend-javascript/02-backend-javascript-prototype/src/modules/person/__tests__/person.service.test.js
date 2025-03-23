import Service from '../person.service.js';
import * as schema from '../person.schema.js';

jest.mock('../person.schema.js');

describe('PersonService', () => {
  let service;
  let repository;

  beforeEach(() => {
    repository = {
      getItems: jest.fn(),
      getItemById: jest.fn(),
      createItem: jest.fn(),
      updateItem: jest.fn(),
      deleteItem: jest.fn(),
      existsByName: jest.fn(),
    };

    schema.validateItem.mockImplementation(() => true);
    service = new Service(repository);
  });

  test('getItems returns all persons', async () => {
    // Arrange
    const expected = [
      { id: 1, name: 'Steven Spielberg', city: 'Cincinnati' },
      { id: 2, name: 'Martin Scorsese', city: 'New York' },
    ];
    repository.getItems.mockResolvedValue(expected);

    // Act
    const result = await service.getItems();

    // Assert
    expect(result).toEqual(expected);
    expect(repository.getItems).toHaveBeenCalledTimes(1);
  });

  test('getItemById returns a person', async () => {
    // Arrange
    const expected = { id: 1, name: 'Steven Spielberg' };
    repository.getItemById.mockResolvedValue(expected);

    // Act
    const result = await service.getItemById(1);

    // Assert
    expect(result).toEqual(expected);
    expect(repository.getItemById).toHaveBeenCalledWith(1);
  });

  test('getItemById returns null if not found', async () => {
    // Arrange
    repository.getItemById.mockResolvedValue(null);

    // Act
    const result = await service.getItemById(999);

    // Assert
    expect(result).toBeNull();
    expect(repository.getItemById).toHaveBeenCalledWith(999);
  });

  test('createItem creates a person when valid and unique', async () => {
    // Arrange
    const newPerson = { name: 'James Cameron', city: 'Kapuskasing' };
    const expected = { id: 3, ...newPerson };
    repository.existsByName.mockResolvedValue(false);
    repository.createItem.mockResolvedValue(expected);

    // Act
    const result = await service.createItem(newPerson);

    // Assert
    expect(schema.validateItem).toHaveBeenCalledWith(newPerson);
    expect(repository.existsByName).toHaveBeenCalledWith('James Cameron');
    expect(result).toEqual(expected);
    expect(repository.createItem).toHaveBeenCalledWith(newPerson);
  });

  test('createItem throws 409 if name already exists', async () => {
    // Arrange
    const newPerson = { name: 'James Cameron', city: 'Kapuskasing' };
    repository.existsByName.mockResolvedValue(true);

    // Act + Assert
    await expect(service.createItem(newPerson)).rejects.toMatchObject({
      message: 'Person already exists',
      status: 409,
    });
  });

  test('createItem throws 400 on invalid data', async () => {
    // Arrange
    const invalid = { name: '', city: '' };
    schema.validateItem.mockImplementation(() => {
      throw new Error('Invalid');
    });

    // Act + Assert
    await expect(service.createItem(invalid)).rejects.toMatchObject({
      message: 'Invalid',
      status: 400,
    });
  });

  test('updateItem updates and returns person', async () => {
    // Arrange
    const updated = { name: 'Updated', city: 'Miami' };
    const expected = { id: 1, ...updated };
    repository.updateItem.mockResolvedValue(expected);

    // Act
    const result = await service.updateItem(1, updated);

    // Assert
    expect(schema.validateItem).toHaveBeenCalledWith(updated);
    expect(result).toEqual(expected);
    expect(repository.updateItem).toHaveBeenCalledWith(1, updated);
  });

  test('updateItem returns null if not found', async () => {
    // Arrange
    const update = { name: 'X' };
    repository.updateItem.mockResolvedValue(null);

    // Act
    const result = await service.updateItem(999, update);

    // Assert
    expect(result).toBeNull();
    expect(repository.updateItem).toHaveBeenCalledWith(999, update);
  });

  test('updateItem throws 400 on invalid data', async () => {
    // Arrange
    schema.validateItem.mockImplementation(() => {
      throw new Error('Invalid');
    });

    // Act + Assert
    await expect(service.updateItem(1, {})).rejects.toMatchObject({
      message: 'Invalid',
      status: 400,
    });
  });

  test('deleteItem deletes and returns person', async () => {
    // Arrange
    const expected = { id: 1, name: 'Spielberg' };
    repository.deleteItem.mockResolvedValue(expected);

    // Act
    const result = await service.deleteItem(1);

    // Assert
    expect(result).toEqual(expected);
    expect(repository.deleteItem).toHaveBeenCalledWith(1);
  });

  test('deleteItem returns null if not found', async () => {
    // Arrange
    repository.deleteItem.mockResolvedValue(null);

    // Act
    const result = await service.deleteItem(999);

    // Assert
    expect(result).toBeNull();
    expect(repository.deleteItem).toHaveBeenCalledWith(999);
  });
});
