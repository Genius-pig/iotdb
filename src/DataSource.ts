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
  data: any[] = [];

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.jsonData.url;
    this.password = instanceSettings.jsonData.password;
    this.username = instanceSettings.jsonData.username;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    options.targets.map(target => {
      console.log(target);
      console.log(range);
      target.from = range!.from.valueOf();
      target.to = range!.to.valueOf();
      this.doRequest(target);
    });

    const dataFrames = this.data.map(toDataFrame);
    // const { range } = options;
    // const timeValues = [range!.from.valueOf(), range!.to.valueOf()];
    // const numberValues = [12.3, 28.6];
    //
    // Create data frame from values.
    // const frame = toDataFrame({
    //   name: 'http_requests_total',
    //   fields: [
    //     { name: 'Time', type: FieldType.time, values: timeValues },
    //     { name: 'Value', type: FieldType.number, values: numberValues },
    //   ],
    // });
    return Promise.all(dataFrames).then(data => ({ data }));
  }

  async doRequest(query: MyQuery) {
    await getBackendSrv()
      .datasourceRequest({
        method: 'POST',
        url: this.url + '/query',
        data: query,
      })
      .then(response => (this.data = response.data));
  }

  async testDatasource() {
    console.log(this.url + '/user/login?username=' + this.username + '&password=' + this.password);
    return getBackendSrv().datasourceRequest({
      url: this.url + '/user/login?username=' + this.username + '&password=' + this.password,
      method: 'GET',
    });
  }
}
