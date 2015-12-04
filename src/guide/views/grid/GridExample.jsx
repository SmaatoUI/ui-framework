
import React, {
  Component,
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Page, {
  Example,
} from '../../components/page/Page.jsx';

import {
  CheckBox,
  Entity,
  Grid,
  GridBodyEditableCell,
  GridControls,
  GridEmptyRow,
  GridHeader,
  GridHeaderSortableCell,
  GridKpiNegative,
  GridKpiPositive,
  GridLoadingRow,
  GridRow,
  GridRowRecycler,
  GridSearch,
  Sorter,
  GridStencil,
  IconCog,
  IconEllipsis,
  StickyGrid,
  ThrottledEventDispatcher,
} from '../../../framework/framework.js';

import numeral from 'numeral';

const defaultState = {
  bodyRows: [],
  isEmptyStateDemonstration: false,
  isInitialLoad: true,
  isLoadingBodyRows: false,
  isLastPage: false,
  isEmpty: false,
  // Reference to fake server request, provides ability to cancel it
  lazyLoadingTimeoutId: null,
  // Sorting
  isSortDescending: false,
  // Index of column to sort by
  sortedColumnIndex: 1,
  // Search
  searchTerm: '',
  // Select all
  areAllRowsSelected: false,
};

export default class GridExample extends Component {

  constructor(props) {
    super(props);

    this.hasColumnWidths = false;

    this.onResizeHandler = this.onResize.bind(this);
    this.onScrollHandler = this.onScroll.bind(this);

    this.GRID_ID = 'gridExample';
    this.STICKY_THRESHOLD = 176;
    this.ROW_HEIGHT = 34;
    this.BODY_HEIGHT = 500;
    this.COLUMNS_COUNT = 11;
    this.ROWS_PER_PAGE = 200;

    // Prioritize the order in which our columns should disappear, ascending.
    this.COLUMN_PRIORITIES = [
      8,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
      0,
      8,
    ];

    // In the app that uses Grid this state should be inside reducer
    this.state = defaultState;

    // Because we need custom abbreviations, we need to overwrite the entire
    // English language definition.
    // TODO: Submit PR to numeral.js allowing customization of a language
    // definition so we won't have to overwrite the entire thing.
    numeral.language('en', {
      delimiters: {
        thousands: ',',
        decimal: '.',
      },
      abbreviations: {
        thousand: 'k',
        million: 'M',
        billion: 'B',
        trillion: 'T',
      },
      ordinal: (number) => {
        const b = number % 10;
        return (~~ (number % 100 / 10) === 1) ? 'th' : // eslint-disable-line no-nested-ternary
          (b === 1) ? 'st' : // eslint-disable-line no-nested-ternary
          (b === 2) ? 'nd' : // eslint-disable-line no-nested-ternary
          (b === 3) ? 'rd' : 'th';
      },
      currency: {
        symbol: '$',
      },
    });

    this.headerCellPropsProviders = [
      () => ({
        children: (
          <CheckBox
            id="select-all"
            checked={this.state.areAllRowsSelected}
            onClick={event =>
              this.toggleAllRowsSelected.bind(this)(event.target.checked)
            }
          />
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Id
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Name
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Status
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Fuel
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Passengers
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Cylinders
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            Fuel Economy
          </GridHeaderSortableCell>
        ),
      }), index => ({
        children: (
          <GridHeaderSortableCell
            onClick={this.onSort.bind(this, index)}
            isSelected={this.state.sortedColumnIndex === index}
            isSortDescending={this.state.isSortDescending}
          >
            # Sold
          </GridHeaderSortableCell>
        ),
      }), () => ({
        children: 'Registered',
      }), () => null,
    ];

    this.footerCellPropsProviders = [
      () => null,
      () => null,
      () => null,
      () => null,
      () => null,
      () => null,
      () => null,
      () => null,
      () => ({
        children: '152.1m',
      }), () => ({
        children: 'Registered',
      }), () => null,
    ];

    this.cellValueProviders = [
      () => null,
      item => item.id,
      item => item.name,
      item => item.status,
      item => item.fuel,
      item => item.passengers,
      item => item.cylinders,
      item => item.fuelEconomy,
      item => item.sold,
      item => item.registered,
      () => null,
    ];

    // Provide the properties that should belong to each row cell, reflecting
    // the state of the row's item.
    this.rowCellPropsProviders = [
      item => ({
        // Let the user click on the contact ID to select it.
        children: (
          <CheckBox
            id={item.id}
            checked={item.isSelected}
            onClick={event =>
              this.toggleRowSelected.bind(this)(item.id, event.target.checked)
            }
          />
        ),
      }), item => ({
        children: item.id,
      }), item => ({
        children: item.name,
      }), item => ({
        children: item.status,
      }), item => ({
        children: item.fuel,
      }), item => ({
        children: (
          <GridBodyEditableCell
            content={item.passengers}
            onClick={event => {
              event.stopPropagation();

              // Temp replacement for the edit modal
              let newValue = window.prompt( // eslint-disable-line no-alert
                'Edit this:',
                item.passengers
              );
              // Cancelled
              if (newValue === null) {
                return;
              }
              // If value deleted and empty string is rendered, there is nothing
              // to click in view to change it back, so it fixes that
              if (newValue === '') {
                newValue = 'deleted';
              }
              const newBodyRows = this.state.bodyRows.map((row) => {
                if (row.id === item.id) {
                  row.passengers = newValue;
                }
                return row;
              });
              this.setState({
                bodyRows: newBodyRows,
              });
            }}
          />
        ),
      }), item => ({
        children: item.cylinders,
      }), item => ({
        children: `${item.fuelEconomy}mpg`,
      }), item => ({
        children: (
          <div>
            {numeral(item.sold).format('0.[00]a')}
            {Entity.nbsp}
            <GridKpiPositive
              title={`+${item.kpiSold}%`}
            >
              {`+${item.kpiSold}%`}
            </GridKpiPositive>
          </div>
        ),
      }), item => ({
        children: (
          <div>
            {numeral(item.registered).format('0.[00]a')}
            {Entity.nbsp}
            <GridKpiNegative
              title={`-${item.kpiRegistered}%`}
            >
              {`-${item.kpiRegistered}%`}
            </GridKpiNegative>
          </div>
        ),
      }), () => ({
        children: (
          <span>
            <IconEllipsis />
            <IconCog />
          </span>
        ),
      }),
    ];
  }

  componentDidMount() {
    // Throttle resize event handling, in an attempt to improve performance.
    this.resizeEventDispatcher = new ThrottledEventDispatcher(
      'resize', 'optimizedResize', window, this.onResizeHandler
    );

    // Throttle scroll event handling, in an attempt to improve performance.
    this.scrollEventDispatcher = new ThrottledEventDispatcher(
      'scroll', 'optimizedScroll', window, this.onScrollHandler
    );

    // Cache references to DOM elements.
    this.gridElement = $(`#${this.GRID_ID}`);
    this.refreshHeaderColumnElementReferences();

    // Update the sticky header with column widths.
    this.updateStickyHeaderColumnWidths();

    // Load initial data.
    this.lazyLoadBodyRows();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If we already measured the columns, then we don't need to do
    // anything in response to a change in the props/state.
    if (!this.hasColumnWidths) {
      // If the incoming props/state let us measure the columns, then do so.
      if (nextState.bodyRows.length !== 0) {
        this.hasColumnWidths = true;
        this.measureColumnWidths(nextState.bodyRows);
      }
    }
    return true;
  }

  componentDidUpdate() {
    // New props may have caused the table to re-render, so we need to refresh
    // our references to DOM elements.
    this.refreshHeaderColumnElementReferences();
    this.updateStickyHeaderColumnWidths();
  }

  componentWillUnmount() {
    this.resizeEventDispatcher.teardown();
    this.scrollEventDispatcher.teardown();

    // Clean up the DOM element we've created.
    if (this.$stylesContainer) {
      this.$stylesContainer.remove();
    }
  }

  onResize() {
    this.updateStickyHeaderColumnWidths();
  }

  onScroll() {
    this.updateStickyHeaderColumnWidths();

    // Get our current scroll position. Compare between values useful in Chrome
    // and Firefox, respectively.
    const scrollPosition = Math.max(
      document.body.scrollTop, document.documentElement.scrollTop);

    // Set header's fixed state manually, for better performance.
    const isHeaderFixed = scrollPosition >= this.STICKY_THRESHOLD;
    if (isHeaderFixed !== this.isHeaderFixed) {
      this.isHeaderFixed = isHeaderFixed;
      if (isHeaderFixed) {
        this.gridElement.addClass('is-grid-header-stuck');
      } else {
        this.gridElement.removeClass('is-grid-header-stuck');
      }
    }
  }

  onSearch(term) {
    this.setState({
      searchTerm: term,
    });
    // In the case of existing API, when lazy loading is enabled, we need to
    // purge bodyRows and request sorted data from the server.
    //
    // ```
    // if (isLazyLoadEnabled) {
    //  this.setState(defaultState);
    //  this.lazyLoadBodyRows();
    // }
    // ```
  }

  onClickRow(item) {
    console.log('Clicked row with ID:', item.id); // eslint-disable-line no-console
  }

  onSort(cellIndex) {
    const isSortDescending = this.state.sortedColumnIndex === cellIndex ?
      !this.state.isSortDescending : this.state.isSortDescending;

    // In the case of existing API, when lazy loading is enabled, we need to
    // purge bodyRows and request sorted data from the server.
    //
    // ```
    // if (isLazyLoadEnabled) {
    //  this.setState(defaultState);
    //  this.lazyLoadBodyRows();
    // }
    // ```

    this.setState({
      sortedColumnIndex: cellIndex,
      isSortDescending,
    });
  }

  getBodyRows() {
    const foundBodyRows = this.search(this.state.bodyRows, this.state.searchTerm);
    return Sorter.sort(
      foundBodyRows,
      this.cellValueProviders,
      this.state.sortedColumnIndex,
      this.state.isSortDescending
    );
  }

  // Returns a random integer between min (inclusive) and max (inclusive)
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  refreshHeaderColumnElementReferences() {
    // Cache references to DOM elements.
    this.headerColumnElements = $(`#${this.GRID_ID} thead th`);
    this.stickyHeaderColumnElements = $(`#${this.GRID_ID} .stickyGridHeaderCell`);
  }

  updateStickyHeaderColumnWidths() {
    // Set sticky header column widths to match whatever they currently are
    // in the real table.
    const columnWidths = this.headerColumnElements.map((index, column) => {
      return $(column).innerWidth();
    });

    this.stickyHeaderColumnElements.each((index, element) => {
      $(element).css('width', `${columnWidths[index]}px`);
    });
  }

  measureColumnWidths(items) {
    // This is the container we'll store the styles in.
    this.$stylesContainer = $('<style />').appendTo($('body'));
    // Create and store media queries and column widths.
    const gridStencil = new GridStencil({
      gridId: this.GRID_ID,
      items: items,
      rowCellPropsProviders: this.rowCellPropsProviders,
      headerCellPropsProviders: this.headerCellPropsProviders,
      rowHeight: this.ROW_HEIGHT,
      columnPriorities: this.COLUMN_PRIORITIES,
      totalSpaceAroundGridSides: 100,
      totalCellSidePadding: 16,
    });
    const node = ReactDOM.findDOMNode(this);
    const {
      mediaQueries,
      columnWidths,
    } = gridStencil.createWithNode(node);
    this.$stylesContainer.append(mediaQueries.join('\n'));
    this.$stylesContainer.append(columnWidths.join('\n'));
  }

  generateRows(indexStart, newRowsCount) {
    const newRows = [];
    const indexEnd = indexStart + newRowsCount;
    for (let i = indexStart; i < indexEnd; i++) {
      newRows.push({
        id: i,
        name: `Ford F-${this.getRandomInt(0, 50000)}`,
        status: 'In Production',
        fuel: 'Diesel, Unleaded',
        passengers: this.getRandomInt(0, 100),
        cylinders: this.getRandomInt(0, 8),
        fuelEconomy: this.getRandomInt(0, 200000),
        sold: this.getRandomInt(0, 2000000000),
        registered: this.getRandomInt(0, 2000000000),
        kpiSold: this.getRandomInt(0, 100),
        kpiRegistered: this.getRandomInt(0, 100),
        // TODO: In the case of requesting data from server this
        // could be a more distinct step when state is mixed in
        isSelected: this.state.areAllRowsSelected,
      });
    }
    return newRows;
  }

  lazyLoadBodyRows() {
    if (this.state.isLoadingBodyRows || this.state.isLastPage) return;

    this.setState({
      isLoadingBodyRows: true,
    });

    // Fake request
    const lazyLoadingTimeoutId = window.setTimeout(() => {
      if (this.state.isEmptyStateDemonstration) {
        return this.setState({
          bodyRows: [],
          isInitialLoad: false,
          isLoadingBodyRows: false,
          isLastPage: true,
          isEmpty: true,
        });
      }

      // Current state
      const generatedRows = this.generateRows(this.state.bodyRows.length, this.ROWS_PER_PAGE);
      const isInitialLoad = this.state.isInitialLoad;
      const isResultEmpty = generatedRows.length === 0;

      // Next state
      const bodyRows = isResultEmpty ?
        this.state.bodyRows : [...this.state.bodyRows, ...generatedRows];
      const isLastPage = isResultEmpty;
      const isEmpty = isResultEmpty && isInitialLoad;

      this.setState({
        bodyRows,
        isInitialLoad: false,
        isLoadingBodyRows: false,
        isLastPage,
        isEmpty,
      });
    }, 2000);

    this.setState({
      lazyLoadingTimeoutId,
    });
  }

  search(rows, term) {
    if (!term) {
      return rows;
    }
    const normalizedTerm = term.trim().toLowerCase();
    return rows.filter(row => {
      // It will return true when 1st match is found, otherwise false
      return this.cellValueProviders.some(provider => {
        const cellValue = provider(row);
        if (cellValue === undefined || cellValue === null) {
          return;
        }
        const normalizedCellValue = cellValue.toString().trim().toLowerCase();
        return normalizedCellValue.indexOf(normalizedTerm) !== -1;  // eslint-disable-line consistent-return
      });
    });
  }

  toggleEmptyRows() {
    // Cancel fake ongoing request
    window.clearTimeout(this.state.lazyLoadingTimeoutId);

    // When we have the desired state we request server to load the new
    // data set. Since setting state is batched and not sequential we
    // need to call `lazyLoadBodyRows` or else it won't work as expected.
    this.setState({
      bodyRows: [],
      isEmptyStateDemonstration: !this.state.isEmptyStateDemonstration,
      isLoadingBodyRows: false,
      isLastPage: false,
      isEmpty: false,
      isInitialLoad: true,
    }, this.lazyLoadBodyRows);
  }

  toggleAllRowsSelected(areAllRowsSelected) {
    const bodyRows = this.state.bodyRows.map(row => {
      row.isSelected = areAllRowsSelected;
      return row;
    });
    this.setState({
      bodyRows,
      areAllRowsSelected,
    });
  }

  toggleRowSelected(id, isRowSelected) {
    let areAllRowsSelected = true;
    const bodyRows = this.state.bodyRows.map(row => {
      if (row.id === id) {
        row.isSelected = isRowSelected;
      }
      if (!row.isSelected) {
        areAllRowsSelected = false;
      }
      return row;
    });

    this.setState({
      bodyRows,
      areAllRowsSelected,
    });
  }

  renderExampleControls() {
    return (
      <p>
        <button
          type="button"
          onClick={this.toggleEmptyRows.bind(this)}
        >
          {this.state.isEmptyStateDemonstration
            ? 'Test loading rows'
            : 'Test empty state'}
        </button>
      </p>
    );
  }

  renderGridControls() {
    return (
      <GridControls>
        <GridSearch
          onSearch={this.onSearch.bind(this)}
        />
      </GridControls>
    );
  }

  renderInitialLoadingRow() {
    if (this.state.isInitialLoad) {
      return <GridLoadingRow columnsCount={this.COLUMNS_COUNT} isInitial />;
    }
  }

  renderEmptyRow() {
    if (this.state.isEmpty) {
      return <GridEmptyRow columnsCount={this.COLUMNS_COUNT} />;
    }
  }

  renderLoadingRow() {
    if (this.state.isLoadingBodyRows && !this.state.isInitialLoad && !this.state.isEmpty) {
      return <GridLoadingRow columnsCount={this.COLUMNS_COUNT} />;
    }
  }

  renderGridHeader() {
    return (
      <GridHeader
        headerCellPropsProviders={this.headerCellPropsProviders}
      />
    );
  }

  renderGrid() {
    const rows = [];
    const items = this.getBodyRows();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Add items, in order.
      const stripedClass = (i % 2 === 0) ? 'gridRow--even' : 'gridRow--odd';
      rows.push(
        <GridRow
          key={item.id}
          item={item}
          rowCellPropsProviders={this.rowCellPropsProviders}
          onClick={this.onClickRow.bind(this)}
          height={this.ROW_HEIGHT}
          classBodyRow={stripedClass}
        />
      );
    }

    const rowRecycler = new GridRowRecycler({
      rows,
      recycledRowsOverflowDistance: 1300,
      recycledRowsCount: 120,
      getItemHeight: item => {
        return item.props.height;
      },
    });

    return (
      <StickyGrid
        id={this.GRID_ID}
        headerCellPropsProviders={this.headerCellPropsProviders}
      >
        <Grid
          columnsCount={this.COLUMNS_COUNT}
          header={this.renderGridHeader()}
          rows={rows}
          lazyLoadRows={this.lazyLoadBodyRows.bind(this)}
          // Initial loading state
          initialLoadingRow={this.renderInitialLoadingRow()}
          // Empty state
          emptyRow={this.renderEmptyRow()}
          // Loading state
          loadingRow={this.renderLoadingRow()}
          onClickRow={this.onClickRow.bind(this)}
          rowRecycler={rowRecycler}
        />
      </StickyGrid>
    );
  }

  render() {
    return (
      <Page title={this.props.route.name}>

        <Example isClear>

          {this.renderExampleControls()}

          <br/>

          {this.renderGridControls()}

          {this.renderGrid()}

        </Example>

      </Page>
    );
  }

}
