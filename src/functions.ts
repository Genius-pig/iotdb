import { SelectableValue } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

export const toOption = (value: string) => ({ label: value, value } as SelectableValue<string>);

export async function getChildPaths(detachedPath: string[], url: string) {
  const prefixPath: string = detachedPath.reduce((a, b) => a + '.' + b);
  return await getBackendSrv()
    .datasourceRequest({
      method: 'GET',
      url: url + '/getChildPaths?path=' + prefixPath,
    })
    .then(response => response.data)
    .then(data => data.map(toOption));
}
