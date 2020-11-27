import React, { PureComponent } from 'react';
import { toOption } from './functions';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './DataSource';
import { Fill, GroupBy, MyDataSourceOptions, MyQuery } from './types';

import { QueryInlineField } from './componments/Form';
import { TimeSeries } from './componments/TimeSeries';
import { GroupByLabel } from './componments/GroupBy';
import { Aggregation } from './componments/Aggregation';
import { FillClause } from './componments/Fill';
import { Segment } from '@grafana/ui';

interface State {
  timeSeries: string[];
  options: Array<Array<SelectableValue<string>>>;
  aggregations: string[];
  groupBy: GroupBy;
  fillClauses: Fill[];
  isPoint: boolean;
  point: string;
  isAggregated: boolean;
  aggregated: string;
}

const selectElement = [
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

const selectPoint = ['sampling interval', 'sampling points'];
const selectRaw = ['Raw', 'Aggregation'];

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props, State> {
  state: State = {
    timeSeries: [],
    options: [[toOption('')]],
    aggregations: [],
    groupBy: {
      samplingInterval: '',
      step: '',
      samplingPoints: 0,
    },
    fillClauses: [],
    isPoint: true,
    point: selectPoint[1],
    isAggregated: false,
    aggregated: selectRaw[0],
  };

  onTimeSeriesChange = (t: string[], options: Array<Array<SelectableValue<string>>>) => {
    const { onChange, query } = this.props;
    if (t.length === options.length) {
      this.props.datasource.metricFindQuery(['root', ...t]).then(a => {
        const b = a.map(a => a.text).map(toOption);
        this.setState({ timeSeries: t, options: [...options, b] });
        onChange({ ...query, timeSeries: t });
      });
    } else {
      this.setState({ timeSeries: t });
      onChange({ ...query, timeSeries: t });
    }
  };

  onAggregationsChange = (a: string[]) => {
    const { onChange, query } = this.props;
    this.setState({ aggregations: a });
    onChange({ ...query, aggregations: a });
  };

  onFillsChange = (f: Fill[]) => {
    const { onChange, query } = this.props;
    this.setState({ fillClauses: f });
    onChange({ ...query, fills: f });
  };

  onGroupByChange = (g: GroupBy) => {
    const { onChange, query } = this.props;
    this.setState({ groupBy: g });
    onChange({ ...query, groupBy: g });
  };

  componentDidMount() {
    if (this.state.options.length === 1 && this.state.options[0][0].value === '') {
      this.props.datasource.metricFindQuery(['root']).then(a => {
        const b = a.map(a => a.text).map(toOption);
        this.setState({ options: [b] });
      });
    }
  }

  render() {
    return (
      <>
        <div className="gf-form">
          <QueryInlineField label={'Time-Series'}>
            <TimeSeries
              timeSeries={this.state.timeSeries}
              onChange={this.onTimeSeriesChange}
              variableOptionGroup={this.state.options}
            />
            <Segment
              onChange={({ value: value = '' }) => {
                if (value === selectRaw[0]) {
                  this.setState({ isAggregated: false, aggregated: selectRaw[0] });
                } else {
                  this.setState({ isAggregated: true, aggregated: selectRaw[1] });
                }
              }}
              options={selectRaw.map(toOption)}
              value={this.state.aggregated}
              className="query-keyword"
            />
          </QueryInlineField>
        </div>
        {this.state.isAggregated && (
          <>
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
                <Segment
                  onChange={({ value: value = '' }) => {
                    if (value === selectPoint[0]) {
                      this.setState({ isPoint: false, point: selectPoint[0] });
                    } else {
                      this.setState({ isPoint: true, point: selectPoint[1] });
                    }
                  }}
                  value={this.state.point}
                  options={selectPoint.map(toOption)}
                />
                <GroupByLabel
                  groupBy={this.state.groupBy}
                  onChange={this.onGroupByChange}
                  isPoint={this.state.isPoint}
                />
              </QueryInlineField>
            </div>
            <div className="gf-form">
              <QueryInlineField label={'Fill'}>
                <FillClause fillClauses={this.state.fillClauses} onChange={this.onFillsChange} />
              </QueryInlineField>
            </div>
          </>
        )}
      </>
    );
  }
}
