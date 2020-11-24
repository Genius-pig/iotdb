import { SelectableValue } from '@grafana/data';
import { getBackendSrv } from "@grafana/runtime";

export const toOption = (value: string) => ({ label: value, value } as SelectableValue<string>);

export async function getChildPaths(detachedPath: string[], url: string ) {
  return await getBackendSrv()
    .datasourceRequest({
      method: 'POST',
      url: url + '/getChildPath',
    })
    .then(response => response.data).then(data => data.map(toOption));
}
