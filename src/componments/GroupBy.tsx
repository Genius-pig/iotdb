import { GroupBy } from '../types';
import { FunctionComponent } from 'react';
import { InlineFormLabel, SegmentInput } from '@grafana/ui';
import React from 'react';

export interface Props {
  groupBy: GroupBy;
  onChange: (groupBy: GroupBy) => void;
  isPoint: boolean;
}

export const GroupByLabel: FunctionComponent<Props> = ({ groupBy, onChange, isPoint }) => (
  <>
    {!isPoint && (
      <>
        <SegmentInput
          value={groupBy.samplingInterval}
          onChange={string => onChange({ ...groupBy, samplingInterval: string.toString() })}
        />
        <InlineFormLabel className="query-keyword" width={11}>
          sliding step (optional)
        </InlineFormLabel>
        <SegmentInput value={groupBy.step} onChange={string => onChange({ ...groupBy, step: string.toString() })} />
      </>
    )}
    {isPoint && (
      <>
        <SegmentInput
          value={groupBy.samplingPoints}
          onChange={number => onChange({ ...groupBy, samplingPoints: Number.parseInt(number.toString(), 10) })}
        />
      </>
    )}
  </>
);
