import React from 'react';
import renderer from 'react-test-renderer';
import { Aggregation } from './Aggregation';
import { toOption } from '../functions';

describe('Aggregation', () => {
  it('test', () => {
    const tree = renderer.create(<Aggregation  aggregation={'COUNT'} variableOptionGroup={[toOption('COUNT')]} onChange={(path: string) => { console.log(path)}}/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
