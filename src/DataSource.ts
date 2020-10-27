import { getBackendSrv } from '@grafana/runtime';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  toDataFrame,
} from '@grafana/data';

import { MyDataSourceOptions, MyQuery } from './types';

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
      return this.doRequest(target).then(response => {
        return response.data.map((a: any) => {
          return toDataFrame(a);
        });
      });
    });
    return Promise.all(dataFrames).then(data => ({ data }));
  }

  async doRequest(query: MyQuery) {
    return await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: this.url + '/query',
      data: query,
    });
  }

  async testDatasource() {
    console.log(this.url + '/user/login?username=' + this.username + '&password=' + this.password);
    return getBackendSrv().datasourceRequest({
      url: this.url + '/user/login?username=' + this.username + '&password=' + this.password,
      method: 'GET',
    });
  }
}
