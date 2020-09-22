import { SelectableValue } from '@grafana/data';

export const toOption = (value: string) => ({ label: value, value } as SelectableValue<string>);
