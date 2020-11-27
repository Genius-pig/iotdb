import React, { FunctionComponent } from 'react';
import { SelectableValue } from '@grafana/data';
import { Segment, Icon, InlineFormLabel } from '@grafana/ui';

export interface Props {
  timeSeries: string[];
  onChange: (path: string[], options: Array<Array<SelectableValue<string>>>, isRemove: boolean) => void;
  variableOptionGroup: Array<Array<SelectableValue<string>>>;
  shouldAdd: boolean;
}

const removeText = '-- remove stat --';
const removeOption: SelectableValue<string> = { label: removeText, value: removeText };

export const TimeSeries: FunctionComponent<Props> = ({ timeSeries, onChange, variableOptionGroup , shouldAdd}) => {
  return (
    <>
      <>
        <InlineFormLabel width={3}>root</InlineFormLabel>
      </>
      {timeSeries &&
        timeSeries.map((value, index) => (
          <>
            <Segment
              allowCustomValue={false}
              key={value + index}
              value={value}
              options={[removeOption, ...variableOptionGroup[index]]}
              onChange={({ value: selectValue = '' }) => {
                if (selectValue === removeText) {
                  const nextTimeSeries = timeSeries.filter((_, i) => i < index);
                  const nextOptions = variableOptionGroup.filter((_, i) => i < index);
                  onChange(nextTimeSeries, nextOptions, true);
                } else if (selectValue !== value) {
                  const nextTimeSeries = timeSeries.map((v, i) => (i === index ? selectValue : v)).filter((_, i) => i <= index);
                  const nextOptions = variableOptionGroup.filter((_, i) => i <= index);
                  onChange(nextTimeSeries, nextOptions, true);
                }
              }}
            />
          </>
        ))}
      {shouldAdd &&
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
            onChange([...timeSeries, itemString], variableOptionGroup, false);
          }}
          options={variableOptionGroup[variableOptionGroup.length - 1]}
        />
      }
    </>
  );
};
