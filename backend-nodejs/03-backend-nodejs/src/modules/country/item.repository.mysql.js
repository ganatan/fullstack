import pool from '../../core/database/database-mysql.js';

import {
  addFilterCondition,
  adaptSortField,
} from '../../shared/utils/query/query-utils.js';

import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_MIN_ENTITY_ID,
  MAX_ITEMS_PER_PAGE,
} from '../../shared/constants/pagination.constants.js';
import { SORT_DIRECTION } from '../../shared/constants/sort.constants.js';

const ITEMS_NAME = 'country';
const TABLE_NAME = 'country';

class MysqlRepository {
  async getItems(filters) {
    try {
      const {
        page = 1,
        size = DEFAULT_ITEMS_PER_PAGE,
        sort = 'name',
        name = '',
        isoNumeric = '',
        isoAlpha2 = '',
        isoAlpha3 = '',
        continentName = '',
        continentCode = '',
      } = filters;

      const currentPage = Math.max(1, parseInt(page, 10));
      const requestedSize = parseInt(size, 10);
      const perPage = Math.min(Math.max(1, requestedSize), MAX_ITEMS_PER_PAGE);
      const offset = (currentPage - 1) * perPage;

      let filterConditions = `WHERE (1 = 1) AND (t1.id >= ${DEFAULT_MIN_ENTITY_ID})`;
      const filterParams = [];

      filterConditions = addFilterCondition(filterConditions, filterParams, 't1.name', name);
      filterConditions = addFilterCondition(filterConditions, filterParams, 't1.iso_numeric', isoNumeric);
      filterConditions = addFilterCondition(filterConditions, filterParams, 't1.iso_alpha2', isoAlpha2);
      filterConditions = addFilterCondition(filterConditions, filterParams, 't1.iso_alpha3', isoAlpha3);
      filterConditions = addFilterCondition(filterConditions, filterParams, 't2.name', continentName);
      filterConditions = addFilterCondition(filterConditions, filterParams, 't2.code', continentCode);

      const sortMapping = {
        isoNumeric: 't1.iso_numeric',
        isoAlpha2: 't1.iso_alpha2',
        isoAlpha3: 't1.iso_alpha3',
        continentName: 't2.name',
        continentCode: 't2.code',
      };
      let sortBy = adaptSortField(sort, sortMapping);
      const sortOrder = sort.startsWith('-') ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;
      if (sort.startsWith('-')) {
        sortBy = sortBy.substring(1);
      }

      const sqlCount = this.buildQueryCount(filterConditions);
      const sqlData = this.buildQueryData(filterConditions, perPage, offset, sortBy, sortOrder);

      const [countRows] = await pool.query(sqlCount, filterParams);
      const [dataRows] = await pool.query(sqlData, filterParams);

      return this.formatResultItems(dataRows, {
        currentPage: currentPage,
        perPage: perPage,
        totalItems: parseInt(countRows[0].count, 10),
      });
    } catch (error) {
      console.error(`Error retrieving ${ITEMS_NAME}:`, error);

      return null;
    }
  }

  formatResultItems(data, { currentPage, perPage, totalItems }) {
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      success: true,
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

  buildQueryCount(conditions) {
    return `
      SELECT COUNT(t1.id) AS count
      FROM ${TABLE_NAME} t1
      INNER JOIN continent t2 ON t1.continent_id = t2.id
      ${conditions};
    `;
  }

  buildQueryData(conditions, limit, offset, sortBy = 'name', sortOrder = SORT_DIRECTION.ASC) {
    return `
      SELECT 
        t1.id, 
        t1.name,
        t1.iso_numeric AS isoNumeric,
        t1.iso_alpha2 AS isoAlpha2,
        t1.iso_alpha3 AS isoAlpha3,
        t2.name AS continentName,
        t2.code AS continentCode
      FROM ${TABLE_NAME} t1
      INNER JOIN continent t2 ON t1.continent_id = t2.id
      ${conditions}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ${limit}
      OFFSET ${offset};
    `;
  }

  async getItemById(id) {
    const query = `SELECT id, name FROM ${TABLE_NAME} WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);

    return rows.length ? rows[0] : null;
  }

  async createItem(data) {
    const { name } = data;
    const [result] = await pool.query(
      `INSERT INTO ${TABLE_NAME} (name) VALUES (?)`,
      [name],
    );

    return this.getItemById(result.insertId);
  }

  async updateItem(id, data) {
    const { name } = data;
    await pool.query(
      `UPDATE ${TABLE_NAME} SET name = ? WHERE id = ?`,
      [name, id],
    );

    return this.getItemById(id);
  }

  async deleteItem(id) {
    const item = await this.getItemById(id);
    if (!item) { return null; }

    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);

    return item;
  }

  async existsByName(name) {
    const query = `
      SELECT 1 FROM ${TABLE_NAME}
      WHERE LOWER(name) = LOWER(?)
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [name]);

    return rows.length > 0;
  }
}

export default MysqlRepository;
