import React, { FunctionComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Segment } from '@grafana/ui';

export interface Props {
  aggregation: string;
  onChange: (path: string) => void;
  variableOptionGroup: Array<SelectableValue<string>>;
}

export const Aggregation: FunctionComponent<Props> = ({ aggregation, onChange, variableOptionGroup }) => {
  return (
    <Segment
      allowCustomValue={false}
      options={[...variableOptionGroup]}
      value={aggregation}
      onChange={(item: SelectableValue<string>) => {
        let itemString = '';
        if (item.value) {
          itemString = item.value;
        }
        onChange(itemString);
      }}
    />
  );
};
