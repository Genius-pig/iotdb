import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  timeSeries: string[];
  aggregation?: string;
  fills?: Fill[];
  groupBy?: GroupBy;
  from: number;
  to: number;
}

export interface GroupBy {
  step: string;
  samplingInterval: string;
  samplingPoints: number;
}

export interface Fill {
  dataType: string;
  previous: string;
  duration: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  url: string;
  password: string;
  username: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

export interface Col {
  name: string;
  values: [];
}
