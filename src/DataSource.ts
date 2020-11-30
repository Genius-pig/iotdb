import { getBackendSrv } from '@grafana/runtime';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
  toDataFrame,
} from '@grafana/data';

import { MyDataSourceOptions, MyQuery } from './types';
import { toMetricFindValue } from './functions';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  username: string;
  password: string;
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.jsonData.url;
    this.password = instanceSettings.jsonData.password;
    this.username = instanceSettings.jsonData.username;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const dataFrames = options.targets.map(target => {
      target.from = range!.from.valueOf();
      target.to = range!.to.valueOf();
      return this.doRequest(target);
    });
    return Promise.all(dataFrames)
      .then(arrays => [].concat.apply([], arrays))
      .then(data => ({ data }));
    // const { range } = options;
    // const from = range!.from.valueOf();
    // const to = range!.to.valueOf();
    //
    // // Return a constant for each query.
    // const data = options.targets.map(target => {
    //   return new MutableDataFrame({
    //     refId: target.refId,
    //     fields: [
    //       { name: 'Time', values: [from, to], type: FieldType.time },
    //       { name: 'Value', values: [1, 1], type: FieldType.number },
    //     ],
    //   });
    // });
    //
    // return { data };
  }

  async doRequest(query: MyQuery) {
    return await getBackendSrv()
      .datasourceRequest({
        method: 'POST',
        url: this.url + '/query',
        data: query,
      })
      .then(response => response.data)
      .then(a => a.map(toDataFrame));
  }

  metricFindQuery(query: any, options?: any): Promise<MetricFindValue[]> {
    return this.getChildPaths(query);
  }

  async getChildPaths(detachedPath: string[]) {
    const prefixPath: string = detachedPath.reduce((a, b) => a + '.' + b);
    return await getBackendSrv()
      .datasourceRequest({
        method: 'GET',
        url: this.url + '/getChildPaths?path=' + prefixPath,
      })
      .then(response => {
        if (response.data instanceof Array) {
          return response.data;
        } else {
          if(response.data.result.includes('measurement')) {
            throw 'measurement';
          } else {
            return [''];
          }
        }
      })
      .then(data => data.map(toMetricFindValue));
  }

  async testDatasource() {
    return getBackendSrv().datasourceRequest({
      url: this.url + '/user/login?username=' + this.username + '&password=' + this.password,
      method: 'GET',
    });
  }
}
