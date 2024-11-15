import {Injectable} from '@angular/core';
import {InMemoryDbService, RequestInfo} from "angular-in-memory-web-api";

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tableSettings = [
      {
        alias: 'id',
        title: 'ID',
        type: 'number',
        sort: 'asc'
      },
      {
        alias: 'name',
        title: 'Имя',
        type: 'string',
        sort: null
      },
      {
        alias: 'age',
        title: 'Возраст',
        type: 'number',
        sort: null
      },
      {
        alias: 'email',
        title: 'Электронная почта',
        type: 'string',
        sort: null
      },
    ];
    const tableData = [
      {id: 1, name: 'Alexey', age: 25, email: 'alexey@yandex.ru'},
      {id: 2, name: 'Olga', age: 30, email: 'olga@gmail.com'},
      {id: 3, name: 'Ivan', age: 28, email: 'ivan@hotmail.com'},
      {id: 4, name: 'Svetlana', age: 35, email: 'svetlana@outlook.com'},
      {id: 5, name: 'Dmitry', age: 22, email: 'dmitry@mail.ru'},
      {id: 6, name: 'Tatiana', age: 27, email: 'tatiana@rambler.ru'},
      {id: 7, name: 'Nikolay', age: 31, email: 'nikolay@yahoo.com'},
      {id: 8, name: 'Irina', age: 29, email: 'irina@inbox.ru'},
      {id: 9, name: 'Andrey', age: 26, email: 'andrey@aol.com'},
      {id: 10, name: 'Elena', age: 33, email: 'elena@icloud.com'},
      {id: 11, name: 'Mikhail', age: 24, email: 'mikhail@live.com'},
      {id: 12, name: 'Natalia', age: 32, email: 'natalia@bk.ru'},
      {id: 13, name: 'Sergey', age: 23, email: 'sergey@protonmail.com'},
      {id: 14, name: 'Alina', age: 21, email: 'alina@gmx.com'},
      {id: 15, name: 'Vladimir', age: 34, email: 'vladimir@yandex.com'},
      {id: 16, name: 'Marina', age: 28, email: 'marina@tut.by'},
      {id: 17, name: 'Pavel', age: 30, email: 'pavel@rediffmail.com'},
      {id: 18, name: 'Anna', age: 29, email: 'anna@zoho.com'},
      {id: 19, name: 'Igor', age: 27, email: 'igor@rocketmail.com'},
      {id: 20, name: 'Victoria', age: 26, email: 'victoria@mail.com'}
    ];

    const table = {
      columns: tableSettings,
      data: tableData,
      pages: {
        total: 2,
        current: 1
      }
    }

    return {table};
  }

  get(reqInfo: RequestInfo) {
    if (reqInfo.collectionName === 'gettabledata') {
      const db = this.createDb();
      let tableData = db.table.data;
      let tableSettings = db.table.columns;
      let page = 1;
      let totalPages = 1;

      if(reqInfo.query.has('sidx') && reqInfo.query.has('sord')) {
        const columnAlias = reqInfo.query.get('sidx')![0];
        const sortOrder = reqInfo.query.get('sord')![0].toLowerCase();
        tableSettings.forEach((column) => {
          if(column.alias === columnAlias) {
            column.sort = sortOrder;
          } else {
            column.sort = null;
          }
        })

        tableData = tableData.sort((a: any, b: any) => {
          const aValue = a[columnAlias];
          const bValue = b[columnAlias];

          if (aValue < bValue) {
            return sortOrder === 'desc' ? 1 : -1;
          }
          if (aValue > bValue) {
            return sortOrder === 'desc' ? -1 : 1;
          }
          return 0;
        });

      }

      if(reqInfo.query.has('page')) {
        page = Number(reqInfo.query.get('page')![0]);
        const step = 10;
        totalPages =  Math.ceil(tableData.length / step);
        const lastIndex = step * page;
        const firstIndex = lastIndex - step;

        tableData = tableData.slice(firstIndex, lastIndex)
      }

      const table = {
        columns: tableSettings,
        data: tableData,
        pages: {
          total: totalPages,
          current: page
        }
      }

      return reqInfo.utils.createResponse$(() => ({
        body: table,
        status: 200
      }));
    }
    return undefined;
  }
}
