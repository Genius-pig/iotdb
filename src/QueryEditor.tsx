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
import { getChildPaths } from './functions'

interface State {
  timeSeries: string[];
  options: Array<SelectableValue<string>>[];
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
    options: [],
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

  onOptionsChange = (options: Array<SelectableValue<string>>[]) => {
    if(this.state.timeSeries.length === options.length) {
      if(this.state.timeSeries.length === 0) {
        getChildPaths(["root"], this.props.datasource.url).then( childPaths => {
          this.setState({options : [...options, childPaths]})
        });
      } else {
        getChildPaths(["root", ...this.state.timeSeries], this.props.datasource.url).then( childPaths => {
          this.setState({options : [...options, childPaths]})
        });
      }
    } else {
      throw Error("can't find child path");
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
              onChangeOptions={this.onOptionsChange}
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
