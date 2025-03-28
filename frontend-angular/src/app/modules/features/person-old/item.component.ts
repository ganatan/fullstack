import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Item } from './services/item.model';
import { ITEMS_SERVICE } from './services/items.token';

import { PaginationService } from '../../../shared/services/pagination/pagination.service';
import { Pagination } from '../../../shared/services/pagination/pagination';

import { URL_ITEMS, NAME_ITEM } from './services/item.constants';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';

import { ItemsProvider } from './services/items.provider';

@Component({
  selector: 'app-item',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    PaginationService,
    ItemsProvider,
  ],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  private itemsService = inject(ITEMS_SERVICE);
  private paginationService = inject(PaginationService);

  name_default = NAME_ITEM;
  defaultSelectedPerPage = DEFAULT_ITEMS_PER_PAGE;
  sortColumn: string | null = null;
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  items: Item[] | undefined;
  loading = false;

  totals = {
    count: 0,
    countAll: 0,
  };

  filters = {
    page: null,
    size: null,
    name: null,
  };

  selectedPerPage: number;
  paginationEnabled = true;
  pagination: Pagination;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {

    this.selectedPerPage = this.defaultSelectedPerPage;
    this.pagination = this.paginationService.initializePagination(this.selectedPerPage);
  }

  ngOnInit(): void {
    this.getQueryParams();
  }

  getItems(filters: any): void {
    const sort = this.sortColumn ? (this.sortDirection === 'asc' ? this.sortColumn : `-${this.sortColumn}`) : null;
    const sortFilters = {
      ...filters,
      sort,
    };
    this.loading = true;
    this.itemsService.getItems(sortFilters)
      .subscribe(response => {
        const count = response.metadata.pagination.totalItems;
        this.pagination.totalItems = count;
        this.items = response.data;
        this.setTotals(response);
        this.loading = false;
        this.updatePagination();
      });
  }

  setTotals(response: any): void {
    this.totals = {
      count: response.totals.currentPage.count,
      countAll: response.totals.global.count,
    };
  }

  setQueryParams(filters: any) {
    const sanitizedFilters = { ...filters };
    if (sanitizedFilters.name === "") {
      sanitizedFilters.name = null;
    }
    if (sanitizedFilters.code === "") {
      sanitizedFilters.code = null;
    }
    if (sanitizedFilters.sort === "") {
      sanitizedFilters.sort = null;
    }
    const queryParams = { ...this.filters, ...sanitizedFilters };
    const url = URL_ITEMS;
    this.router.navigate([url], { queryParams });
    this.getItems(this.filters);
  }

  search() {
    const filters = {
      ...this.filters,
      page: this.pagination.currentPage,
      size: this.pagination.perPage
    };
    const sort = this.sortColumn ? (this.sortDirection === 'asc' ? this.sortColumn : `-${this.sortColumn}`) : null;
    const sortFilters = {
      ...filters,
      sort,
    };
    this.setQueryParams(sortFilters);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.search();
    }
  }

  getQueryParams() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.filters = { ...this.filters, ...queryParams };
      const { size } = this.filters || {};
      if (size) {
        this.selectedPerPage = size;
      }
      this.pagination = this.paginationService.initializePagination(this.selectedPerPage);
      this.getItems(this.filters);
    });
  }

  updatePagination() {
    this.pagination.currentPage = Number(this.filters.page) || 1;
    this.pagination.perPage = this.filters.size || this.selectedPerPage;
    this.setPagination();
  }

  create() {
    this.router.navigate([URL_ITEMS, 0]);
  }

  // selectItem(item: Item) {
  //   this.router.navigate([URL_ITEMS, item.id]);
  // }

  selectItem(item: any) {
    this.router.navigate([URL_ITEMS, item.id]);
  }

  selectPagination() {
    this.paginationEnabled = !this.paginationEnabled;
  }

  setPagination() {
    this.pagination = this.paginationService.getPagination(this.pagination);
  }

  changePage(page: number) {
    this.pagination.currentPage = page;
    this.search();
  }

  changePerPage(event: string) {
    const perPage = parseInt(event, 10);
    this.pagination.perPage = perPage;
    this.search();
  }

  getGlobalPosition(index: number): number {
    const offset = (this.pagination.currentPage - 1) * this.pagination.perPage;

    return offset + index + 1;
  }

  setSort(column: string, field?: string): void {
    if (this.sortColumn === column) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = null;
        this.sortColumn = null;
        this.sortField = null;
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      this.sortColumn = column;
      this.sortField = field ? field : column;
      this.sortDirection = 'asc';
    }
    this.search();
  }

}
