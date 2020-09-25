import { Fill } from '../types';
import React, { FunctionComponent } from 'react';
import { Icon, Segment, SegmentInput } from '@grafana/ui';
import { toOption } from '../functions';
import { SelectableValue } from '@grafana/data';

export interface Props {
  onChange: (fillClauses: Fill[]) => void;
  fillClauses: Fill[];
}

const removeText = '-- remove stat --';
const removeOption: SelectableValue<string> = { label: removeText, value: removeText };

const previous = ['previous', 'previousUntilLast'];

const dataTypes = ['INT32', 'INT64', 'FLOAT', 'DOUBLE', 'BOOLEAN', 'TEXT', 'ALL'];

export const FillClause: FunctionComponent<Props> = ({ fillClauses, onChange }) => (
  <>
    {fillClauses &&
      fillClauses.map((value, index) => (
        <>
          <Segment
            onChange={({ value: value = '' }) => {
              if (value === removeText) {
                onChange(fillClauses.filter((_, i) => i !== index));
              } else {
                onChange(fillClauses.map((v, i) => (i === index ? { ...v, dataType: value } : v)));
              }
            }}
            options={[...dataTypes.map(toOption), removeOption]}
            value={value.dataType}
          />
          <Segment
            onChange={({ value: value = '' }) => {
              if (value === removeText) {
                onChange(fillClauses.filter((_, i) => i !== index));
              } else {
                onChange(fillClauses.map((v, i) => (i === index ? { ...v, previous: value } : v)));
              }
            }}
            options={[...previous.map(toOption), removeOption]}
            value={value.previous}
          />
          <SegmentInput
            onChange={value => {
              onChange(fillClauses.map((v, i) => (i === index ? { ...v, duration: value.toString() } : v)));
            }}
            value={value.duration}
          />
        </>
      ))}
    {fillClauses.length < 7 && (
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
          dataTypes.filter(d => d.includes(itemString));
          console.log(dataTypes);
          console.log(itemString);
          onChange([...fillClauses, { dataType: itemString, previous: previous[0], duration: '0' }]);
        }}
        options={dataTypes.map(toOption)}
      />
    )}
  </>
);
