import { __CRAYONS_ICON_VERSION__ } from '@freshworks/crayons-icon';
import type { FwIconLibrary } from './library.icon.utils';

const CRAYONS_ICONS_ASSET_PATH = `https://cdn.jsdelivr.net/npm/@freshworks/crayons-icon@${__CRAYONS_ICON_VERSION__}/dist/icons`;
const library: FwIconLibrary = {
  name: 'crayons',
  resolver: (name) => `${CRAYONS_ICONS_ASSET_PATH}/${name}.svg`,
};

export default library;
