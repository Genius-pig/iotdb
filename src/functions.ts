import { FieldType, SelectableValue } from '@grafana/data';

export const toOption = (value: string) => ({ label: value, value } as SelectableValue<string>);

export const toDataFrame = (col: { name: string; values: [any] }) => {
  if (col.name === 'timestamp') {
    return { ...col, type: FieldType.time };
  } else {
    if (typeof col.values[0] === 'number') {
      return { ...col, type: FieldType.number };
    } else if (typeof col.values[0] === 'string') {
      return { ...col, type: FieldType.string };
    } else if (typeof col.values[0] === 'boolean') {
      return { ...col, type: FieldType.boolean };
    } else {
      return { ...col, type: FieldType.other };
    }
  }
};
