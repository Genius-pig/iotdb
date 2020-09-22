import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { toOption } from './functions';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { defaultQuery, Fill, GroupBy, MyDataSourceOptions, MyQuery } from './types';

import { QueryInlineField } from './componments/Form';
import { TimeSeries } from './componments/TimeSeries';
import { GroupByLabel } from './componments/GroupBy';
import { Aggregation } from './componments/Aggregation';
import { FillClause } from './componments/Fill';

interface State {
  timeSeries: string[];
  aggregations: string[];
  groupBy: GroupBy;
  fillClause: Fill;
}

const selectElement = [
  'RAW',
  'MIN_TIME',
  'MAX_TIME',
  'MIN_VALUE',
  'MAX_VALUE',
  'COUNT',
  'AVG',
  'FIRST_VALUE',
  'SUM',
  'LAST_VALUE',
];

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props, State> {
  state: State = {
    timeSeries: [],
    aggregations: [],
    groupBy: {
      interval: '',
      step: '',
    },
    fillClause: {
      previous: '',
      dataType: '',
    },
  };

  onTimeSeriesChange = (t: string[]) => {
    const { onChange, query } = this.props;
    this.setState({ timeSeries: t });
    onChange({ ...query, timeSeries: t });
  };

  onAggregationsChange = (a: string[]) => {
    const { onChange, query } = this.props;
    this.setState({ aggregations: a });
    onChange({ ...query, aggregations: a });
  };

  onFillChange = (f: Fill) => {
    const { onChange, query } = this.props;
    this.setState({ fillClause: f });
    onChange({ ...query, fill: f });
  };

  onGroupByChange = (g: GroupBy) => {
    const { onChange, query } = this.props;
    this.setState({ groupBy: g });
    onChange({ ...query, groupBy: g });
  };

  onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, constant: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  render() {
    defaults(this.props.query, defaultQuery);
    return (
      <>
        <div className="gf-form">
          <QueryInlineField label={'Time-Series'}>
            <TimeSeries
              timeSeries={this.state.timeSeries}
              onChange={this.onTimeSeriesChange}
              variableOptionGroup={selectElement.map(toOption)}
            />
          </QueryInlineField>
        </div>
        <div className="gf-form">
          <QueryInlineField label={'Function'}>
            <Aggregation
              aggregations={this.state.aggregations}
              onChange={this.onAggregationsChange}
              variableOptionGroup={selectElement.map(toOption)}
            />
          </QueryInlineField>
        </div>
        <div className="gf-form">
          <QueryInlineField label={'Group By'}>
            <GroupByLabel groupBy={this.state.groupBy} onChange={this.onGroupByChange} />
          </QueryInlineField>
        </div>
        <div className="gf-form">
          <QueryInlineField label={'Fill'}>
            <FillClause fillClause={this.state.fillClause} onChange={this.onFillChange} />
          </QueryInlineField>
        </div>
      </>
    );
  }
}
