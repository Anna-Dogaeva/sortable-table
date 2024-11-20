import {ESortDirections, ETableDataTypes} from "../constants/table.constants";

export interface ITableColumn {
  alias: string;
  title: string;
  type: ETableDataTypes;
  sort: ESortDirections | null;
}

export interface ITableData {
  [key: string]: ETableDataTypes;
}

export interface ITable {
  columns: ITableColumn[],
  data: ITableData[],
  pages?: {
    total: number,
    current: number
  }
}

export interface ISort {
  sidx: string;
  sord: string;
}

