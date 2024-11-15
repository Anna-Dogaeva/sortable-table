import {ESortDirections, ETableDataTypes} from "../constants/table.constants";

export interface ITableColumn {
  alias: string;
  title: string;
  type: ETableDataTypes;
  sort: ESortDirections | null;
}
