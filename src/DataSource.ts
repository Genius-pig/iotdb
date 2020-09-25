import { getBackendSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

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
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map(target => {
      target.from = range!.from.valueOf();
      target.to = range!.to.valueOf();
      console.log(target);
      getBackendSrv()
        .datasourceRequest({
          url: this.url + '/query',
          method: 'POST',
          data: target,
        })
        .then(response => response.json)
        .then(data => console.log(data));
      return new MutableDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [6.5, 6.5], type: FieldType.number },
        ],
      });
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
