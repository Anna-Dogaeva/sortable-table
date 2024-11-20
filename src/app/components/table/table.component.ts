import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TableService} from "./services/table.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ISort, ITable, ITableColumn} from "./interfaces/table.interface";
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf} from "@angular/common";
import {ESortDirections} from "./constants/table.constants";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

/**
 * Sortable table component with pagination
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    KeyValuePipe,
    AsyncPipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [TableService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  private _tableService: TableService = inject(TableService);
  private _tableDataSubject: BehaviorSubject<ITable> = new BehaviorSubject<ITable>({'columns': [], 'data': []});
  public tableData$: Observable<ITable> = this._tableDataSubject.asObservable();
  private _sortData: ISort | undefined;
  private _currentPage: number = 1;
  protected readonly ESortDirections = ESortDirections;
  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this._tableService.fetchTableData()
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((val: ITable) => {
      this._tableDataSubject.next(val);
    })
  }

  /**
   * Toggles sort order
   * @param column
   */
  toggleSort(column: ITableColumn): void {
    const sort = column.sort === ESortDirections.asc ? ESortDirections.desc : ESortDirections.asc;
    this._sortData = {
      sidx: column.alias,
      sord: sort
    }
    this._tableService.fetchTableData(column.alias, sort, this._currentPage)
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((val: ITable) => {
      this._tableDataSubject.next(val);
    })
  }

  /**
   * Changes table page
   * @param nextPage
   */
  changePage(nextPage: number): void {
    this._tableService.fetchTableData(this._sortData?.sidx, this._sortData?.sord, nextPage)
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((val: ITable) => {
      this._tableDataSubject.next(val);
      this._currentPage = nextPage;
    })
  }
}
