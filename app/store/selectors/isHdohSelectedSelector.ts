import { RootState } from '../types';
// Checks state if there is a selected health authority and if it's Hawaii Dept. of Health.
const isHdohSelectedSelector = (state: RootState): boolean =>
  state.healthcareAuthorities.selectedAuthorities.length > 0
    ? state.healthcareAuthorities.selectedAuthorities[0].name.indexOf(
        'Hawaii',
      ) !== -1
    : false;

export default isHdohSelectedSelector;
