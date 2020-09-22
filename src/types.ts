import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  timeSeries: string[];
  aggregations?: string[];
  fill?: Fill;
  groupBy?: GroupBy;
  constant: number;
}

export interface GroupBy {
  step: string;
  interval: string;
}

export interface Fill {
  dataType: string;
  previous: string;
}

export const defaultQuery: Partial<MyQuery> = {
  constant: 6.5,
};

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
