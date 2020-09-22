import { GroupBy } from '../types';
import { FunctionComponent } from 'react';
import { InlineFormLabel, SegmentInput } from '@grafana/ui';
import React from 'react';

export interface Props {
  groupBy: GroupBy;
  onChange: (groupBy: GroupBy) => void;
}

export const GroupByLabel: FunctionComponent<Props> = ({ groupBy, onChange }) => (
  <>
    <InlineFormLabel className="query-keyword" width={11}>
      sliding step (optional)
    </InlineFormLabel>
    <SegmentInput value={groupBy.step} onChange={string => onChange({ ...groupBy, step: string.toString() })} />
    <InlineFormLabel className="query-keyword" width={7}>
      time interval
    </InlineFormLabel>
    <SegmentInput value={groupBy.interval} onChange={string => onChange({ ...groupBy, interval: string.toString() })} />
  </>
);
