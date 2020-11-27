import { MetricFindValue, SelectableValue } from '@grafana/data';

export const toOption = (value: string) => ({ label: value, value } as SelectableValue<string>);

export const toMetricFindValue = (value: string) => ({ text: value } as MetricFindValue);
