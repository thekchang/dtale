import { shallow } from 'enzyme';
import React from 'react';

import { ReactMissingNoCharts } from '../../../dtale/side/MissingNoCharts';
import * as fetcher from '../../../fetcher';
import FilterSelect from '../../../popups/analysis/filters/FilterSelect';
import ColumnSelect from '../../../popups/create/ColumnSelect';
import reduxUtils from '../../redux-test-utils';
import { tick } from '../../test-utils';

describe('MissingNoCharts', () => {
  let wrapper, props, fetchJsonSpy;
  const { open } = window;

  beforeAll(() => {
    delete window.open;
    window.open = jest.fn();
  });

  beforeEach(async () => {
    fetchJsonSpy = jest.spyOn(fetcher, 'fetchJson');
    fetchJsonSpy.mockImplementation((_url, callback) => {
      callback({ ...reduxUtils.DTYPES, success: true });
    });
    props = {
      dataId: '1',
      hideSidePanel: jest.fn(),
    };
    wrapper = shallow(<ReactMissingNoCharts {...props} />);
    await tick();
  });

  afterEach(() => jest.clearAllMocks());

  afterAll(() => {
    jest.restoreAllMocks();
    window.open = open;
  });

  it('renders successfully', () => {
    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.state()).toEqual(
      expect.objectContaining({
        chartType: 'heatmap',
        freq: { value: 'BQ', label: 'BQ - BQ' },
        dateCol: { value: 'col4' },
        imageLoading: true,
      }),
    );
    expect(wrapper.state().dtypes).toHaveLength(4);
    expect(wrapper.state().dateCols).toHaveLength(1);
    expect(wrapper.state().imageUrl.startsWith('/dtale/missingno/heatmap/1?date_index=col4&freq=BQ')).toBeTruthy();
    expect(
      wrapper.state().fileUrl.startsWith('/dtale/missingno/heatmap/1?date_index=col4&freq=BQ&file=true'),
    ).toBeTruthy();
  });

  it('updates URLs on chart prop changes', () => {
    wrapper.setState({ chartType: 'bar' });
    expect(wrapper.state().imageUrl.startsWith('/dtale/missingno/bar/1?date_index=col4&freq=BQ')).toBeTruthy();
    expect(wrapper.state().fileUrl.startsWith('/dtale/missingno/bar/1?date_index=col4&freq=BQ&file=true')).toBeTruthy();
  });

  it('includes date col & freq in matrix chart', async () => {
    wrapper.setState({ chartType: 'matrix' });
    const currState = wrapper.state();
    wrapper
      .find(ColumnSelect)
      .first()
      .props()
      .updateState({ dateCol: { value: currState.dateCols[0].name } });
    const freqSelect = wrapper.find(FilterSelect).first().props();
    freqSelect.selectProps.onChange(freqSelect.selectProps.options[1]);
    wrapper.update();
    await tick();
    wrapper.find('button').first().simulate('click');
    let urlExpected = '/dtale/missingno/matrix/1?date_index=col4&freq=C';
    expect(window.open.mock.calls[0][0].startsWith(urlExpected)).toBeTruthy();
    wrapper.find('button').at(1).simulate('click');
    urlExpected = `${urlExpected}&file=true`;
    expect(window.open.mock.calls[1][0].startsWith(urlExpected)).toBeTruthy();
  });

  it('image loading updates state', () => {
    wrapper.find('img').props().onLoad();
    expect(wrapper.state().imageLoading).toBe(false);
  });

  it('shows error when image cannot be rendered', () => {
    wrapper.find('img').props().onError();
    expect(wrapper.state().error).toBeDefined();
  });

  it('handles dtype loading error gracefully', async () => {
    fetchJsonSpy.mockImplementation((_url, callback) => {
      callback({ error: 'dtype error', success: false });
    });
    wrapper = shallow(<ReactMissingNoCharts {...props} />);
    await tick();
    expect(wrapper.state().error).toBeDefined();
  });
});
