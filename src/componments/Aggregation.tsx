import React, { FunctionComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Segment, Icon } from '@grafana/ui';

export interface Props {
  aggregations: string[];
  onChange: (path: string[]) => void;
  variableOptionGroup: Array<SelectableValue<string>>;
}

const removeText = '-- remove stat --';
const removeOption: SelectableValue<string> = { label: removeText, value: removeText };

export const Aggregation: FunctionComponent<Props> = ({ aggregations, onChange, variableOptionGroup }) => {
  return (
    <>
      {aggregations &&
        aggregations.map((value, index) => (
          <>
            <Segment
              allowCustomValue={false}
              key={value + index}
              value={value}
              options={[...variableOptionGroup, removeOption]}
              onChange={(item: SelectableValue<string>) => {
                let itemString = '';
                if (item.value) {
                  itemString = item.value;
                }
                if (itemString === removeText) {
                  onChange(aggregations.filter((_, i) => i !== index));
                } else {
                  onChange(aggregations.map((v, i) => (i === index ? itemString : v)));
                }
              }}
            />
          </>
        ))}
      <Segment
        allowCustomValue={false}
        Component={
          <a className="gf-form-label query-part">
            <Icon name="plus" />
          </a>
        }
        onChange={(item: SelectableValue<string>) => {
          let itemString = '';
          if (item.value) {
            itemString = item.value;
          }
          onChange([...aggregations, itemString]);
        }}
        options={variableOptionGroup}
      />
    </>
  );
};
