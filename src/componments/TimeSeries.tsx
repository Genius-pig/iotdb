import React, { FunctionComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Segment, Icon } from '@grafana/ui';

export interface Props {
  timeSeries: string[];
  onChange: (path: string[]) => void;
  variableOptionGroup: Array<SelectableValue<string>>;
}

const removeText = '-- remove stat --';
const removeOption: SelectableValue<string> = { label: removeText, value: removeText };

export const TimeSeries: FunctionComponent<Props> = ({ timeSeries, onChange }) => {
  return (
    <>
      {timeSeries &&
        timeSeries.map((value, index) => (
          <>
            <Segment
              allowCustomValue
              key={value + index}
              value={value}
              options={[removeOption]}
              onChange={({ value: value = '' }) => {
                if (value === removeText) {
                  onChange(timeSeries.filter((_, i) => i !== index));
                } else {
                  onChange(timeSeries.map((v, i) => (i === index ? value : v)));
                }
              }}
            />
          </>
        ))}
      <Segment
        Component={
          <a className="gf-form-label query-part">
            <Icon name="plus" />
          </a>
        }
        allowCustomValue
        onChange={(item: SelectableValue<string>) => {
          let itemString = '';
          if (item.value) {
            itemString = item.value;
          }
          onChange([...timeSeries, itemString]);
        }}
        options={[]}
      />
    </>
  );
};
