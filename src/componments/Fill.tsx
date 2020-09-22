import { Fill } from '../types';
import React, { FunctionComponent } from 'react';
import { InlineFormLabel, Segment } from '@grafana/ui';
import { toOption } from '../functions';

export interface Props {
  onChange: (fillClause: Fill) => void;
  fillClause: Fill;
}

const dataType = ['INT32', 'INT64', 'FLOAT', 'DOUBLE', 'BOOLEAN', 'TEXT', 'ALL'];
const previous = ['previous', 'previousUntilLast'];

export const FillClause: FunctionComponent<Props> = ({ fillClause, onChange }) => (
  <>
    <InlineFormLabel className="query-keyword" width={5}>
      dataType
    </InlineFormLabel>
    <Segment
      onChange={({ value: value = '' }) => {
        onChange({ ...fillClause, dataType: value });
      }}
      options={dataType.map(toOption)}
      value={fillClause.dataType}
    />
    <InlineFormLabel className="query-keyword" width={5}>
      fillType
    </InlineFormLabel>
    <Segment
      className={'query-keyword'}
      onChange={({ value: value = '' }) => {
        onChange({ ...fillClause, previous: value });
      }}
      options={previous.map(toOption)}
      value={fillClause.previous}
    />
  </>
);
