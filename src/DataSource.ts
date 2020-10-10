import { getBackendSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';
import { toDataFrame } from './functions';

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

    // Return a constant for each query.
    const data = options.targets.map(target => {
      target.from = range!.from.valueOf();
      target.to = range!.to.valueOf();
      console.log(target);
      let d: MutableDataFrame = new MutableDataFrame({ refId: target.refId, fields: [] });
      getBackendSrv()
        .datasourceRequest({
          url: this.url + '/query',
          method: 'POST',
          data: target,
        })
        .then(response => response.data)
        .then(data => {
          if (data instanceof Array) {
            console.log(data);
            return data.map(toDataFrame);
          } else {
            throw new Error(data.toString());
          }
        })
        .then(f => {
          console.log(f);
          d = new MutableDataFrame({ refId: target.refId, fields: f });
          console.log(d);
        });
      return d;
    });

    return { data };
  }

  async testDatasource() {
    console.log(this.url + '/user/login?username=' + this.username + '&password=' + this.password);
    return getBackendSrv().datasourceRequest({
      url: this.url + '/user/login?username=' + this.username + '&password=' + this.password,
      method: 'GET',
    });
  }
}
