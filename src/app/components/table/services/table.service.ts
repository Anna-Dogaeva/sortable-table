import {inject, Injectable} from '@angular/core';
import {ITable} from "../interfaces/table.interface";
import {Observable} from "rxjs";
import {API_URL, ESortDirections} from "../constants/table.constants";
import {HttpClient, HttpParams} from "@angular/common/http";

/**
 * Service for table data
 */
@Injectable()
export class TableService {
  private _http: HttpClient = inject(HttpClient);

  /**
   * Fetches table data
   * @param sidx
   * @param sord
   * @param page
   */
  public fetchTableData(sidx: string = 'id', sord: string = ESortDirections.asc, page: number = 1
  ): Observable<ITable> {
    const params = new HttpParams()
      .set('sidx', sidx)
      .set('sord', sord)
      .set('page', page.toString());

    return this._http.get<ITable>(`${API_URL}/gettabledata`, {params});
  }
}
