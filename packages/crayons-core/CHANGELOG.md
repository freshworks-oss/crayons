# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.3.0-beta.27](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.26...@freshworks/crayons@4.3.0-beta.27) (2025-04-08)

### Bug Fixes

- **draggable.ts, drag-container.tsx, and form-builder.tsx:** fix bugs related to dep & msdd epic ([6529787](https://github.com/freshworks/crayons/commit/652978711b2cc0a4e19fcd4ce277bec650962f5d))
- **form-builder:** include same container check in count logic ([7b57550](https://github.com/freshworks/crayons/commit/7b57550ed914fadcec7675209ec3a1e90d842b12))

### BREAKING CHANGES

- **draggable.ts, drag-container.tsx, and form-builder.tsx:** The logic for computing the count within sections is revised

## [4.3.0-beta.26](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.25...@freshworks/crayons@4.3.0-beta.26) (2025-02-27)

### Bug Fixes

- added dependent changes ([191d7f1](https://github.com/freshworks/crayons/commit/191d7f15b08f58953558815055266d2dc4fb68ce))

## [4.3.0-beta.23](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.22...@freshworks/crayons@4.3.0-beta.23) (2024-12-10)

### Bug Fixes

- added the error message for section inside section ([#959](https://github.com/freshworks/crayons/issues/959)) ([277a49f](https://github.com/freshworks/crayons/commit/277a49ff3ca19a659f84d914712448e83e5179a8))

## [4.3.0-beta.22](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.21...@freshworks/crayons@4.3.0-beta.22) (2024-12-04)

### Bug Fixes

- unable to drag and drop fields on custom objects ([2c4228e](https://github.com/freshworks/crayons/commit/2c4228eeb309b6b6febec6953e89ea5738690ee4))

## [4.3.0-beta.21](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.20...@freshworks/crayons@4.3.0-beta.21) (2024-11-14)

### Bug Fixes

- add validation for is language for isValid ([4110887](https://github.com/freshworks/crayons/commit/411088792a8fccdff2bc2a7dd2201069f5c1dd9b))
- check for error handling for format related issue ([1a2b66f](https://github.com/freshworks/crayons/commit/1a2b66fb95832b10d5ebe37c88e1925f30caccf5))
- datepicker issue ([039369f](https://github.com/freshworks/crayons/commit/039369f71f1a309fd5d9dac2260104138032a647))
- datepicker issue changes on isValid ([d077d85](https://github.com/freshworks/crayons/commit/d077d858b4e4a71316edbf0e0943cfd200907d58))
- datepicker issue fix ([26b7a18](https://github.com/freshworks/crayons/commit/26b7a1830782f5cf4beca9d90ad60434b9760383))
- datepicker issue on filter changes ([f422876](https://github.com/freshworks/crayons/commit/f4228764b0187dd8bd21358684526cb9ea315eca))
- datepicker year issue fix ([20852fc](https://github.com/freshworks/crayons/commit/20852fcc9e39c196bba81da8543d7c9222164046))
- datepicket changes on isMatch ([38d84f8](https://github.com/freshworks/crayons/commit/38d84f842d4160e9ef7cf3d62d1e78e59c3d4c28))
- emitEvent error handling on parsing of icelandic language ([6ecaec9](https://github.com/freshworks/crayons/commit/6ecaec9f4786e8d46a5174c814300f585f2f16d4))
- generalising the datepicker for icelandic language ([d00f87b](https://github.com/freshworks/crayons/commit/d00f87bf533abc3f7d3c6494dff363d91e35b715))
- is date validation and matching restriction ([ccf0af2](https://github.com/freshworks/crayons/commit/ccf0af26640415bcfa2bd0d21d3e29cef58acd1d))
- isMatch change issue for icelandic language ([d44532c](https://github.com/freshworks/crayons/commit/d44532c6b7c20e602616582ddee292e8a64a6141))
- isMatch changes retaining ([802d614](https://github.com/freshworks/crayons/commit/802d6142954c4c9e8bdb0f1024e98f1ee1971197))
- isMatch negation changes ([4a145bc](https://github.com/freshworks/crayons/commit/4a145bc7505954f9ce71d9661c2122e7e214f6b7))
- isValid changes for datefixer ([2ba68f4](https://github.com/freshworks/crayons/commit/2ba68f4820c4936b788bdbb8e7a27dac03a15c68))
- parse date on filter ([4edde18](https://github.com/freshworks/crayons/commit/4edde18ce3c1b55a0a27ee7c79c424c11ac00565))
- parsed date for dateInvalid check ([9fc9b73](https://github.com/freshworks/crayons/commit/9fc9b739fae26d47b4872df2998522de0cfd31a0))
- refresh handle popover parse on icelandic language issue fix ([5677657](https://github.com/freshworks/crayons/commit/56776579250a8967a9bab5772fe66e1a5e5ff881))
- refresh handle popover parse on icelandic language issue fix ([22d391f](https://github.com/freshworks/crayons/commit/22d391fcf2345db9f1d1c16c73c9dc865e43a364))
- remove condition changes for datepicker ([e51919c](https://github.com/freshworks/crayons/commit/e51919cf6764b60cf44130c1f3469965b8d33750))
- retain isMatch funtionality and change in custom function ([1be7cac](https://github.com/freshworks/crayons/commit/1be7cac16adf67c8749791b229dad0148f5b1a45))
- reverse the changes on change value of datepicker ([e4a721e](https://github.com/freshworks/crayons/commit/e4a721ea53431d39a28a65a04c3066cc4b2ac61c))
- test cases failing on isMatch changes completed ([81e488b](https://github.com/freshworks/crayons/commit/81e488b9b0d5512b3b49d8b382f312f399af0016))

## [4.3.0-beta.20](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.19...@freshworks/crayons@4.3.0-beta.20) (2024-11-06)

### Bug Fixes

- adding specifics for icelandic language ([d5cafad](https://github.com/freshworks/crayons/commit/d5cafad0ac2f09daae9d79165de78bfd6bb17e2f))
- change datepicker parse changes for icelandic language ([cb19079](https://github.com/freshworks/crayons/commit/cb19079b26fa38ad69526fc0ef9c926f9da5d35d))
- changes for october month mapping ([44e7ac5](https://github.com/freshworks/crayons/commit/44e7ac559ddf6abeda81d70cce40fc9616e55fab))
- changes related to icelandic language ([bfda140](https://github.com/freshworks/crayons/commit/bfda1403de2edd814cd86005712290977b71c13a))
- icelandic language display format name change ([27e3532](https://github.com/freshworks/crayons/commit/27e353215b92008583048ebe5300ecc6d87d7f4a))
- minor changes in datepicker ([5fef5b9](https://github.com/freshworks/crayons/commit/5fef5b9923f745c63aecda89182a433a4859ef12))

## [4.3.0-beta.18](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.17...@freshworks/crayons@4.3.0-beta.18) (2024-10-03)

### Bug Fixes

- changes to metaText from author for generic text in select option ([bce20c0](https://github.com/freshworks/crayons/commit/bce20c0e881beaf6998401a12c0f811360770568))
- minor update on createDescription changes ([e280127](https://github.com/freshworks/crayons/commit/e28012769f712ca8fa27e0a5dbf2d78958065138))
- test case changes for fw-select ([232a6ec](https://github.com/freshworks/crayons/commit/232a6ece0c6f3802dd276dd716f7273a104a6ccb))
- text cases changes ([ef046bd](https://github.com/freshworks/crayons/commit/ef046bde665872275cd56abb8b5a47d3dcd4a255))

### Features

- addition of dropdownvariant conversations with interface defined ([54e5a0d](https://github.com/freshworks/crayons/commit/54e5a0dc4e60bfbace233345b6f9513902030664))
- handle the scenario when imageSrc is present ([b455ffb](https://github.com/freshworks/crayons/commit/b455ffb9192ff586c6a22053fe41b11891898c01))
- introduction of new variations - conversation to create new select option with author details ([8f3ff04](https://github.com/freshworks/crayons/commit/8f3ff040ca36faf589ac22393d02f32a305eb4d9))

## [4.3.0-beta.17](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.16...@freshworks/crayons@4.3.0-beta.17) (2024-09-30)

### Bug Fixes

- added the fix for ticket field ([34adfd9](https://github.com/freshworks/crayons/commit/34adfd94d656a855837494858162923f1f4de5f3))

## [4.3.0-beta.16](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.15...@freshworks/crayons@4.3.0-beta.16) (2024-09-17)

### Bug Fixes

- add the changes for crayons inbox form changes for dynamic section ([886e6af](https://github.com/freshworks/crayons/commit/886e6af2d510d5b5726b7586a8f398a8db2941e1))
- added test case fix ([235ebdf](https://github.com/freshworks/crayons/commit/235ebdf6b418fdce1bf697e97d51ff53b648ac5f))
- added the index.html and reset changes ([cca6d7e](https://github.com/freshworks/crayons/commit/cca6d7e488c3f5a369e9156360c0d7dd9e3b3bf3))
- added the index.html sample value and reset changes type ([c724f99](https://github.com/freshworks/crayons/commit/c724f9926b858e9d924ea47d1cd7aedcace51f2e))
- added the reposition from section to outside and outside to section ([b69958e](https://github.com/freshworks/crayons/commit/b69958e017e50f9dcf3eda44748fa993a2cf6a61))
- drag error message fix ([501c75d](https://github.com/freshworks/crayons/commit/501c75de67716aa15aadbff22fcc52c9e9c75250))
- edit section ([c11b75f](https://github.com/freshworks/crayons/commit/c11b75f436f3b37696d79ef9488c2170bb7394e5))
- fix the test case ([fc0b001](https://github.com/freshworks/crayons/commit/fc0b001c731ed504606541fdbe42760fb93d0910))

### Features

- added tooltip and section container ([da8111f](https://github.com/freshworks/crayons/commit/da8111f425897283a15d78d163315c1ff0b6d723))
- **component:** add section button changes ([2e4a92a](https://github.com/freshworks/crayons/commit/2e4a92a78f6c628dff15b31c75172f737ba0a14a))
- create section flows ([c04b22c](https://github.com/freshworks/crayons/commit/c04b22c9d41927d28339b9f607fc234c55d9dccf))
- expand and show sections ([e93b762](https://github.com/freshworks/crayons/commit/e93b7621251c29752f86911f3d6dd977046385b7))
- section name validations ([96d7d11](https://github.com/freshworks/crayons/commit/96d7d11acdf8c9f15deda634682d05674cfb4ca4))

## [4.3.0-beta.13](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.12...@freshworks/crayons@4.3.0-beta.13) (2024-08-13)

### Bug Fixes

- **select:** fix readonly issue in rendering input ([#931](https://github.com/freshworks/crayons/issues/931)) ([af360f1](https://github.com/freshworks/crayons/commit/af360f11c0eaf212ce4880558fd20c9f41e40627))

### Features

- addition of variation in select options which will let users to add information related to author details ([#930](https://github.com/freshworks/crayons/issues/930)) ([1fe6f88](https://github.com/freshworks/crayons/commit/1fe6f88acfa8ea4729a8cf31a3c41c5ad51920fc))

## [4.3.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.8...@freshworks/crayons@4.3.0-beta.9) (2024-01-17)

### Bug Fixes

- [FC-118330]: Creates Id if the dropdown is created by textbox ([#907](https://github.com/freshworks/crayons/issues/907)) ([bbd072c](https://github.com/freshworks/crayons/commit/bbd072ce9a275095aa0382b4323e28bd6d34d0e8))

### Features

- **fw-list-options:** modify conditions to virtualise list options ([2de81fb](https://github.com/freshworks/crayons/commit/2de81fbb7456216e974d3f7d1f406dcfd0dd6155))
- **fw-list-options:** modify virtual scroll adapter ([fa72cad](https://github.com/freshworks/crayons/commit/fa72cad6ce98b98a9ef28fbfd3ecd26a8bef77fc))
- **fw-list-options:** modify virtual scroll properties ([65c48df](https://github.com/freshworks/crayons/commit/65c48df1d40cc4e5956aa022cc3d986eec45af57))
- **fw-list-options:** virtualise list options ([677ceb2](https://github.com/freshworks/crayons/commit/677ceb261c00be787942bc0809f5b1bdb98791fa))
- **fw-list-options:** virtualise list options ([7376c11](https://github.com/freshworks/crayons/commit/7376c115f441c290909b9151fba1561984166639))
- **fw-list-options:** virtualize long list of options ([9de981a](https://github.com/freshworks/crayons/commit/9de981a0822da0739da19c28cb36f686aa7f2124))

## [4.3.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.7...@freshworks/crayons@4.3.0-beta.8) (2023-11-07)

### Features

- **toast:** added css variable to set custom z-index for toast stack ([#900](https://github.com/freshworks/crayons/issues/900)) ([d211ee4](https://github.com/freshworks/crayons/commit/d211ee4de29b2f6ac47997125514146efd645d91))

## [4.3.0-beta.7](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.6...@freshworks/crayons@4.3.0-beta.7) (2023-10-16)

### Features

- **file-uploader-2:** adding part support of file uploader ([#897](https://github.com/freshworks/crayons/issues/897)) ([6f055e0](https://github.com/freshworks/crayons/commit/6f055e08b7c3d2053db6b8e9f2b1b43c6dbc6c82))

## [4.3.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.4...@freshworks/crayons@4.3.0-beta.5) (2023-09-26)

### Bug Fixes

- **file-uploader:** correcting MB to KB conversion formula ([#893](https://github.com/freshworks/crayons/issues/893)) ([ef33ea2](https://github.com/freshworks/crayons/commit/ef33ea244a736060050830ffccc01f1eb9a39a4e))

## [4.3.0-beta.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.3...@freshworks/crayons@4.3.0-beta.4) (2023-09-12)

### Features

- **file-uploader-2:** adding part support of file uploader component ([#892](https://github.com/freshworks/crayons/issues/892)) ([32c0e66](https://github.com/freshworks/crayons/commit/32c0e661cb506bd4b3a6a5aded2a1e988b73317f))

## [4.3.0-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.2...@freshworks/crayons@4.3.0-beta.3) (2023-09-06)

### Features

- handles the prevention for toastercontroller approach as well ([#890](https://github.com/freshworks/crayons/issues/890)) ([6419e94](https://github.com/freshworks/crayons/commit/6419e9417c92a1655318368d6703a536f9ec54ae))

## [4.3.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.1...@freshworks/crayons@4.3.0-beta.2) (2023-09-06)

### Features

- **fw-toast:** Handles prevent rendering the duplicate toaster multiple times with in the timeout period ([#888](https://github.com/freshworks/crayons/issues/888)) ([8fd296a](https://github.com/freshworks/crayons/commit/8fd296a9452531b846b1dccadba0166b5a300660))

## [4.3.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.3.0-beta.0...@freshworks/crayons@4.3.0-beta.1) (2023-07-27)

### Features

- **fw-select:** add search variant ([d184338](https://github.com/freshworks/crayons/commit/d18433873cce8d66d46f7a2e28d5941b07ae1fb4))

## [4.3.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.1-beta.0...@freshworks/crayons@4.3.0-beta.0) (2023-07-25)

### Features

- **fw-select:** fix styling for tag container, focus on tags on click/key press, tagProps ([445c3a0](https://github.com/freshworks/crayons/commit/445c3a040679f33e08d7e02f4d8a3144d4517f9e))

## [4.2.0-beta.20](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.19...@freshworks/crayons@4.2.0-beta.20) (2023-06-27)

### Features

- **component:** lookupField added for CONVERSATION_PROPERTIES form ([#866](https://github.com/freshworks/crayons/issues/866)) ([63c90f0](https://github.com/freshworks/crayons/commit/63c90f01488fdb41db2b1bb29334e73e0703a1be))

## [4.2.0-beta.19](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.18...@freshworks/crayons@4.2.0-beta.19) (2023-06-10)

### Bug Fixes

- **select, kebab-menu:** modify popover attribute name to avoid attribute conflict ([8cb9bbe](https://github.com/freshworks/crayons/commit/8cb9bbe209ef0db2f48b5aa5389d80df604e94a0))

## [4.2.0-beta.18](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.17...@freshworks/crayons@4.2.0-beta.18) (2023-06-05)

### Features

- **component:** to support hide and disable form fields dynamically by invoking form methods ([74605c9](https://github.com/freshworks/crayons/commit/74605c960c3095fa812acb0e5d72eada6a40d257))

## [4.2.0-beta.17](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.16...@freshworks/crayons@4.2.0-beta.17) (2023-05-25)

### Bug Fixes

- **form:** handle timezone for datepicker when serializing form values ([#859](https://github.com/freshworks/crayons/issues/859)) ([d3fceaa](https://github.com/freshworks/crayons/commit/d3fceaa15d479142bf1daf4e08e24d70f105a1c7))

### Features

- (fw-select-option): Add default case for select-option ([892d1fe](https://github.com/freshworks/crayons/commit/892d1feb42fe71a201c842eedf1ade4503dec0b1))

## [4.2.0-beta.16](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.15...@freshworks/crayons@4.2.0-beta.16) (2023-05-22)

### Bug Fixes

- **fw-list-options:** remove checkbox for default options ([ebeebc6](https://github.com/freshworks/crayons/commit/ebeebc65f1c8e21690e5366af4b5705c2d70fa52))

## [4.2.0-beta.15](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.14...@freshworks/crayons@4.2.0-beta.15) (2023-05-18)

### Bug Fixes

- **datepicker:** fix timezone offset issue for datepicker in form ([a621fa1](https://github.com/freshworks/crayons/commit/a621fa1ab694f45474ab9071b9f67f376e07d052))
- **datepicker:** restore date range emitted value format ([730339b](https://github.com/freshworks/crayons/commit/730339bb63c50906feeeef3c90962d698b5c2211))

## [4.2.0-beta.14](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.13...@freshworks/crayons@4.2.0-beta.14) (2023-05-15)

### Features

- **fw-select:** add methods to show/hide the dropdown ([954ad1a](https://github.com/freshworks/crayons/commit/954ad1a5bf1f5d7b7be24d365226952b62044f31))

## [4.2.0-beta.13](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.12...@freshworks/crayons@4.2.0-beta.13) (2023-05-12)

### Bug Fixes

- fix styling of checkbox in select option, dynamically change checkbox property ([e043a71](https://github.com/freshworks/crayons/commit/e043a7152a321ec76443f82d88e8bb9ceea0fadf))
- **timepicker:** fix review comments ([5c911ef](https://github.com/freshworks/crayons/commit/5c911ef13fce0fc233ca1649d9c2c2fccc0dbaca))
- **timepicker:** fix timepicker issues ([d3848bd](https://github.com/freshworks/crayons/commit/d3848bdfb787408ba610de0e17dfdba2325e5512))

## [4.2.0-beta.11](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.10...@freshworks/crayons@4.2.0-beta.11) (2023-04-20)

### Bug Fixes

- **datepicker:** handle user timezone offset ([0175e7f](https://github.com/freshworks/crayons/commit/0175e7f27e135e64482cc0254fe10b539bb6c8ce))

### Features

- add keydown event in input component ([20554bc](https://github.com/freshworks/crayons/commit/20554bc5a0e037d847ef00dc63d4259f68f98228))

## [4.2.0-beta.10](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.9...@freshworks/crayons@4.2.0-beta.10) (2023-04-12)

### Features

- **datepicker:** add a prop to make the datepicker occupy full width ([444fcd7](https://github.com/freshworks/crayons/commit/444fcd71e7eff1abec9ec9ad3c30dd750b450bd0))

## [4.2.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.8...@freshworks/crayons@4.2.0-beta.9) (2023-04-05)

### Bug Fixes

- **datepicker:** fix min/max issue and add error validation for invalid input ([4434ed2](https://github.com/freshworks/crayons/commit/4434ed22fe6feabf5321cc18b46491ab588c7098))
- **datepicker:** fix value not being update don input field when it is updtaed ([79f7868](https://github.com/freshworks/crayons/commit/79f7868270438efdf1c6a08758a4325c72558f9f))
- **datepicker:** fox comments ([d59ec1d](https://github.com/freshworks/crayons/commit/d59ec1df12e1d9262902b8acdce51dfcbb4e6193))
- **datepicker:** handle clear input scenario for invalid inputs ([518cbb9](https://github.com/freshworks/crayons/commit/518cbb9430ebfd495557306012833ca7c3ad42c4))
- **daterangepicker:** add toYear check to input validations ([95b224b](https://github.com/freshworks/crayons/commit/95b224b180c3deff9ed7e3238d360aee6815d99a))
- **datetimepicker:** fix value not being updated dynamically for date time picker ([6f5b4eb](https://github.com/freshworks/crayons/commit/6f5b4eb8318f79fbad1884716b3cb58d6d44443e))
- **fw-datepicker:** fix comments ([4aaab60](https://github.com/freshworks/crayons/commit/4aaab60e92abe8b3cbfb738dc0992e3034a77f69))
- **fw-datepicker:** fix datepicker validation issues ([b3915a3](https://github.com/freshworks/crayons/commit/b3915a3d1ddc8935b7e5d61c0f1d91597dd014ba))
- **fw-datepicker:** fix value disappearing when year value is not presnt in the dropdown ([3720f85](https://github.com/freshworks/crayons/commit/3720f8533359acc60abfe37388137129bb6da8ec))
- **fw-datepicker:** fix year value disappearing issue ([44e4be5](https://github.com/freshworks/crayons/commit/44e4be5ef5d6d9e7464d7081d729e694250344fe))
- **fw-datepicker:** handle cancel scenario for single and date range picker ([8df612d](https://github.com/freshworks/crayons/commit/8df612d4715be213db029e63a83d8f391c4ec624))
- **fw-dateranepicker:** fix error validations ([00fc391](https://github.com/freshworks/crayons/commit/00fc391768c9c26021fe2cc1b66cb2e929db6a52))
- **fw-daterangepicker:** add input validations for date range picker ([d2882ad](https://github.com/freshworks/crayons/commit/d2882ad6b6cf83c138aa0830918a7894417b8117))

## [4.2.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.7...@freshworks/crayons@4.2.0-beta.8) (2023-03-31)

### Bug Fixes

- **data-table:** saved settings reset only on structural change ([#831](https://github.com/freshworks/crayons/issues/831)) ([60edac2](https://github.com/freshworks/crayons/commit/60edac2b87f0f8f9212cfc62e078f365b135ce14))

### Features

- **form:** setFieldsValue method to dynamically set values in form fields ([#833](https://github.com/freshworks/crayons/issues/833)) ([18e31fb](https://github.com/freshworks/crayons/commit/18e31fbc0eb6ddf365dbfc022569874caf1b8dc8))
- **fw-textarea:** added maxRows to fw-textarea for dynamic Resizing ([#830](https://github.com/freshworks/crayons/issues/830)) ([df9334f](https://github.com/freshworks/crayons/commit/df9334f6541c61b75f78d4556e12342a6c36e494))

## [4.2.0-beta.7](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.6...@freshworks/crayons@4.2.0-beta.7) (2023-03-22)

### Bug Fixes

- **data-table:** adding widthProperties capability for actions column ([#823](https://github.com/freshworks/crayons/issues/823)) ([81b18dc](https://github.com/freshworks/crayons/commit/81b18dcf1be4d92486a62c98eed0a27afb1dd825))

## [4.2.0-beta.6](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.5...@freshworks/crayons@4.2.0-beta.6) (2023-03-16)

### Bug Fixes

- **form:** reset the value of the form field when setFieldChoices is called ([#821](https://github.com/freshworks/crayons/issues/821)) ([a83284a](https://github.com/freshworks/crayons/commit/a83284a19227a7cd21fe6e972e0b0031bec4c960))

### Features

- add components.d.ts ([5631c66](https://github.com/freshworks/crayons/commit/5631c66a7ce0f05e8b174aaeead77d99f2711c79))
- add max height prop for select ([dfaaf2b](https://github.com/freshworks/crayons/commit/dfaaf2b5f6bd608480ecdb50c81af80ac8cfb5c3))
- **file-uploader-2:** file uploader as part of form ([#810](https://github.com/freshworks/crayons/issues/810)) ([befbc62](https://github.com/freshworks/crayons/commit/befbc62f5f7e7eacf0c9063d8eb1fad55eb0de7b))

## [4.2.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.4...@freshworks/crayons@4.2.0-beta.5) (2023-03-10)

### Bug Fixes

- fix deletion when readonly is set to true ([5ab6fee](https://github.com/freshworks/crayons/commit/5ab6fee0e419721d365a1f757794a5c75508a6f2))

### Features

- **form:** setFieldsRequiredStatus method to dynamically set required status on form fields ([#817](https://github.com/freshworks/crayons/issues/817)) ([e470930](https://github.com/freshworks/crayons/commit/e470930c937e3ab4865003e61cc24c3fee6499a0))

## [4.2.0-beta.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.3...@freshworks/crayons@4.2.0-beta.4) (2023-03-07)

### Bug Fixes

- add tests for the fix ([d16feb4](https://github.com/freshworks/crayons/commit/d16feb4e1d02cb0c4141b218868281196bf10d8c))
- fix re-render value on options change ([f2a1409](https://github.com/freshworks/crayons/commit/f2a14094e17f6ef18712b9b58b7963e3a46f950a))
- replace equality fn ([6cfefbd](https://github.com/freshworks/crayons/commit/6cfefbdb34079886e66e10051b8bd87a5ec48ea1))

## [4.2.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.2.0-beta.1...@freshworks/crayons@4.2.0-beta.2) (2023-02-27)

### Bug Fixes

- disable caret when disabled in fw-select ([f7672b2](https://github.com/freshworks/crayons/commit/f7672b27f653b737166b687dc8d27c4dbee5862c))

### Features

- add kebab menu component, modify row actions in datatable ([2353d66](https://github.com/freshworks/crayons/commit/2353d66cf868ddc5df643573e0ae57da779215b8))
- **form:** support passing initialValues and validation for static form ([#804](https://github.com/freshworks/crayons/issues/804)) ([cc25b62](https://github.com/freshworks/crayons/commit/cc25b62ace511a11396ca76b7dc6820688f54490))
- refactor kebab menu, add UT ([902b793](https://github.com/freshworks/crayons/commit/902b793afb0efa14b4a17633e4871204dc7dac0d))
- update documentation, add graphicsProps to kebab menu, update prop decorators ([27b15bd](https://github.com/freshworks/crayons/commit/27b15bdd77d52dc5d2c51c5a4b22aa5fcfe783e4))

## [4.2.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0...@freshworks/crayons@4.2.0-beta.0) (2023-02-06)

### Features

- **file-uploader-2:** adding new version of file uploader component ([#753](https://github.com/freshworks/crayons/issues/753)) ([0541e0b](https://github.com/freshworks/crayons/commit/0541e0b53720b1f664d38d2e1b165573659a75fc))

## 4.1.0 (2023-02-06)

### Bug Fixes

- **datepicker:** replace event.path with event.composedPath as it is deprecated from chrome 109 v ([8980943](https://github.com/freshworks/crayons/commit/89809437a31dcc5dc1e33acc6d37d627f5393ad7))

## [4.1.0-beta.10](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.9...@freshworks/crayons@4.1.0-beta.10) (2023-02-06)

### Bug Fixes

- **date-picker:** fix min/max year restriction issue ([55ce4a5](https://github.com/freshworks/crayons/commit/55ce4a5fbfc86022513bdf757b7c7704f5ea432f))
- **date-picker:** fix review comments ([297a972](https://github.com/freshworks/crayons/commit/297a9729e1e5ae621f6c56b71b9b534ea38c46fc))
- **datepicker:** add unit test cases ([256d19b](https://github.com/freshworks/crayons/commit/256d19b1bae908501237832d68b14026c1ecb1ae))
- **time-picker:** fix timpicker spinner issue ([b10dc2b](https://github.com/freshworks/crayons/commit/b10dc2bf129dad08823a5e5e4a19e5c845c1fd59))

### Features

- **form:** disable form fields by setting editable property to false and emit event on value change([#787](https://github.com/freshworks/crayons/issues/787)) ([9066189](https://github.com/freshworks/crayons/commit/90661895eee3e94b5d4d71a57dbc4593c76ad595))
- **form:** setFieldSearchText method to filter the display of fields in the form ([#784](https://github.com/freshworks/crayons/issues/784)) ([176b51e](https://github.com/freshworks/crayons/commit/176b51e75603b6c9bf288bbe7a2b5a396797f92d))
- **fw-spinner:** adding a micro variant size for spinner component ([#781](https://github.com/freshworks/crayons/issues/781)) ([1b67d6a](https://github.com/freshworks/crayons/commit/1b67d6aaf9c40807282e25d9fd10b494b4b0f055))
- wrap select input to tags container ([964a55c](https://github.com/freshworks/crayons/commit/964a55ca5d271a84b7a834f777c8e548ea9baddd))

## [4.1.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.8...@freshworks/crayons@4.1.0-beta.9) (2023-01-23)

### Features

- **form:** expose api for setting field choices dynamically ([#763](https://github.com/freshworks/crayons/issues/763)) ([444b5ac](https://github.com/freshworks/crayons/commit/444b5acf6cf535f4f5e73ca3d30a4187f35be185))

## [4.1.0-beta.7](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.6...@freshworks/crayons@4.1.0-beta.7) (2023-01-09)

### Bug Fixes

- revert readonly changes ([390aea9](https://github.com/freshworks/crayons/commit/390aea98708702cb0ae267527cde7a0ebfb372d8))

### Features

- **form:** mapperType and customTypeMapper prop to support `LEGO`, `FORMSERV` and `CUSTOM` type ([#761](https://github.com/freshworks/crayons/issues/761)) ([fc6692d](https://github.com/freshworks/crayons/commit/fc6692d5a3e94f181518a78cb9a83e92042d6334))

## [4.1.0-beta.6](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.5...@freshworks/crayons@4.1.0-beta.6) (2023-01-02)

### Bug Fixes

- **btn-group:** bind onSlotChange method using arrow function ([22525bd](https://github.com/freshworks/crayons/commit/22525bd47607ce00d422aa70ad7698ec2bce6abf))
- **btn-group:** fix typo ([e724378](https://github.com/freshworks/crayons/commit/e724378d02215afa901e7d261ca432f6c388ab0e))
- **button-group:** fix button group styling collapse ([f2f4797](https://github.com/freshworks/crayons/commit/f2f47971291b7279ba2bcf3e1c881ec38bb61968))
- fix issue with unselecting columns in data table ([3de414f](https://github.com/freshworks/crayons/commit/3de414f8257ceee8e40e196c0d0331b941a3b555))

## [4.1.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.4...@freshworks/crayons@4.1.0-beta.5) (2022-12-18)

### Bug Fixes

- fix max limitation in list options component ([9450f5c](https://github.com/freshworks/crayons/commit/9450f5cc4246d0e01858142e6775f36828882e8c))
- set min width for select input and update docs for dynamic updation of options ([1fe7c56](https://github.com/freshworks/crayons/commit/1fe7c568ea32a99c3fa741184dd0c1f87904410e))

## [4.1.0-beta.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.3...@freshworks/crayons@4.1.0-beta.4) (2022-12-12)

### Bug Fixes

- **datepicker:** avoid using non-standard event.path ([#729](https://github.com/freshworks/crayons/issues/729)) ([53a7611](https://github.com/freshworks/crayons/commit/53a76119e881eccb39cb8538ff52b364414ec314))

### Features

- add option label path and option value path for select and list options ([229500e](https://github.com/freshworks/crayons/commit/229500e9caf3dda2046af1aba4a0c3f050911fe8))
- **form-control:** handle formServ field_options object in form control ([a19656e](https://github.com/freshworks/crayons/commit/a19656e9e850fd33e06c7285d6bf081e06360ed0))
- **popover:** introduced new props to facilitate delay in open/close transition in popover component ([7176beb](https://github.com/freshworks/crayons/commit/7176beb6fb441ffbb953107f9da1a20a5849c7df))

### Reverts

- **form:** revert build failure test commit ([477a2f0](https://github.com/freshworks/crayons/commit/477a2f0cf451282093e9c576394b00b2fcbab51e))

## [4.1.0-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.2...@freshworks/crayons@4.1.0-beta.3) (2022-11-19)

### Features

- **file-uploader:** adding reset and get files methods ([#717](https://github.com/freshworks/crayons/issues/717)) ([cad8109](https://github.com/freshworks/crayons/commit/cad810947091de51c5d5c4aaeaf1bfa8cf405407))

## [4.1.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.1...@freshworks/crayons@4.1.0-beta.2) (2022-11-15)

### Bug Fixes

- **component:** existing selection Loop is not working in Vue Project ([#719](https://github.com/freshworks/crayons/issues/719)) ([136296d](https://github.com/freshworks/crayons/commit/136296de656f9e0d0ea1757697bc72fe728d429d))

## [4.1.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.1.0-beta.0...@freshworks/crayons@4.1.0-beta.1) (2022-11-07)

### Bug Fixes

- fix height of avatar variant of multi select ([1d5a3e7](https://github.com/freshworks/crayons/commit/1d5a3e7ee9318b28185cf3d070e29a47ae98eca3))
- **input:** transition only on border ([#713](https://github.com/freshworks/crayons/issues/713)) ([5035d6a](https://github.com/freshworks/crayons/commit/5035d6aaeed528e9d0f238adb2bee19398621b5c))

## [4.1.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.4...@freshworks/crayons@4.1.0-beta.0) (2022-10-19)

### Bug Fixes

- **datepicker:** handle minDate, maxDate when set dynamically ([#705](https://github.com/freshworks/crayons/issues/705)) ([130a7be](https://github.com/freshworks/crayons/commit/130a7be7dda12e8b7e26977b3a7d7dcfae5b2289))

### Features

- add i18n strings for sort-select and datatable ([a9eee87](https://github.com/freshworks/crayons/commit/a9eee871f5c5e6fae52432b64b4ff0edde90f500))

## 4.0.5 (2023-01-25)

### Bug Fixes

- **datepicker:** replace event.path with event.composedPath as it is deprecated from chrome 109 v ([8980943](https://github.com/freshworks/crayons/commit/89809437a31dcc5dc1e33acc6d37d627f5393ad7))

## [4.0.3-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.2...@freshworks/crayons@4.0.3-beta.0) (2022-10-12)

### Bug Fixes

- **tabs:** fix activateTab with tabName ([#703](https://github.com/freshworks/crayons/issues/703)) ([273450a](https://github.com/freshworks/crayons/commit/273450a16b28abae562cb1b64fe6b01764af3569))

## [4.0.2-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.1...@freshworks/crayons@4.0.2-beta.0) (2022-10-12)

### Bug Fixes

- **select-options & list-options:** fixed check box selection highlighter & hide tick mark flag ([#692](https://github.com/freshworks/crayons/issues/692)) ([dc59b9d](https://github.com/freshworks/crayons/commit/dc59b9df2ff981cf988d0813aae977561a2c5f0e))
- **tab:** update styles for focus-visible for tab ([#702](https://github.com/freshworks/crayons/issues/702)) ([e985e91](https://github.com/freshworks/crayons/commit/e985e914e1b5feb8526a349767f3fbf1b06489bc))

## [4.0.1-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0...@freshworks/crayons@4.0.1-beta.0) (2022-10-10)

### Bug Fixes

- **datepicker:** timepicker popup in datetimepicker ([#701](https://github.com/freshworks/crayons/issues/701)) ([6b1f73d](https://github.com/freshworks/crayons/commit/6b1f73d8f3742b4bf93957809e776896f0563e48))

## [4.0.0-beta.14](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.13...@freshworks/crayons@4.0.0-beta.14) (2022-10-06)

### Bug Fixes

- **handle null errors in select and list options:** handle null errors in select and list options ([228953b](https://github.com/freshworks/crayons/commit/228953ba6633e19ed1f4c230a3caf0d2077e7827))
- handle null for options ([aac98ea](https://github.com/freshworks/crayons/commit/aac98ea4c5578f5217620d54fd95dfbfae2c8bc0))
- handle null for select value ([4886165](https://github.com/freshworks/crayons/commit/48861658eedbebead0617441f279533db1ee1752))

## [4.0.0-beta.13](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.12...@freshworks/crayons@4.0.0-beta.13) (2022-10-06)

### Bug Fixes

- **tabs:** handle activate-tab-name property correctly ([#698](https://github.com/freshworks/crayons/issues/698)) ([8dbac02](https://github.com/freshworks/crayons/commit/8dbac02da1d025d4eec83ca34da854bb6a56cb18))

## [4.0.0-beta.12](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.11...@freshworks/crayons@4.0.0-beta.12) (2022-10-04)

### Bug Fixes

- fix border of button variant ([149c4fb](https://github.com/freshworks/crayons/commit/149c4fb6ccddf3b2483e3245b49da5477ce52e29))

## [4.0.0-beta.10](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.9...@freshworks/crayons@4.0.0-beta.10) (2022-09-27)

### Bug Fixes

- cleanup unused state and remove warnings ([2ebc2aa](https://github.com/freshworks/crayons/commit/2ebc2aae8a14865dc41321d3318dff51dfc40015))
- fix popper position when popper content dynamically change ([8b88a07](https://github.com/freshworks/crayons/commit/8b88a075dd15de65ef568bcf58a371af4f46cbba))

### Features

- **data-table:** add target property for nav link custom cell ([#687](https://github.com/freshworks/crayons/issues/687)) ([1a069ab](https://github.com/freshworks/crayons/commit/1a069ab5e0f643963b59e18913ff14cb20348797))

## [4.0.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.8...@freshworks/crayons@4.0.0-beta.9) (2022-09-16)

### Bug Fixes

- default variant for new option ([5c0ce6c](https://github.com/freshworks/crayons/commit/5c0ce6c1c269807a26aeb40c7e792c6c5f315e9f))
- fix click outside method for tag accessibility ([605c4a2](https://github.com/freshworks/crayons/commit/605c4a2f19478ca0eeda6ec68c2f1e6c64f972be))
- fix failing tests ([241099d](https://github.com/freshworks/crayons/commit/241099dada4dc9236a3588cda692ae386be5a2c5))
- fix onClickOutside method for tags ([acd22b2](https://github.com/freshworks/crayons/commit/acd22b24f48d202a228c53acaaeba9913323c98c))
- **tooltip:** text wrapping when in accordion ([#682](https://github.com/freshworks/crayons/issues/682)) ([d4114b7](https://github.com/freshworks/crayons/commit/d4114b784161e9d8cf05498ad54c2dd1b3ebc5fd))

### Features

- add formatCreateLabel as a prop ([b341070](https://github.com/freshworks/crayons/commit/b341070b89686fb0040021f637a6f372f068f065))
- add tests for list options ([1a1c047](https://github.com/freshworks/crayons/commit/1a1c0479984620c239c03042c3f7f14669fef52a))
- add translation strings, Tag modifications, max email restrictions, accesibility features ([a0d7275](https://github.com/freshworks/crayons/commit/a0d7275bb551129e9c16988b27dc39bff6ec7fdb))
- added platform-ui script too docs site ([cdaf7ad](https://github.com/freshworks/crayons/commit/cdaf7adf36c44cc8074f975a33d2aca071923336))
- **email composer:** added Email Header section, Email select component ([64b753a](https://github.com/freshworks/crayons/commit/64b753a61c097e774deb551dfc4e8fa7161f952d))
- **email header component changes:** changes in Tag, avatar and list options ([3dcc67b](https://github.com/freshworks/crayons/commit/3dcc67bf44a5df7e32df534372c85328add8bea2))
- paste and shift key accessibility features ([996fec0](https://github.com/freshworks/crayons/commit/996fec063274427aea3e97e960b772d0d98043cf))
- update docs for select, list options, tag and avatar components ([deb80db](https://github.com/freshworks/crayons/commit/deb80dbcab10b61b632a780bca21853c6c9f70c5))

## [4.0.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.7...@freshworks/crayons@4.0.0-beta.8) (2022-09-09)

### Bug Fixes

- **crayons:** i18n mapping changes and icon circular deps fix and enable autoDefineCustomElements ([#679](https://github.com/freshworks/crayons/issues/679)) ([e66ed1d](https://github.com/freshworks/crayons/commit/e66ed1d432996f4f78eeccd23e302fc619df2569))

## [4.0.0-beta.6](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.5...@freshworks/crayons@4.0.0-beta.6) (2022-09-07)

### Features

- **select:** prevent the options from being clipped in a container with overflow:auto|hidden|scroll ([#675](https://github.com/freshworks/crayons/issues/675)) ([fad4f5d](https://github.com/freshworks/crayons/commit/fad4f5d0ecdf7f19820689799278ed9fced40794))

## [4.0.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.4...@freshworks/crayons@4.0.0-beta.5) (2022-09-02)

### Bug Fixes

- **styles:** style fixes as per Freshworks DSM ([#656](https://github.com/freshworks/crayons/issues/656)) ([f011d45](https://github.com/freshworks/crayons/commit/f011d452cf7e406e000ccafc3822cf98f9a1bffe))

## [4.0.0-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.2...@freshworks/crayons@4.0.0-beta.3) (2022-09-01)

### Bug Fixes

- **textarea:** fix text-area width across browsers by exposing custom css properties ([#672](https://github.com/freshworks/crayons/issues/672)) ([7767ec6](https://github.com/freshworks/crayons/commit/7767ec6ed091c599ed65791a99bdc919388f560f))

### Features

- **hydrate-output-target:** output target to support SSR and upgraded to stencil 2.17 ([#671](https://github.com/freshworks/crayons/issues/671)) ([a422c16](https://github.com/freshworks/crayons/commit/a422c166c026e75fcd3c2664bdb2d9347d2a2cea))

## [4.0.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.1...@freshworks/crayons@4.0.0-beta.2) (2022-08-24)

### Bug Fixes

- **css-variables:** renamed css variables to keep it consistent with LTR and RTL support ([#667](https://github.com/freshworks/crayons/issues/667)) ([9a38511](https://github.com/freshworks/crayons/commit/9a385118ff2868d05891d094e139a9990ad93296))

## [4.0.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@4.0.0-beta.0...@freshworks/crayons@4.0.0-beta.1) (2022-08-23)

### Features

- **custom-objects:** added custom objects to crayons via crayons-extended ([#640](https://github.com/freshworks/crayons/issues/640)) ([b1690d9](https://github.com/freshworks/crayons/commit/b1690d9830930a542a42b27dfa63a33521eb3cc5))

### BREAKING CHANGES

- renamed `--fw-tabs-margin-l` to `--fw-tabs-margin-inline-start` (Left margin if direction is left-to-right, and Right margin if direction is right-to-left for the tab items)
- renamed `--fw-tabs-margin-r` to `--fw-tabs-margin-inline-end` (Right margin if direction is left-to-right, and Left margin if direction is right-to-left for the tab items)
- renamed `--fw-tabs-padding-left` to `--fw-tabs-padding-inline-start` (Left padding if direction is left-to-right, and Right padding if direction is right-to-left for the tab items)
- renamed `--fw-tabs-padding-right` to `--fw-tabs-padding-inline-end` (Right padding if direction is left-to-right, and Left padding if direction is right-to-left for the tab items)

## [4.0.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.6.0-beta.2...@freshworks/crayons@4.0.0-beta.0) (2022-08-23)

### Features

- **fw-datepicker:** added time to single date picker ([#665](https://github.com/freshworks/crayons/issues/665)) ([48ca587](https://github.com/freshworks/crayons/commit/48ca587a74c771efff6980695a2773a9d7071e3f)), closes [#638](https://github.com/freshworks/crayons/issues/638)

### BREAKING CHANGES

- **fw-timepicker:** changed the default value of format from `hh:mm a` to `locale based format`. `min` and `max` time will be based on locale time format

## [3.6.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.6.0-beta.1...@freshworks/crayons@3.6.0-beta.2) (2022-08-19)

### Bug Fixes

- **country-phone:** resetting is breaking on country code select dropdown ([#655](https://github.com/freshworks/crayons/issues/655)) ([5258a3f](https://github.com/freshworks/crayons/commit/5258a3f434c6f7f46d8a4ec3bbfacc8fb3e73d6e))

### Features

- **options-list:** adding prop to allow select ([#660](https://github.com/freshworks/crayons/issues/660)) ([ae98df7](https://github.com/freshworks/crayons/commit/ae98df76e135ecf0cde6005f41e517874e4ba0a8))

## [3.6.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.6.0-beta.0...@freshworks/crayons@3.6.0-beta.1) (2022-08-10)

### Bug Fixes

- **button:** handle onClick on disabled ([#653](https://github.com/freshworks/crayons/issues/653)) ([46b1dd2](https://github.com/freshworks/crayons/commit/46b1dd220a33819bb740140b5c2f1194156ed1ed))

### Features

- **component:** international phone number component ([#631](https://github.com/freshworks/crayons/issues/631)) ([14ffa61](https://github.com/freshworks/crayons/commit/14ffa61ea884652f242d98d408aeb600f91d00de))

## [3.6.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.5.0...@freshworks/crayons@3.6.0-beta.0) (2022-08-01)

### Bug Fixes

- **checkbox-style-fix:** checkbox vertical align style fix ([#643](https://github.com/freshworks/crayons/issues/643)) ([796e913](https://github.com/freshworks/crayons/commit/796e9130a66383c3b96ed047a7ab55c30f791139))
- **checkbox:** align check icon within checkbox ([#633](https://github.com/freshworks/crayons/issues/633)) ([aaebdcc](https://github.com/freshworks/crayons/commit/aaebdcce0ca5b7a29b6c2bdb2a00ab1b2007cf77))
- **datepicker:** emit ISO formatted string ([#650](https://github.com/freshworks/crayons/issues/650)) ([374891d](https://github.com/freshworks/crayons/commit/374891d5065a11f8d65727b2feb3d1f25d3360d8))
- **datepicker:** handle min date, max date ([#651](https://github.com/freshworks/crayons/issues/651)) ([8e15b2b](https://github.com/freshworks/crayons/commit/8e15b2bfb609033dfd6a9dc65d95e6bda18a85a6))
- **rtl:** fixing popovers placement when direction is rtl ([#627](https://github.com/freshworks/crayons/issues/627)) ([21cc60d](https://github.com/freshworks/crayons/commit/21cc60d6d633b649549ddf718613c54ba029e5b9))

### Features

- **fw-form:** Add a method to get form values and emit an event on value change ([#645](https://github.com/freshworks/crayons/issues/645)) ([8d1ca23](https://github.com/freshworks/crayons/commit/8d1ca23e0d0adbfb7aadac82b221716e76a22715))
- **rtl:** add linter for css physical properties ([571487b](https://github.com/freshworks/crayons/commit/571487bdb551483977efc19f44f09e6a271de917))
- **rtl:** fix review comments ([4899955](https://github.com/freshworks/crayons/commit/4899955d4d73075d14d1becd53f32f53684ef848))
- **rtl:** Initial RTL implementation with logical components and RTLCSS ([#621](https://github.com/freshworks/crayons/issues/621)) ([1d0efb5](https://github.com/freshworks/crayons/commit/1d0efb51e1138cf59db6a016694842ff97b7bc08))
- **rtl:** update mixins with logical properties ([14e9776](https://github.com/freshworks/crayons/commit/14e977613d530d018771ce30e46dc41d8c2d77c5))

## [3.5.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.5.0-beta.1...@freshworks/crayons@3.5.0-beta.2) (2022-05-31)

### Bug Fixes

- **datepicker:** fix setMonth for last dates ([#615](https://github.com/freshworks/crayons/issues/615)) ([1e0bd27](https://github.com/freshworks/crayons/commit/1e0bd272fd145476c5ed612e27430b4c3a5e49de))
- **fw-select:** prevented the css break ([#610](https://github.com/freshworks/crayons/issues/610)) ([1d5efa7](https://github.com/freshworks/crayons/commit/1d5efa740677fc4ba70a8eb59be8736b0112b5b1))
- **fw-timepicker:** fixed the documentation examples and improper loop ([#609](https://github.com/freshworks/crayons/issues/609)) ([2cc2c3e](https://github.com/freshworks/crayons/commit/2cc2c3e348b4fe12450f5ba5af57901ed214ef5f))

### Features

- **fw-timepicker:** added placement option for the dropdown ([#611](https://github.com/freshworks/crayons/issues/611)) ([aa93100](https://github.com/freshworks/crayons/commit/aa9310062b82d081cc08c7ec8c06cf759ba205e3))

## [3.5.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.5.0-beta.0...@freshworks/crayons@3.5.0-beta.1) (2022-05-24)

### Bug Fixes

- **data-table:** separating isLoading and showShimmer functionality ([#604](https://github.com/freshworks/crayons/issues/604)) ([caf90b1](https://github.com/freshworks/crayons/commit/caf90b1be2324f49f8d9425fdd5d1cb8a1cf1f75))
- **datepicker:** handle min and max dates when passed ([#605](https://github.com/freshworks/crayons/issues/605)) ([e3278b4](https://github.com/freshworks/crayons/commit/e3278b45841609afb7b1a64de2a4d41831c300c4))
- **fw-pill:** update component style on changing color prop ([#598](https://github.com/freshworks/crayons/issues/598)) ([6034ead](https://github.com/freshworks/crayons/commit/6034eadb11a8df8de734db4d5de743d48fe039fd))
- **radio-group:** a11y changes for radio-group ([#597](https://github.com/freshworks/crayons/issues/597)) ([e7a6137](https://github.com/freshworks/crayons/commit/e7a61370c6566d5cb98c6b99160d773cd0d0b76f))
- **tabs:** fix handling index ([#601](https://github.com/freshworks/crayons/issues/601)) ([ad81e83](https://github.com/freshworks/crayons/commit/ad81e83b31cb86810ea14f0c6aa1a9dfd10d85cc))

### Features

- **data-table:** custom template for table headers ([#593](https://github.com/freshworks/crayons/issues/593)) ([7113283](https://github.com/freshworks/crayons/commit/7113283b411d51f5ea8e2c58dac11d740866f6b2))

## [3.5.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.4.2...@freshworks/crayons@3.5.0-beta.0) (2022-05-10)

### Features

- **datepicker:** allow single date to be selected for date range picker ([#584](https://github.com/freshworks/crayons/issues/584)) ([ed9b8e4](https://github.com/freshworks/crayons/commit/ed9b8e4c2bc54fd92162217658d1af492927f25f))

## [3.4.2-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.4.1...@freshworks/crayons@3.4.2-beta.0) (2022-05-03)

### Bug Fixes

- **fw-select:** prevented the mutation of option ([#582](https://github.com/freshworks/crayons/issues/582)) ([6f7d489](https://github.com/freshworks/crayons/commit/6f7d48928d64b2b9daf14ec93a8e35f76c5ce075))

## [3.4.1-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.4.0...@freshworks/crayons@3.4.1-beta.0) (2022-05-03)

### Bug Fixes

- **fw-select:** prevent dual trigger of onOptionsChange method ([#581](https://github.com/freshworks/crayons/issues/581)) ([e4957d8](https://github.com/freshworks/crayons/commit/e4957d84b7d298449312a15ff7566ea5f5c51314))

## [3.4.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.4.0-beta.0...@freshworks/crayons@3.4.0-beta.1) (2022-05-02)

### Bug Fixes

- **form-control:** remove hard-coded readonly property for date-picker ([#579](https://github.com/freshworks/crayons/issues/579)) ([5b42d7a](https://github.com/freshworks/crayons/commit/5b42d7a6e0ba06bd5a6d660ae15b9a767f58d682))

## [3.4.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0...@freshworks/crayons@3.4.0-beta.0) (2022-04-27)

### Features

- **fw-select:** added provision to add/update the options dynamically ([#575](https://github.com/freshworks/crayons/issues/575)) ([eae58a0](https://github.com/freshworks/crayons/commit/eae58a08a52140dfb999a08685bf729d25e5916b))

## [3.3.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.7...@freshworks/crayons@3.3.0-beta.8) (2022-04-25)

### Bug Fixes

- **data-table:** adding key to table row to avoid rendering issues ([#572](https://github.com/freshworks/crayons/issues/572)) ([1ab3cdb](https://github.com/freshworks/crayons/commit/1ab3cdb70534059bc197e086726e771e3657a3c8))
- **tooltip:** ability to hover over tooltip content ([#570](https://github.com/freshworks/crayons/issues/570)) ([d8bba48](https://github.com/freshworks/crayons/commit/d8bba48466f640c360589ede599745ed83e4f699))

## [3.3.0-beta.7](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.6...@freshworks/crayons@3.3.0-beta.7) (2022-04-20)

### Bug Fixes

- **data-table:** adding showmore/showless to paragraph variant ([#569](https://github.com/freshworks/crayons/issues/569)) ([8450de8](https://github.com/freshworks/crayons/commit/8450de87c33094db793600e27435f5ba2c60db48))
- **modal:** adding accessibility events when adding modal with isOpen… ([#563](https://github.com/freshworks/crayons/issues/563)) ([3d95a80](https://github.com/freshworks/crayons/commit/3d95a80f90b62726c1d5e37e7eb5a34ccd385761))
- **select:** select input font inherits from parent ([#567](https://github.com/freshworks/crayons/issues/567)) ([098a5d6](https://github.com/freshworks/crayons/commit/098a5d6509dcf1d8d4d78e206c77d2ceaa13ea4e))

## [3.3.0-beta.6](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.5...@freshworks/crayons@3.3.0-beta.6) (2022-04-15)

### Bug Fixes

- **avatar-fix:** DSM style fixes for intials with different modes ([#561](https://github.com/freshworks/crayons/issues/561)) ([fe79001](https://github.com/freshworks/crayons/commit/fe79001abd9affdc5e032bff87188f011c5a76bc))
- **serialize-form:** handle null for date field ([#564](https://github.com/freshworks/crayons/issues/564)) ([4f22610](https://github.com/freshworks/crayons/commit/4f226104552aa699a1e12c40e13a01d790491a09))

## [3.3.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.4...@freshworks/crayons@3.3.0-beta.5) (2022-04-13)

### Bug Fixes

- **datepicker:** handle datepicker input clear ([#560](https://github.com/freshworks/crayons/issues/560)) ([10e95ab](https://github.com/freshworks/crayons/commit/10e95abae5d2ea03c4f11404b504a6ec87e83430))

## [3.3.0-beta.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.3...@freshworks/crayons@3.3.0-beta.4) (2022-04-11)

### Bug Fixes

- **fw-select:** added bigint data type support ([#551](https://github.com/freshworks/crayons/issues/551)) ([949ea40](https://github.com/freshworks/crayons/commit/949ea40370bd89327bbe3ea1c6c26f2eca65035a))
- **fw-select:** fixed the serialize issue on bigint datatype ([#550](https://github.com/freshworks/crayons/issues/550)) ([628e0a7](https://github.com/freshworks/crayons/commit/628e0a7173735c80198ddc102a95df32caee60b9))
- **modal:** adding overflow-wrap and break word properties for longer text ([#555](https://github.com/freshworks/crayons/issues/555)) ([c9f5662](https://github.com/freshworks/crayons/commit/c9f566271889132c4a38afc56a4d190c30dad012))

## [3.3.0-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.2...@freshworks/crayons@3.3.0-beta.3) (2022-04-07)

### Bug Fixes

- **file-uploader:** font weight on remove link on files list updated ([#549](https://github.com/freshworks/crayons/issues/549)) ([b3b7b3a](https://github.com/freshworks/crayons/commit/b3b7b3ad3ead43a1cbb3039abbf6599a897e4679))

## [3.3.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.1...@freshworks/crayons@3.3.0-beta.2) (2022-04-07)

### Bug Fixes

- **toast:** breaking longer word to fit into the toast container ([#547](https://github.com/freshworks/crayons/issues/547)) ([752cbf1](https://github.com/freshworks/crayons/commit/752cbf139a80bc0ab6ec4f02ef6033a018e7ee50))

## [3.3.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.3.0-beta.0...@freshworks/crayons@3.3.0-beta.1) (2022-04-05)

### Features

- **data-table:** retaining width for select column ([#546](https://github.com/freshworks/crayons/issues/546)) ([7bac939](https://github.com/freshworks/crayons/commit/7bac939742f7fc322126d2cf1d3c5048282f12e0))

## [3.3.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.2.2-beta.3...@freshworks/crayons@3.3.0-beta.0) (2022-04-05)

### Features

- **datepicker:** expose public method to clear input ([#543](https://github.com/freshworks/crayons/issues/543)) ([4146b74](https://github.com/freshworks/crayons/commit/4146b7445138082ef504015ad45672621e83beba))

## [3.2.2-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.2.2-beta.2...@freshworks/crayons@3.2.2-beta.3) (2022-04-01)

### Bug Fixes

- **data-table:** wrapping text in column when single word is big ([#542](https://github.com/freshworks/crayons/issues/542)) ([cae602d](https://github.com/freshworks/crayons/commit/cae602de66f7666aa95305266496583b081ef0f2))

## [3.2.2-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.2.2-beta.1...@freshworks/crayons@3.2.2-beta.2) (2022-04-01)

### Bug Fixes

- **data-table:** removing extra space from last rowActions button ([#541](https://github.com/freshworks/crayons/issues/541)) ([16ebcf4](https://github.com/freshworks/crayons/commit/16ebcf410047a62803b0d7adcc28a9fb824626eb))

## [3.2.2-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.2.2-beta.0...@freshworks/crayons@3.2.2-beta.1) (2022-03-31)

### Bug Fixes

- **fw-button:** added disabled border for secondary button ([#539](https://github.com/freshworks/crayons/issues/539)) ([d0154bf](https://github.com/freshworks/crayons/commit/d0154bf1cdaacdaaefd28796b2e781bb006f8464))

## [3.2.2-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.2.1...@freshworks/crayons@3.2.2-beta.0) (2022-03-31)

### Bug Fixes

- **checkbox:** handle checkbox label alignment if spanned multiple lines ([#523](https://github.com/freshworks/crayons/issues/523)) ([2d41325](https://github.com/freshworks/crayons/commit/2d413258758816301494876de02989040cf2cda3))
- **data-table:** checkbox hover style visible in table settings ([#526](https://github.com/freshworks/crayons/issues/526)) ([f02917a](https://github.com/freshworks/crayons/commit/f02917a6cec0537627975ce78981e20dff0bc4cb))
- **node16-support:** adding support for node 16 ([#538](https://github.com/freshworks/crayons/issues/538)) ([c60ed88](https://github.com/freshworks/crayons/commit/c60ed88fc8e549c34146ce34b0d08e6bac38a43c))

## [3.2.1-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.2.0...@freshworks/crayons@3.2.1-beta.0) (2022-03-30)

### Bug Fixes

- **data-table:** removing popper instance once table is removed from dom ([#536](https://github.com/freshworks/crayons/issues/536)) ([bbcfbff](https://github.com/freshworks/crayons/commit/bbcfbff35dfcfb4a9f7edb917eb0bbacfec02d14))

## [3.2.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.1.2...@freshworks/crayons@3.2.0-beta.0) (2022-03-30)

### Bug Fixes

- **data-table:** checkbox breaking word for overflowing text ([#512](https://github.com/freshworks/crayons/issues/512)) ([276305c](https://github.com/freshworks/crayons/commit/276305ca4a290caeeee552209e0350cd65a9d38e))
- **datepicker:** emit fwchange on clearing input ([#522](https://github.com/freshworks/crayons/issues/522)) ([834805a](https://github.com/freshworks/crayons/commit/834805a3f382bbcd65cd2aecc9cb75a446abd25c))
- **datepicker:** set placeholder for datepicker based on locale ([f8a7c61](https://github.com/freshworks/crayons/commit/f8a7c619263f336ffd54d85ccfe99cf568e995ee))
- **fw-select:** handled the empty text scenario in dynamic select ([#508](https://github.com/freshworks/crayons/issues/508)) ([421cdb3](https://github.com/freshworks/crayons/commit/421cdb389dce86a8484754ae340c7d57763e65ce))
- **fw-select:** popup position changes for clippingParents ([#515](https://github.com/freshworks/crayons/issues/515)) ([b86bcb6](https://github.com/freshworks/crayons/commit/b86bcb6bc686fb6aec11d213c97cdc619d5c7335))

### Features

- **datepicker:** adding new variants to datepicker component ([#502](https://github.com/freshworks/crayons/issues/502)) ([9b170d8](https://github.com/freshworks/crayons/commit/9b170d8e26ff61229bb06dfd5979861a1d62f57b))
- **fw-accordion-header:** added prop for different icon size ([#518](https://github.com/freshworks/crayons/issues/518)) ([5e211b2](https://github.com/freshworks/crayons/commit/5e211b27361e38caaad8eb86f4e6fd58eeacaaea))
- **fw-select:** clear single select by clearing input ([#520](https://github.com/freshworks/crayons/issues/520)) ([d8d359b](https://github.com/freshworks/crayons/commit/d8d359b1c67f3b0b5f10d6afc8c8c8e8abc6d96e))

## [3.1.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.1.0-beta.0...@freshworks/crayons@3.1.0-beta.1) (2022-03-29)

### Bug Fixes

- **datepicker:** emit fwchange on clearing input ([#522](https://github.com/freshworks/crayons/issues/522)) ([834805a](https://github.com/freshworks/crayons/commit/834805a3f382bbcd65cd2aecc9cb75a446abd25c))
- **datepicker:** set placeholder for datepicker based on locale ([f8a7c61](https://github.com/freshworks/crayons/commit/f8a7c619263f336ffd54d85ccfe99cf568e995ee))

## [3.1.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.1...@freshworks/crayons@3.1.0-beta.0) (2022-03-29)

### Bug Fixes

- **fw-select:** handled the empty text scenario in dynamic select ([#508](https://github.com/freshworks/crayons/issues/508)) ([421cdb3](https://github.com/freshworks/crayons/commit/421cdb389dce86a8484754ae340c7d57763e65ce))
- **fw-select:** popup position changes for clippingParents ([#515](https://github.com/freshworks/crayons/issues/515)) ([b86bcb6](https://github.com/freshworks/crayons/commit/b86bcb6bc686fb6aec11d213c97cdc619d5c7335))

### Features

=======

> > > > > > > dd4be00 (chore(release): update lock file and clean up changelogs)

- **datepicker:** adding new variants to datepicker component ([#502](https://github.com/freshworks/crayons/issues/502)) ([9b170d8](https://github.com/freshworks/crayons/commit/9b170d8e26ff61229bb06dfd5979861a1d62f57b))
- **fw-accordion-header:** added prop for different icon size ([#518](https://github.com/freshworks/crayons/issues/518)) ([5e211b2](https://github.com/freshworks/crayons/commit/5e211b27361e38caaad8eb86f4e6fd58eeacaaea))
- **fw-select:** clear single select by clearing input ([#520](https://github.com/freshworks/crayons/issues/520)) ([d8d359b](https://github.com/freshworks/crayons/commit/d8d359b1c67f3b0b5f10d6afc8c8c8e8abc6d96e))

## [3.0.1-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0...@freshworks/crayons@3.0.1-beta.0) (2022-03-24)

### Bug Fixes

=======

### Bug Fixes

> > > > > > > e317c66 (chore(release): update lock file and clean up changelogs)

- **data-table:** checkbox breaking word for overflowing text ([#512](https://github.com/freshworks/crayons/issues/512)) ([276305c](https://github.com/freshworks/crayons/commit/276305ca4a290caeeee552209e0350cd65a9d38e))

## [3.0.0-beta.44](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.43...@freshworks/crayons@3.0.0-beta.44) (2022-03-23)

### Bug Fixes

- **input:** remove redundant check ([#505](https://github.com/freshworks/crayons/issues/505)) ([b2abea9](https://github.com/freshworks/crayons/commit/b2abea9a6e55cea00f339106993a5a9f6e629080))

## [3.0.0-beta.43](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.42...@freshworks/crayons@3.0.0-beta.43) (2022-03-22)

### Bug Fixes

- **textarea:** updated styling for placeholder in textarea ([f993670](https://github.com/freshworks/crayons/commit/f9936704bc98a2be38f4a1476faf4a10f7a01828))

## [3.0.0-beta.42](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.41...@freshworks/crayons@3.0.0-beta.42) (2022-03-22)

### Bug Fixes

- **fb-coui:** Style fixes, i18n interpolate strings for form builder, added resize property for text area component ([#498](https://github.com/freshworks/crayons/issues/498)) ([6a47ea1](https://github.com/freshworks/crayons/commit/6a47ea14b329d266d1ce794d8f9067322ff85e53))
- **fw-select:** prevents the dropdown from opening on removing tag in multi-select ([#497](https://github.com/freshworks/crayons/issues/497)) ([8c7989b](https://github.com/freshworks/crayons/commit/8c7989bfedb9b1d7093e2135120704a0d582ed42))
- **modal:** hideFooter prop working for custom footer ([#495](https://github.com/freshworks/crayons/issues/495)) ([e39a14f](https://github.com/freshworks/crayons/commit/e39a14fa3c1ff5ea145123551f725dbb21f2c7e5))

## [3.0.0-beta.38](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.37...@freshworks/crayons@3.0.0-beta.38) (2022-03-21)

### Bug Fixes

- **datepicker:** make div inline-flex to occupy only width of contents ([#488](https://github.com/freshworks/crayons/issues/488)) ([9c7b289](https://github.com/freshworks/crayons/commit/9c7b2897c33efe093c734c9b3023588a7b9dba3c))
- **fw-form:** handle blur validation for form and fix selected year for datepicker ([#489](https://github.com/freshworks/crayons/issues/489)) ([d494f38](https://github.com/freshworks/crayons/commit/d494f3854a26b06e4c18a4a544d4b9778fe81ac2))

## [3.0.0-beta.35](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.34...@freshworks/crayons@3.0.0-beta.35) (2022-03-17)

### Bug Fixes

- **data-table:** table settings input clearing on closing modal ([#486](https://github.com/freshworks/crayons/issues/486)) ([c17f10f](https://github.com/freshworks/crayons/commit/c17f10f4c408a692c985933a25dcb2cea7524cec))

## [3.0.0-beta.34](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.33...@freshworks/crayons@3.0.0-beta.34) (2022-03-16)

### Bug Fixes

- **datepicker-i18n:** handle placeholder and displayformat on lang change ([#484](https://github.com/freshworks/crayons/issues/484)) ([36e7015](https://github.com/freshworks/crayons/commit/36e70159844ea6f85ae0a268a18f9f847fd056e9))
- **fw-select:** disabled select activation via space button ([#482](https://github.com/freshworks/crayons/issues/482)) ([3dacdec](https://github.com/freshworks/crayons/commit/3dacdec5fdbf7cfa940716f7045b95710e50bc10))

### Features

- **data-table:** Custom cell Paragraph variant added ([#473](https://github.com/freshworks/crayons/issues/473)) ([182a49e](https://github.com/freshworks/crayons/commit/182a49ef09db783fa48ddbca02e0070e0da5c987))

### BREAKING CHANGES

- **fw-select:** Disabled fw-select activation/open via space button

- docs(fw-select): added select breaking changes

## [3.0.0-beta.32](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.31...@freshworks/crayons@3.0.0-beta.32) (2022-03-15)

### Bug Fixes

- **form-control:** i18n changes for form-control error texts ([02696fc](https://github.com/freshworks/crayons/commit/02696fc88329acff0e1decb51ad31f3348c71175))

### Features

- **dropdown-button:** removed dropdown-button and added example in popover ([#476](https://github.com/freshworks/crayons/issues/476)) ([d3b22ae](https://github.com/freshworks/crayons/commit/d3b22aecec278c936760087718067b40ab7dab70))

### BREAKING CHANGES

- **dropdown-button:** Depreciating the fw-dropdown-button component

## [3.0.0-beta.30](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.29...@freshworks/crayons@3.0.0-beta.30) (2022-03-14)

### Features

- **datepicker:** adding support for handling multiple locales ([#466](https://github.com/freshworks/crayons/issues/466)) ([ad27bfc](https://github.com/freshworks/crayons/commit/ad27bfc3f3596e4d51277f56ca7a30734bd4b1a1))
- **i18n-date-fns:** dynamically load date-fns lang module and interpolation related changes ([#465](https://github.com/freshworks/crayons/issues/465)) ([9510fe7](https://github.com/freshworks/crayons/commit/9510fe71d1ab0cd5ef4d5dd4f33cfdd2e6cb200e))

## [3.0.0-beta.29](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.28...@freshworks/crayons@3.0.0-beta.29) (2022-03-12)

### Bug Fixes

- **label-styling:** fix label styling as per DSM ([#474](https://github.com/freshworks/crayons/issues/474)) ([b412ede](https://github.com/freshworks/crayons/commit/b412ede40ba4be19ed417c173e874057a7bce7df))

## [3.0.0-beta.28](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.27...@freshworks/crayons@3.0.0-beta.28) (2022-03-10)

### Bug Fixes

- **datepicker:** fix placeholder for popover trigger ([#469](https://github.com/freshworks/crayons/issues/469)) ([c166384](https://github.com/freshworks/crayons/commit/c1663843e022eb37c5624f89a1d86ca6d0e761b2))

### Features

- **data-table:** adding a column lock configuration to data table ([#454](https://github.com/freshworks/crayons/issues/454)) ([9a1545a](https://github.com/freshworks/crayons/commit/9a1545aa2dc8098649f5970ed95651d1a9269b0c))
- **data-table:** adding src prop to custom-cell-icon ([#470](https://github.com/freshworks/crayons/issues/470)) ([58d2cfa](https://github.com/freshworks/crayons/commit/58d2cfab2f3dd1dc35477b50145380bc2f5ba7f6))

## [3.0.0-beta.27](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.26...@freshworks/crayons@3.0.0-beta.27) (2022-03-09)

### Features

- **i18n:** use json instead of js files ([#468](https://github.com/freshworks/crayons/issues/468)) ([bafe409](https://github.com/freshworks/crayons/commit/bafe409b4333f28581d172de183d38ed896f0ff1))

## [3.0.0-beta.26](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.25...@freshworks/crayons@3.0.0-beta.26) (2022-03-09)

### Bug Fixes

- **modal:** display modal-title only when there is a title-text ([#464](https://github.com/freshworks/crayons/issues/464)) ([8f09641](https://github.com/freshworks/crayons/commit/8f096410b090da37f2099a5a792d034bdf64555e))
- **select-state-text:** remove stateText prop from select and use fieldcontrol ([#467](https://github.com/freshworks/crayons/issues/467)) ([f7b0380](https://github.com/freshworks/crayons/commit/f7b0380afd548fd4d5f1239685dbb43b4db8476d))

### Features

- **file-uploader:** adding file-uploader component ([#444](https://github.com/freshworks/crayons/issues/444)) ([0ac218c](https://github.com/freshworks/crayons/commit/0ac218c5da73c61714d9d4d3233e4bf927a01c3c))
- **input-state-text:** Added `hint-text` `warning-text` `error-text` props and slots and removed `state-text` prop ([#436](https://github.com/freshworks/crayons/issues/436)) ([4841237](https://github.com/freshworks/crayons/commit/4841237ecc907f13460a6832b8ff7385d05d0729))

### BREAKING CHANGES

1. `stateText` prop has been removed from `fw-input`, `fw-textarea`, `fw-select`.

2. `label` prop in `fw-radio-group` will not only be used for screen readers, passing this prop will also show a label on top of radio-group. If the label is not required to be shown, avoid passing `label` prop. The screen readers will instead use `name` prop if passed.

## [3.0.0-beta.25](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.24...@freshworks/crayons@3.0.0-beta.25) (2022-03-08)

### Features

- **i18n:** remove default value being passed to decorator ([#462](https://github.com/freshworks/crayons/issues/462)) ([dba8601](https://github.com/freshworks/crayons/commit/dba86010a83676c5a73753600656a5f04702d38f))

## [3.0.0-beta.24](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.23...@freshworks/crayons@3.0.0-beta.24) (2022-03-07)

### Features

- **css-variables:** Namespace css variables ([#441](https://github.com/freshworks/crayons/issues/441)) ([4d4a910](https://github.com/freshworks/crayons/commit/4d4a9103825f6a015f6b61afbc9d4446dec11c83))
- **timepicker:** replace moment-mini with date-fns ([#459](https://github.com/freshworks/crayons/issues/459)) ([d668420](https://github.com/freshworks/crayons/commit/d668420a5ff90e41a0b1c4ef0a2c3f6602ef41dc))

### BREAKING CHANGES

All the css variables are prefixed with `--fw-[component_name]`

## [3.0.0-beta.19](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.18...@freshworks/crayons@3.0.0-beta.19) (2022-03-04)

### Features

- **crayons-i18n:** crayons-i18n package to handle i18n translations ([#449](https://github.com/freshworks/crayons/issues/449)) ([74d0e5b](https://github.com/freshworks/crayons/commit/74d0e5b2c95ef6571e47b5cf140008995332f5b4))
- **datepicker:** replacing moment-mini with date-fns to handle locale support ([#452](https://github.com/freshworks/crayons/issues/452)) ([306c432](https://github.com/freshworks/crayons/commit/306c432e376a290ee0707a0de973c1b997b605b0))

## [3.0.0-beta.18](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.17...@freshworks/crayons@3.0.0-beta.18) (2022-03-03)

### Bug Fixes

- **data-table:** adding localStorage permissions check before using it ([#453](https://github.com/freshworks/crayons/issues/453)) ([0bcdb40](https://github.com/freshworks/crayons/commit/0bcdb402d71a76deba8e81e6c7f2a139347f09bd))
- **data-table:** fw-tooltip on hovering over data-table row action buttons ([#447](https://github.com/freshworks/crayons/issues/447)) ([7e00fd6](https://github.com/freshworks/crayons/commit/7e00fd6012d38a34dbdf355db63ec1c4f1500c43))
- **fw-select-option, fw-textarea:** fixed the styles ([#450](https://github.com/freshworks/crayons/issues/450)) ([ab3a5a4](https://github.com/freshworks/crayons/commit/ab3a5a40f31048b5db58aacc23c8f5a5e43d51ba))
- **fw-select:** Modified the color of the state text based on the state ([#446](https://github.com/freshworks/crayons/issues/446)) ([642e028](https://github.com/freshworks/crayons/commit/642e028714f27319b8585d79bd8ea66b84785295))
- standardized height of all input elements to 32px ([#451](https://github.com/freshworks/crayons/issues/451)) ([e123470](https://github.com/freshworks/crayons/commit/e123470070d4052bc5d7bf94fd1f6fcf9341e89f))

### Features

- **fw-datepicker:** added stateText prop to the datepicker ([#448](https://github.com/freshworks/crayons/issues/448)) ([819b59b](https://github.com/freshworks/crayons/commit/819b59b771d9986d3c9f1dd8c92ca1b5c0b56e1d))

## [3.0.0-beta.17](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.16...@freshworks/crayons@3.0.0-beta.17) (2022-02-28)

### Bug Fixes

- **data-table:** adding cell variants as dependency to data-table ([#443](https://github.com/freshworks/crayons/issues/443)) ([25dc39d](https://github.com/freshworks/crayons/commit/25dc39d99f0f9e7e71284368799f2e54679970e0))
- **fw-datepicker:** handle cancel and popover hide usecase and added readonly prop ([#440](https://github.com/freshworks/crayons/issues/440)) ([8ec4011](https://github.com/freshworks/crayons/commit/8ec40115385f2021a62a1942ef2a913949119f51))

## [3.0.0-beta.16](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.15...@freshworks/crayons@3.0.0-beta.16) (2022-02-24)

### Bug Fixes

- **datepicker:** fix blur event emit and trigger for show datepicker popup ([#437](https://github.com/freshworks/crayons/issues/437)) ([b1254ed](https://github.com/freshworks/crayons/commit/b1254ed581970358af28b646d08196244b012121))
- **popover:** make overlay height to 100% of parent height not 100vh,use allowDeselect in datepicker ([#438](https://github.com/freshworks/crayons/issues/438)) ([5773c95](https://github.com/freshworks/crayons/commit/5773c9543cd46c0cff903311d057193d32eba4f4))

## [3.0.0-beta.15](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.14...@freshworks/crayons@3.0.0-beta.15) (2022-02-22)

### Bug Fixes

- **data-table:** fix for table setting moving on horizontal scroll ([#427](https://github.com/freshworks/crayons/issues/427)) ([d569801](https://github.com/freshworks/crayons/commit/d569801cf2fe14c15e17366243603bfb48d34420))
- **data-table:** isloading as mutable property ([#420](https://github.com/freshworks/crayons/issues/420)) ([2ef8029](https://github.com/freshworks/crayons/commit/2ef8029498e4d597ce65c3803b9527dab5623bd5))
- **datepicker:** fix datepicker behaviour after event standardisation ([#431](https://github.com/freshworks/crayons/issues/431)) ([d74a235](https://github.com/freshworks/crayons/commit/d74a23542a102940bd0628ab4eaa5365ba040bbb))
- **event-changes:** updated the components to follow event standards ([#433](https://github.com/freshworks/crayons/issues/433)) ([b783d7c](https://github.com/freshworks/crayons/commit/b783d7c1d230ea2425e37251cc71b6c933b9523b))
- **fw-drag-container:** fixed the drag issue in safari ([#403](https://github.com/freshworks/crayons/issues/403)) ([154b51f](https://github.com/freshworks/crayons/commit/154b51fd9decf0699343c98ae6c56a03a8b212b0))
- **fw-drag-container:** fixed the insertElement issue on Drop ([#435](https://github.com/freshworks/crayons/issues/435)) ([a08ed51](https://github.com/freshworks/crayons/commit/a08ed51d0a306027335f3cd9002141300c787e56))
- **fw-input:** fix fw-input cursor resetting on typing `.` for decimal input ([#434](https://github.com/freshworks/crayons/issues/434)) ([4a915de](https://github.com/freshworks/crayons/commit/4a915de37c4351efb80e7b7be29d8afa054f8bfa))
- **fw-input:** fixed the flex-flow bug when width is <= 200px ([#417](https://github.com/freshworks/crayons/issues/417)) ([db45160](https://github.com/freshworks/crayons/commit/db451606ae449d0ce5b94fc1dc2e2a8cf34aa72f))
- **fw-input:** fixed the hint/error text padding ([#428](https://github.com/freshworks/crayons/issues/428)) ([e2ddce5](https://github.com/freshworks/crayons/commit/e2ddce569c9aaaefbac9ea4e3dca9e44f7a392cd))
- **tooltip:** updating tooltip radius, modal close button styling ([#424](https://github.com/freshworks/crayons/issues/424)) ([a39405a](https://github.com/freshworks/crayons/commit/a39405a0ca33544bcfd46f33798879065631ccc7))

### Features

- **data-table:** adding style to the loading state of table ([#418](https://github.com/freshworks/crayons/issues/418)) ([febb9f2](https://github.com/freshworks/crayons/commit/febb9f2743a7c8120dbade2ff9aeaf279d4f7094))
- **data-table:** showing shimmer on initial table load ([#422](https://github.com/freshworks/crayons/issues/422)) ([d2d7ff4](https://github.com/freshworks/crayons/commit/d2d7ff4a2e417f7bce8b5ac1a40b592d9b6cdcf5))
- **event-standardisation:** Event Standardisation of input controls ([#423](https://github.com/freshworks/crayons/issues/423)) ([a04e7c3](https://github.com/freshworks/crayons/commit/a04e7c3a9d08ec9c8f752a006f82cb8c3f7968fd))
- **list-options:** applying event standardisation for list-options as well ([#432](https://github.com/freshworks/crayons/issues/432)) ([a8e1d7e](https://github.com/freshworks/crayons/commit/a8e1d7ec840a8905999cff2d5f9a0cbd71323ee2))

### BREAKING CHANGES

`fw-input`: `fwChange` event will no longer be emitted on changing value programatically.
`fw-textarea`: `fwChange` event will no longer be emitted on changing value programatically.
`fw-radio-group`: `fwChange` event will no longer be emitted on changing value programatically.
`fw-checkbox`: `checked` field will be a part of `meta` field in the event detail for `fwChange`. Now it can be accessed using `event.detail.meta.checked` instead of `event.detail.checked`.
`fw-select` : `selectedOptions` field will be a part of `meta` field in the event detail for `fwChange`. Now it can be accessed using `event.detail.meta.selectedOptions` instead of `event.detail.selectedOptions`.
`fw-list-options` : `selectedOptions` field will now be part of meta field in the event detail for `fwChange`. Now it can be accessed using `event.detail.meta.selectedOptions` instead of `event.detail.selectedOptions`

## [3.0.0-beta.14](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.13...@freshworks/crayons@3.0.0-beta.14) (2022-02-10)

### Bug Fixes

- **checkbox:** fix checkbox disabled state color ([#409](https://github.com/freshworks/crayons/issues/409)) ([83119dc](https://github.com/freshworks/crayons/commit/83119dcacba9035146ee6f83147876f653a0e674))
- **checkbox:** fix cursor style for disabled state ([#412](https://github.com/freshworks/crayons/issues/412)) ([16391c5](https://github.com/freshworks/crayons/commit/16391c57f1a92d1a8d97d569ef92fbb74ed076eb))
- **fw-input:** fixed the transparent background color of input ([#410](https://github.com/freshworks/crayons/issues/410)) ([cc04ec0](https://github.com/freshworks/crayons/commit/cc04ec0374a7164dd60cc335d2bd4469dd8f0585))
- **modal:** modal description line height reduced to support multiline ([#413](https://github.com/freshworks/crayons/issues/413)) ([d25e74e](https://github.com/freshworks/crayons/commit/d25e74e03bf68f0c65db45a863e2f088b7bab64e))

### Features

- **checkbox:** adding pointer cursor for checkbox container ([#411](https://github.com/freshworks/crayons/issues/411)) ([e9df0a5](https://github.com/freshworks/crayons/commit/e9df0a589830e3e41d8270bc08e6b79c92b994ab))

## [3.0.0-beta.13](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.12...@freshworks/crayons@3.0.0-beta.13) (2022-02-09)

### Bug Fixes

- **accordion:** add watcher for expanded attribute ([#408](https://github.com/freshworks/crayons/issues/408)) ([06cf48f](https://github.com/freshworks/crayons/commit/06cf48f6e94d417808c84065004454d02a419267))
- **checkbox:** fix checkbox styles based on style guide ([#406](https://github.com/freshworks/crayons/issues/406)) ([cb85870](https://github.com/freshworks/crayons/commit/cb85870befc8d0f24ba94d8a1a4bcb1a5cb4984b))
- **component-style-fixes:** modal style, label style, toggle icon button fixes as per DSM ([#404](https://github.com/freshworks/crayons/issues/404)) ([78d7ebf](https://github.com/freshworks/crayons/commit/78d7ebf21b17f4b75a21ddfb9729e0554a5c863c))
- **data-table:** row hover cursor pointer fix ([#398](https://github.com/freshworks/crayons/issues/398)) ([823e3ca](https://github.com/freshworks/crayons/commit/823e3ca8e51f95cd1c9f164fc6bc048ada175e93))
- **datepicker:** fix datepicker month/year updates ([#397](https://github.com/freshworks/crayons/issues/397)) ([1248ee8](https://github.com/freshworks/crayons/commit/1248ee8e2585d87757aa269966dedb867ace5256))
- **fw-input:** handle decimal input usecase ([#396](https://github.com/freshworks/crayons/issues/396)) ([56ff3d3](https://github.com/freshworks/crayons/commit/56ff3d3ea0c45e57a92d2370162ba7f204ba7385))
- **fw-pagination:** End value not updated on total prop change ([#400](https://github.com/freshworks/crayons/issues/400)) ([549bf84](https://github.com/freshworks/crayons/commit/549bf84632c7b00c9b07e427f13354061ee2bdde))
- **fw-select:** fixed the padding issue on multi-select ([#407](https://github.com/freshworks/crayons/issues/407)) ([f365462](https://github.com/freshworks/crayons/commit/f36546203a54aa8d3af2a2347dbe5b83d2129d13))
- **fw-tag:** fixed the style based on DSM ([#405](https://github.com/freshworks/crayons/issues/405)) ([6ec87f1](https://github.com/freshworks/crayons/commit/6ec87f199715097dc1a26edccf71435d4f119c42))
- **fw-toast-message:** updated styles for toast-message ([#402](https://github.com/freshworks/crayons/issues/402)) ([acf41a8](https://github.com/freshworks/crayons/commit/acf41a8d68930a60b5e73ca511f27bf78537017b))
- **tabs:** remove vertical scrollbar for tabs nav ([#401](https://github.com/freshworks/crayons/issues/401)) ([70f9446](https://github.com/freshworks/crayons/commit/70f9446cb8962a8e547c64afb278e09fe6320061))

### Features

- **data-table:** add table settings option to data table ([#399](https://github.com/freshworks/crayons/issues/399)) ([dbb11e2](https://github.com/freshworks/crayons/commit/dbb11e2dd974e75e2be4a961dbb379a32a80917a))
- **fw-input:** Added slots and modified styles for fw-input based on DSM ([#395](https://github.com/freshworks/crayons/issues/395)) ([1f5b846](https://github.com/freshworks/crayons/commit/1f5b8462f3a2781714adca13709d9b46bd89e8e4))

## [3.0.0-beta.12](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.11...@freshworks/crayons@3.0.0-beta.12) (2022-02-03)

### Bug Fixes

- **accordion:** added pointed cursor to accordion title ([#392](https://github.com/freshworks/crayons/issues/392)) ([d1e792c](https://github.com/freshworks/crayons/commit/d1e792caaf6f44d4ec4247e312c955f37a73a701))
- **fw-form:** handle relationship type in form render ([#394](https://github.com/freshworks/crayons/issues/394)) ([f3b3f52](https://github.com/freshworks/crayons/commit/f3b3f5277aa1bad6de8ac8aa850ec33a0043b665))

### Features

- **format-date:** format date using Intl.DateTimeFormat API ([#391](https://github.com/freshworks/crayons/issues/391)) ([4d5da20](https://github.com/freshworks/crayons/commit/4d5da20afb3a271aa19afdbffc1ca76f3ab1394a))

## [3.0.0-beta.11](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.10...@freshworks/crayons@3.0.0-beta.11) (2022-01-28)

### Bug Fixes

- **checkbox:** Fix checkbox event emission ([#382](https://github.com/freshworks/crayons/issues/382)) ([2ee8d43](https://github.com/freshworks/crayons/commit/2ee8d43b1516971d0141a70e8b966c60b5bb0ad8))
- **data-table:** rowActions async skelton appearing ([#390](https://github.com/freshworks/crayons/issues/390)) ([db09876](https://github.com/freshworks/crayons/commit/db09876c271e61d7189c7af01024d0a779188635))
- **fw-drag-container:** drag container now supports dynamic and nested child items ([#383](https://github.com/freshworks/crayons/issues/383)) ([03b0d64](https://github.com/freshworks/crayons/commit/03b0d6478c35623433b1b6557837e66603bade42))
- **fw-tag:** font size and padding fix ([#376](https://github.com/freshworks/crayons/issues/376)) ([c6ad237](https://github.com/freshworks/crayons/commit/c6ad2375e903f188198fa662500c0623227ac81b))
- **fw-tag:** removed reflect for attributes and added int support([#385](https://github.com/freshworks/crayons/issues/385)) ([1220363](https://github.com/freshworks/crayons/commit/12203636775b3d7bfc07689249cddfda06400bc6))
- **fw-toast:** added box shadow to toast message ([#368](https://github.com/freshworks/crayons/issues/368)) ([cb7131d](https://github.com/freshworks/crayons/commit/cb7131df99eed9679596f08213a4251c4346d54d))
- **modal:** slider variant position justify-content to flex-end ([#369](https://github.com/freshworks/crayons/issues/369)) ([a7aff28](https://github.com/freshworks/crayons/commit/a7aff28865afe48f5105fe833282a069b2a9f7dd))
- **skeleton:** removing margin-bottom when skeleton count is one ([#389](https://github.com/freshworks/crayons/issues/389)) ([47c9b0e](https://github.com/freshworks/crayons/commit/47c9b0e288decab11c98012a2701bd10c22ddfae))
- **tabs:** fix incorrect key press handling in tabs and accommodate child attrs ([#387](https://github.com/freshworks/crayons/issues/387)) ([6ad4aa0](https://github.com/freshworks/crayons/commit/6ad4aa03635e7f104c8ec44c14e9c4991837493e))
- **tabs:** fix tabs activation on attribute change ([#388](https://github.com/freshworks/crayons/issues/388)) ([13e8497](https://github.com/freshworks/crayons/commit/13e84979ad6893d8ffe580a4538c631062b56c89))

### Features

- **data-table:** adding 'icon' cell variant, column text-align, icon button in row actions, selectAllRows api to data table ([#386](https://github.com/freshworks/crayons/issues/386)) ([8b55314](https://github.com/freshworks/crayons/commit/8b55314d6c7e232dfab22c82e2de8a6611d72d1d))
- **data-table:** adding column hide, column width, data formatting features for DataTables. ([#370](https://github.com/freshworks/crayons/issues/370)) ([de4e323](https://github.com/freshworks/crayons/commit/de4e32364e6d3b04e2570e5f03f8b37044802a24))
- **data-table:** row actions feature added to fw-data-table component ([#361](https://github.com/freshworks/crayons/issues/361)) ([689ab40](https://github.com/freshworks/crayons/commit/689ab40d5a63f48d2aded07667cd6abbea092482))
- **dynamic-form:** form component dynamically constructed based on structured schema ([#364](https://github.com/freshworks/crayons/issues/364)) ([4acb560](https://github.com/freshworks/crayons/commit/4acb56068e1ddd80c2359cbb367c0a55aabbcf0e))
- **fw-drag-item:** added feature to pin the position of fw-drag-item ([#363](https://github.com/freshworks/crayons/issues/363)) ([bc42808](https://github.com/freshworks/crayons/commit/bc42808ee7debd6b7b537747730ae28c5bc14f05))
- **fw-form:** Focus on first error field, code samples, tests and a11y ([#381](https://github.com/freshworks/crayons/issues/381)) ([f759853](https://github.com/freshworks/crayons/commit/f759853362d41efbcf9ee6affc1b60c3930d8bcd))
- **fw-menu:** added menu and menu-item ([#366](https://github.com/freshworks/crayons/issues/366)) ([57db59e](https://github.com/freshworks/crayons/commit/57db59e10527eedea07d5047e4f42f9d1af0e0e2))
- **fw-select:** added option to disable deselect already selected value ([#378](https://github.com/freshworks/crayons/issues/378)) ([1af11d3](https://github.com/freshworks/crayons/commit/1af11d334377c0ea007839ccffd43cff7cd1f86c))
- **fw-select:** added support for integer dataype for value ([#384](https://github.com/freshworks/crayons/issues/384)) ([ca1a4a0](https://github.com/freshworks/crayons/commit/ca1a4a0e9a23ce6286b482933aed3370ca0678f6))
- **input:** expose css variables for margin and padding for input, tabs ([#380](https://github.com/freshworks/crayons/issues/380)) ([49a1741](https://github.com/freshworks/crayons/commit/49a17418882d05260f73426f738008be98f1df82))

### BREAKING CHANGES

**_fw-checkbox_**: On programatically changing the checked attribute of the checkbox `fwChange` will not be fired anymore.

## [3.0.0-beta.10](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.9...@freshworks/crayons@3.0.0-beta.10) (2022-01-07)

### Bug Fixes

- **fw-select:** handled undefined / invalid value scenarios ([#354](https://github.com/freshworks/crayons/issues/354)) ([148cda8](https://github.com/freshworks/crayons/commit/148cda8140dfe6403555153714d7c7ee50872952))

### Features

- **data-table:** adding select all rows to DataTable component ([#356](https://github.com/freshworks/crayons/issues/356)) ([39d2403](https://github.com/freshworks/crayons/commit/39d2403b26fc39bd4b2c22e81502bb0f08c4849f))
- **data-table:** custom cell implementation ([#351](https://github.com/freshworks/crayons/issues/351)) ([9e6e1fb](https://github.com/freshworks/crayons/commit/9e6e1fb2b27f39fdc48d11409cf06952b05690fd))
- **fw-drag-container:** added drag/drop and sortable container ([#352](https://github.com/freshworks/crayons/issues/352)) ([6323475](https://github.com/freshworks/crayons/commit/6323475ec489dc58c90f779b8c3d5a44c3c787a0))
- **pill:** Adding pill component ([#357](https://github.com/freshworks/crayons/issues/357)) ([9a675e7](https://github.com/freshworks/crayons/commit/9a675e7f3dc984134f441c747d3722866aca162f))
- **tabs:** expose public method to set active tab index from outside of fw-tabs ([#359](https://github.com/freshworks/crayons/issues/359)) ([7131acb](https://github.com/freshworks/crayons/commit/7131acb6ea3d08558f5dc6b2cf9838dc4305acdf))

## [3.0.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.8...@freshworks/crayons@3.0.0-beta.9) (2021-12-17)

### Bug Fixes

- **datepicker:** add stopImmediatePropagation and refactor code ([#348](https://github.com/freshworks/crayons/issues/348)) ([7ed726a](https://github.com/freshworks/crayons/commit/7ed726ab12f510c02ab96a067363d3b9fbda6b44))
- **datepicker:** fix auto close on datepicker on tab ([#339](https://github.com/freshworks/crayons/issues/339)) ([41711f6](https://github.com/freshworks/crayons/commit/41711f6fd2cfe6d8263af1b36a961b61db9c5651))

### Features

- **format-number:** Format number component using Intl.NumberFormat API ([#333](https://github.com/freshworks/crayons/issues/333)) ([aed902d](https://github.com/freshworks/crayons/commit/aed902df7a2de2df89d40675c30ddc6df8d10831))
- **fw-icon-library:** fwIcon extensions and IconLibrary ([#340](https://github.com/freshworks/crayons/issues/340)) ([9e5ceb3](https://github.com/freshworks/crayons/commit/9e5ceb314095423a1c6788c911812b2f52f7a926))
- **pagination:** compact pagination ([#335](https://github.com/freshworks/crayons/issues/335)) ([1bda7e2](https://github.com/freshworks/crayons/commit/1bda7e2769d959a9ab2afa4d059f8135e1fd4710))
- **toggle-group:** Toggle group button supporting multiple selection ([#331](https://github.com/freshworks/crayons/issues/331)) ([3ec4eb9](https://github.com/freshworks/crayons/commit/3ec4eb9d50419c0b327dc82aa01172f17d82e938))

## [3.0.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.7...@freshworks/crayons@3.0.0-beta.8) (2021-12-10)

### Bug Fixes

- **fw-input:** adjust input styles for icons ([#329](https://github.com/freshworks/crayons/issues/329)) ([f7250fc](https://github.com/freshworks/crayons/commit/f7250fce3ea75e1ba858ee37b5fc3df851437b06))

### Features

- **accordion:** Adding accordion component ([#327](https://github.com/freshworks/crayons/issues/327)) ([a8acabf](https://github.com/freshworks/crayons/commit/a8acabfe7bfeb69986e543067a65ec5e89f83694))
- **data-table:** adding DataTable component ([#332](https://github.com/freshworks/crayons/issues/332)) ([5681084](https://github.com/freshworks/crayons/commit/5681084530dd368a77f7a67bc1c6a95402e7cf59))
- **fw-popover:** added prop to focus on the content ([#336](https://github.com/freshworks/crayons/issues/336)) ([9e7eea6](https://github.com/freshworks/crayons/commit/9e7eea66a98e333c20bff936150ed9a1382f7aa3))
- **fw-select:** added ARIA compatibility ([#330](https://github.com/freshworks/crayons/issues/330)) ([893808f](https://github.com/freshworks/crayons/commit/893808f457c8ee5072e80eb7ef4a478f8944d9ec))

## [3.0.0-beta.7](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.6...@freshworks/crayons@3.0.0-beta.7) (2021-12-03)

### Bug Fixes

- **toast:** copy event listeners when cloning the node for custom template ([#315](https://github.com/freshworks/crayons/issues/315)) ([2f58061](https://github.com/freshworks/crayons/commit/2f58061ecd1d3b40ed1788c0b485b352fdb05be6))

### Features

- **css-utils:** Adding CSS Utils and related documentation ([#314](https://github.com/freshworks/crayons/issues/314)) ([49c0cc4](https://github.com/freshworks/crayons/commit/49c0cc48dffe9b6e0f711c471d709f02260d50c1))
- **date-picker:** add input type variant for single date and range selection datepicker ([#303](https://github.com/freshworks/crayons/issues/303)) ([f520401](https://github.com/freshworks/crayons/commit/f520401d356fbb34b6d93665634dc5be8beb83db))
- **fw-list-options:** scroll to the last selected item on open ([#324](https://github.com/freshworks/crayons/issues/324)) ([e17ea83](https://github.com/freshworks/crayons/commit/e17ea8326da4e158c9e4260510b69aa1d64d4f6e))
- **fw-select:** added keyboard navigation ([#316](https://github.com/freshworks/crayons/issues/316)) ([6f28bbe](https://github.com/freshworks/crayons/commit/6f28bbead8cfd199a75efd657fb8c090134fe7eb))
- **fw-select:** added keyboard navigation support for tags in multiselect ([#322](https://github.com/freshworks/crayons/issues/322)) ([0d2caed](https://github.com/freshworks/crayons/commit/0d2caed1330a82382e8022b7517c45dcdbc4de6c))
- **fw-select:** added mail variant ([#321](https://github.com/freshworks/crayons/issues/321)) ([2333ce6](https://github.com/freshworks/crayons/commit/2333ce69cc27915f611ccdad60f56b3d4e58c64c))
- **fw-tag:** added focusable prop and setFocus method ([#318](https://github.com/freshworks/crayons/issues/318)) ([d4e8489](https://github.com/freshworks/crayons/commit/d4e8489158afb068154c09f48944e644431979e0))
- **progress-loader:** Progress Loader Component ([#297](https://github.com/freshworks/crayons/issues/297)) ([ffca27f](https://github.com/freshworks/crayons/commit/ffca27fe953a6060fc8b20df8b1dc6387369606b))
- **skeleton:** skeleton component to handle progressive loading of contents ([#326](https://github.com/freshworks/crayons/issues/326)) ([d118aa9](https://github.com/freshworks/crayons/commit/d118aa9f9f62de6c563d56f2ed860971a7a2d308))

## [3.0.0-beta.6](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.4...@freshworks/crayons@3.0.0-beta.6) (2021-11-26)

### Bug Fixes

- **button-group:** use correct units for margin-left ([#301](https://github.com/freshworks/crayons/issues/301)) ([db50bc7](https://github.com/freshworks/crayons/commit/db50bc7296eac56ee6ec3a6ff065da2978c1b58e))
- **checkbox:** remove class from host to avoid getting overridden by global styles ([#308](https://github.com/freshworks/crayons/issues/308)) ([0e37f57](https://github.com/freshworks/crayons/commit/0e37f576676727db5027742262d313d2b6e7c373))
- **radio:** remove class from host and apply on container to avoid getting overridden by global styles ([#307](https://github.com/freshworks/crayons/issues/307)) ([df5c5c9](https://github.com/freshworks/crayons/commit/df5c5c9ad34ccbf967f84a45485d0630f4afb88e))
- tab-header attribute wrongly mentioned as fw-tab-header ([3c03859](https://github.com/freshworks/crayons/commit/3c03859120b2b78ec49c022100c11f6dde80f0f4))
- **tab:** remove class from host to avoid getting overridden by global styles ([#310](https://github.com/freshworks/crayons/issues/310)) ([b367032](https://github.com/freshworks/crayons/commit/b3670321e3d58c6a4dec99934e6a4c16dbabf406))
- **toast:** remove styling from host to avoid styles getting overridden by global styles ([#306](https://github.com/freshworks/crayons/issues/306)) ([7b32ef1](https://github.com/freshworks/crayons/commit/7b32ef17045ea4edc8db7b6af2d9a2b0e675d859))

### Features

- **fw-select:** added prop to display avatar ([#293](https://github.com/freshworks/crayons/issues/293)) ([d923d16](https://github.com/freshworks/crayons/commit/d923d166495597bd8711e86aa181e08c19ce073c))
- **fw-tag:** tags can be removed via backspace ([#300](https://github.com/freshworks/crayons/issues/300)) ([8f9576c](https://github.com/freshworks/crayons/commit/8f9576cc41c631e720b502f15f8b54449ed8a0d2))
- **tooltip:** adding new tooltip component ([#312](https://github.com/freshworks/crayons/issues/312)) ([181f92a](https://github.com/freshworks/crayons/commit/181f92ad4064c37d9c35447dec816c48aff808f7))

## [3.0.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.4...@freshworks/crayons@3.0.0-beta.5) (2021-11-26)

### Bug Fixes

- **button-group:** use correct units for margin-left ([#301](https://github.com/freshworks/crayons/issues/301)) ([db50bc7](https://github.com/freshworks/crayons/commit/db50bc7296eac56ee6ec3a6ff065da2978c1b58e))
- **checkbox:** remove class from host to avoid getting overridden by global styles ([#308](https://github.com/freshworks/crayons/issues/308)) ([0e37f57](https://github.com/freshworks/crayons/commit/0e37f576676727db5027742262d313d2b6e7c373))
- **radio:** remove class from host and apply on container to avoid getting overridden by global styles ([#307](https://github.com/freshworks/crayons/issues/307)) ([df5c5c9](https://github.com/freshworks/crayons/commit/df5c5c9ad34ccbf967f84a45485d0630f4afb88e))
- tab-header attribute wrongly mentioned as fw-tab-header ([3c03859](https://github.com/freshworks/crayons/commit/3c03859120b2b78ec49c022100c11f6dde80f0f4))
- **tab:** remove class from host to avoid getting overridden by global styles ([#310](https://github.com/freshworks/crayons/issues/310)) ([b367032](https://github.com/freshworks/crayons/commit/b3670321e3d58c6a4dec99934e6a4c16dbabf406))
- **toast:** remove styling from host to avoid styles getting overridden by global styles ([#306](https://github.com/freshworks/crayons/issues/306)) ([7b32ef1](https://github.com/freshworks/crayons/commit/7b32ef17045ea4edc8db7b6af2d9a2b0e675d859))

### Features

- **fw-select:** added prop to display avatar ([#293](https://github.com/freshworks/crayons/issues/293)) ([d923d16](https://github.com/freshworks/crayons/commit/d923d166495597bd8711e86aa181e08c19ce073c))
- **fw-tag:** tags can be removed via backspace ([#300](https://github.com/freshworks/crayons/issues/300)) ([8f9576c](https://github.com/freshworks/crayons/commit/8f9576cc41c631e720b502f15f8b54449ed8a0d2))
- **tooltip:** adding new tooltip component ([#312](https://github.com/freshworks/crayons/issues/312)) ([181f92a](https://github.com/freshworks/crayons/commit/181f92ad4064c37d9c35447dec816c48aff808f7))

## [3.0.0-beta.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.2...@freshworks/crayons@3.0.0-beta.4) (2021-11-19)

### Bug Fixes

- **fw-datepicker:** added more placement options ([#262](https://github.com/freshworks/crayons/issues/262)) ([0a2f7b5](https://github.com/freshworks/crayons/commit/0a2f7b5f3073ba31d1a1e9663e6afe2d848cd573))
- **popover:** prevent scroll chaining and expose props for min, max heights ([#287](https://github.com/freshworks/crayons/issues/287)) ([f7525f0](https://github.com/freshworks/crayons/commit/f7525f0a93973673e0a17adfd9c10d1bfb8c3791))
- **tab:** fix fw-tab to work with react typescript ([#285](https://github.com/freshworks/crayons/issues/285)) ([f93add1](https://github.com/freshworks/crayons/commit/f93add1919c8c9b0a9cf86c8a408141ef45203a2))

### Features

- **fw-list-options:** Moved the dynamic filter logic from fw-select to fw-list-options ([#286](https://github.com/freshworks/crayons/issues/286)) ([aed2184](https://github.com/freshworks/crayons/commit/aed2184ce41eb7e938ba64c091438a276e14931c))
- **fw-popover:** added show/hide event emitters and new props ([#268](https://github.com/freshworks/crayons/issues/268)) ([e369c1c](https://github.com/freshworks/crayons/commit/e369c1c7ba69f8287a6fe52a862a9dea01a4bcb9))
- **fw-tag:** added avatar variant for tag ([#290](https://github.com/freshworks/crayons/issues/290)) ([c568d06](https://github.com/freshworks/crayons/commit/c568d069d505b352f9d54e83f2f72e00ef5b7ddb))
- **slider:** adding slider variant to modal component ([#288](https://github.com/freshworks/crayons/issues/288)) ([4eef379](https://github.com/freshworks/crayons/commit/4eef379e990f7423a0bb0677d057539fdd3cbf68))
- **avatar:** avatar component ([#281](https://github.com/freshworks/crayons/issues/281)) ([dbf256d](https://github.com/freshworks/crayons/commit/dbf256db14ef42b3326192593521312abdffe928))

## [3.0.0-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.2...@freshworks/crayons@3.0.0-beta.3) (2021-11-12)

### Bug Fixes

- **fw-datepicker:** added more placement options ([#262](https://github.com/freshworks/crayons/issues/262)) ([0a2f7b5](https://github.com/freshworks/crayons/commit/0a2f7b5f3073ba31d1a1e9663e6afe2d848cd573))
- **radio-group:** fix radio group to be compatiable with react version ([#267](https://github.com/freshworks/crayons/issues/267)) ([c8efaec](https://github.com/freshworks/crayons/commit/c8efaec6030333aa026a2d28cff67c3fe3b7b2f3))
- **radio-group:** remove call to componentOnReady in connected callback ([#260](https://github.com/freshworks/crayons/issues/260)) ([10de155](https://github.com/freshworks/crayons/commit/10de155d50641a202d82ab013c41ae167393ff2b))

### Features

- button variations, style corrections and loading state ([#264](https://github.com/freshworks/crayons/issues/264)) ([69b326c](https://github.com/freshworks/crayons/commit/69b326ca08ffb4820aa260a69fc4861a9e6efdc6))
- **fw-list-options:** added custom filter function ([#269](https://github.com/freshworks/crayons/issues/269)) ([73e0af3](https://github.com/freshworks/crayons/commit/73e0af359eb777399e00bab375fa3c72be462908)), closes [#275](https://github.com/freshworks/crayons/issues/275)
- **fw-popover:** added show/hide event emitters and new props ([#268](https://github.com/freshworks/crayons/issues/268)) ([e369c1c](https://github.com/freshworks/crayons/commit/e369c1c7ba69f8287a6fe52a862a9dea01a4bcb9))
- **inline-message:** adding inline messages feature ([#270](https://github.com/freshworks/crayons/issues/270)) ([d41d389](https://github.com/freshworks/crayons/commit/d41d3896c3b26797f373d6f7ef217612974854aa))
- **toggle:** show icon for toggle by default ([#273](https://github.com/freshworks/crayons/issues/273)) ([f6358a6](https://github.com/freshworks/crayons/commit/f6358a6e6911d814cff86d156192c20883a1bcca))
- **multi toast:** Multi Toast Notification with toast component and ToastController ([#276](https://github.com/freshworks/crayons/issues/276)) ([e2fb9c0](https://github.com/freshworks/crayons/commit/e2fb9c09c83042234e361e548f2fd1301f031189))
- **button group:** new button group component added ([#274](https://github.com/freshworks/crayons/issues/274)) ([a55feb2](https://github.com/freshworks/crayons/commit/a55feb222673e888a4c160ea2ca0c53ad330264a))

## [3.0.0-beta.2](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.1...@freshworks/crayons@3.0.0-beta.2) (2021-11-03)

### Bug Fixes

- **fw-modal:** modal - focus lock issue fix ([34edf7f](https://github.com/freshworks/crayons/commit/34edf7fd98999c642c7972085fe187084546d46c))

### Features

- **fw-list-options:** added fw-list-options ([e01f70f](https://github.com/freshworks/crayons/commit/e01f70f15405d3dfdfc97e02386ae2806906313b))
- **fw-popover:** added popover to select and datepicker ([21bed13](https://github.com/freshworks/crayons/commit/21bed1371fe1cc4b7668cf01425f8993d4ceba52))
- **fw-list-options:** added props to parent so that same props need not be repeated in child ([9e5b712](https://github.com/freshworks/crayons/commit/9e5b7120245745b9a95147ba4a3ebbb5b10c73f3))
- **fw-popover:** added fw-popover component ([dfbf462](https://github.com/freshworks/crayons/commit/dfbf4623ae2c749a4cf83a6c31e5fc6abbc1b285))
- **fw-tabs:** changing structure of fw-tabs children components to enable yeilding headers ([#247](https://github.com/freshworks/crayons/issues/247)) ([c8055a4](https://github.com/freshworks/crayons/commit/c8055a4a41806fec917b3c3e3ccc93eb94aaef85))
- **fw-modal:** improving modal composibility by introducing modal-title, modal-content, modal-footer ([#248](https://github.com/freshworks/crayons/issues/248)) ([4390b02](https://github.com/freshworks/crayons/commit/4390b021fc521d2c2c23648c791268dfe6cd71be))
- **fw-modal:** modal - adding open method to the modal ([c550f21](https://github.com/freshworks/crayons/commit/c550f219ec4581421afad2faf59128b2ecd1e299))
- **custom-react-wrapper:** use Custom React Wrapper instead of Stencil's react wrapper ([3ae8667](https://github.com/freshworks/crayons/commit/3ae866717d763337acd42f1e13a2155275746022))
- **fw-list-options:** base for fw-list-options ([9126aaa](https://github.com/freshworks/crayons/commit/9126aaaefb4271f3dbe7fba1a16092ae2150aee7))
- **fw-select-option:** added variants of select-option ([6b04d16](https://github.com/freshworks/crayons/commit/6b04d1683191a6ad28f1f160d9e2fac6650765a1))
- **fw-select-option:** renamed props ([09a1811](https://github.com/freshworks/crayons/commit/09a1811496edb31ae80091aaca558b21f0b6f7df))

### BREAKING CHANGES

- **fw-tab:** _tab-header-html_ attribute is now removed, instead use fw-tab children for using html content for tab header and use fw-tab-panel for panel content
- **fw-modal:** Changing visibility property to is-open property.

## [3.0.0-beta.1](https://github.com/freshworks/crayons/compare/@freshworks/crayons@3.0.0-beta.0...@freshworks/crayons@3.0.0-beta.1) (2021-10-22)

### Refactor

- **root:** move .github to the root folder and remove from each packages ([#244](https://github.com/freshworks/crayons/issues/244)) ([56eeeb8](https://github.com/freshworks/crayons/commit/56eeeb84179e39001d9f6f2837e98cc063188e66))

## [3.0.0-beta.0](https://github.com/freshworks/crayons/compare/v2.13.2...@freshworks/crayons@3.0.0-beta.0) (2021-10-20)

### Features

- **react wrapper:** added React wrapper to Crayons ([0c9a42d](https://github.com/freshworks/crayons/commit/0c9a42db21b7e3f80df3adb3e55fd4899c12acb8))
- **monorepo:** ([abc48c8](https://github.com/freshworks/crayons/commit/abc48c88f025d13dd321b75bb00782a62361aaf9))
- styling architecture changes: ([291832d](https://github.com/freshworks/crayons/commit/291832d6c29b2ae8258f584d6745eb0fe3f85dcf))
- tooling setup and stylelint changes: ([098dee5](https://github.com/freshworks/crayons/commit/098dee50fb47ea25b9dc3cedfd65cdf2a495a684))
- crayons-commons package to reuse common functionality: ([ce5d5e9](https://github.com/freshworks/crayons/commit/ce5d5e99e21e7237b8fe117d43db30f36b340603))
- **crayons-datatable** init setup: ([e4c7fb2](https://github.com/freshworks/crayons/commit/e4c7fb254d3ca8daac2de64094b46362d8679df8))
- styles and storybook init setup: ([7a54a45](https://github.com/freshworks/crayons/commit/7a54a4548b979039cb421027b93721be4e41131d))
- setup global storybook and remove package level storybook config: ([38c5f33](https://github.com/freshworks/crayons/commit/38c5f336d2426107ba3a274ec577899254275fb9))
- a11y runtime check in dev: ([a19e7e0](https://github.com/freshworks/crayons/commit/a19e7e067c91348a1f127598b823a5227a748485))
- storybook global setup and package level dev run: ([b43bc9d](https://github.com/freshworks/crayons/commit/b43bc9dccb4a138c32357c6c5504334126958bac))
- storybook global and package level dev setup: ([25cf303](https://github.com/freshworks/crayons/commit/25cf3032fa3607fae1f1de746bb5a397d3a0a3d7))
- css global styles setup: ([bed2b16](https://github.com/freshworks/crayons/commit/bed2b168d7648b44706ae962fbbdea957ba257a8))
- **fw-checkbox** add keyboard nav support and a11y support (#215) ([6e596c8](https://github.com/freshworks/crayons/commit/6e596c88a477b6476a91104cbbfef95157a0f803))
- **fw-radio** add keyboard nav support and a11y support (#216) ([ec1d913](https://github.com/freshworks/crayons/commit/ec1d913436c98e6e1d6d9efec7f32a6b45305018))
- **fw-toggle** adding support for showicon and keyboard navigation (#220) ([535381c](https://github.com/freshworks/crayons/commit/535381c4962654a1a02d65dcbfff5455292c9039))
- a11y changes and ally related test cases update ([6245ade](https://github.com/freshworks/crayons/commit/6245ade16e5dbf999ade26178dfdb26245aafdb9))

### Bug Fixes

- stylelint and eslint fixes: ([44a8aca](https://github.com/freshworks/crayons/commit/44a8aca57e669f8263d491bcb5034a8f1b0649c2))
- jsx-a11y/click-events-have-key-events and ally issues: ([55b3339](https://github.com/freshworks/crayons/commit/55b333984034ada20d78b50bc0a7f80369cb3425))
- no-noninteractive-element-interactions fix for dropdown-button: ([de8e0ce](https://github.com/freshworks/crayons/commit/de8e0ce240b101c734e4b576984c1e8ffb1a1126))
- react wrapper import fix for extended components: ([3d6c49a](https://github.com/freshworks/crayons/commit/3d6c49a3bd525577583ce302d5dc0dd84c732234))
- **fw-button** fix a11y issues and standardise attributes (#218) ([96c2a69](https://github.com/freshworks/crayons/commit/96c2a6971315718f7402309ac719ff3d00fa74e3))
- **vuepress:** fix Vuepress live preview plugin configuration based on latest version ([1e8d8ca](https://github.com/freshworks/crayons/commit/1e8d8ca33ddaff308a6c4ae4b1bebe2b8ee077dd))
- accessibility issue fixes ([56ee9f7](https://github.com/freshworks/crayons/commit/56ee9f7baec0800a83973f60b43c6ee9683364fa))

## 2.13.2 (2021-07-16)

### Bug Fixes

- **main.yml:** changes to upgrade remove validations ([de111ca](https://github.com/freshworks/crayons/commit/de111ca3f2ebed57a905d84436d878ed301a58fb))

## 2.13.1 (2021-04-14)

### Bug Fixes

- **fw-input:** adds a new event for clearing input ([271a20f](https://github.com/freshworks/crayons/commit/271a20ffe8b17901815d6db512c0f81c1bdd7882)), closes [#185](https://github.com/freshworks/crayons/issues/185)

## 2.13.0 (2021-03-18)

### Features

- **fw-label:** introduce css variables for label padding ([c7ef767](https://github.com/freshworks/crayons/commit/c7ef76723c748f455a8132822ca711ad2f24deb9)), closes [#181](https://github.com/freshworks/crayons/issues/181)

## 2.12.2 (2021-03-16)

### Bug Fixes

- **radio.tsx, checkbox.tsx:** fixes checked value change to reflect in UI when disabled ([0cc6f70](https://github.com/freshworks/crayons/commit/0cc6f7087e31b2378deb3757f5b7ae513641a06a)), closes [#154](https://github.com/freshworks/crayons/issues/154)

## 2.12.1 (2021-03-09)

### Bug Fixes

- **select.tsx:** fixes emitting fwChange before initialization for multiselect ([3d11ba5](https://github.com/freshworks/crayons/commit/3d11ba5d323343d7876bab185759c144abee2d28))

## 2.12.0 (2021-02-03)

### Features

- **input, button, radio-group, textarea, datepicker, timepicker, checkbox:** added form support ([58a7d25](https://github.com/freshworks/crayons/commit/58a7d257d6c28a146cc444f81bc64ccd6cc4934d)), closes [#104](https://github.com/freshworks/crayons/issues/104) [#170](https://github.com/freshworks/crayons/issues/170)

## 2.11.1 (2021-01-06)

### Bug Fixes

- **dropdown-button:** make only list scrollable ([09ee194](https://github.com/freshworks/crayons/commit/09ee19491aadc6fc0d4953e1333bf580ee11eeb2)), closes [#168](https://github.com/freshworks/crayons/issues/168)

## 2.11.0 (2020-12-21)

### Features

- **select.tsx:** added `max` for multselect ([e297873](https://github.com/freshworks/crayons/commit/e297873ba6ba8be53de069556b11132c6f35bc97)), closes [#156](https://github.com/freshworks/crayons/issues/156)

## 2.10.2 (2020-12-21)

### Bug Fixes

- **input.scss:** hides arrows in input type number ([cb91f0d](https://github.com/freshworks/crayons/commit/cb91f0d0ba0bee542f5aadd976f6e5fd23739fb2)), closes [#150](https://github.com/freshworks/crayons/issues/150)
- **toast:** fix toast icon not loading ([f4b69d8](https://github.com/freshworks/crayons/commit/f4b69d82c60e2e97e2c8795b4adbd04522253244)), closes [#164](https://github.com/freshworks/crayons/issues/164)
- **toast:** review comments ([f434514](https://github.com/freshworks/crayons/commit/f4345141d75413b1ab7dfa5d368a5253a76592b8)), closes [#164](https://github.com/freshworks/crayons/issues/164)

## 2.10.1 (2020-12-11)

### Bug Fixes

- **select.tsx:** fixed placeholder problem in select ([123a15a](https://github.com/freshworks/crayons/commit/123a15abbb84d704cc23a161fa64c8da247c49af)), closes [#157](https://github.com/freshworks/crayons/issues/157)

## 2.10.0 (2020-12-07)

### Features

- **textarea:** change textarea var desc ([4ef8b78](https://github.com/freshworks/crayons/commit/4ef8b78aa1c345231e7fff6111c2ac898a45f0e8)), closes [#152](https://github.com/freshworks/crayons/issues/152)
- **textarea:** introduced text color for textarea as scss var ([7e4af5b](https://github.com/freshworks/crayons/commit/7e4af5b7ce2bebdc2ffe325b75bbc7492188c12c)), closes [#152](https://github.com/freshworks/crayons/issues/152)

## 2.9.1 (2020-12-02)

### Bug Fixes

- **search.svg:** fixes color issue in svg file ([fbd1d18](https://github.com/freshworks/crayons/commit/fbd1d188fe3deecc11cea38b1ca7106318581943)), closes [#147](https://github.com/freshworks/crayons/issues/147)

## 2.9.0 (2020-11-04)

### Features

- **dropdown-button:** add disabled prop ([0aeca90](https://github.com/freshworks/crayons/commit/0aeca90fa74d8b39575f832de8c2325d72d77521)), closes [#145](https://github.com/freshworks/crayons/issues/145)

## 2.8.1 (2020-10-28)

### Bug Fixes

- **icon:** add gulp task to test ([d84eaa3](https://github.com/freshworks/crayons/commit/d84eaa3ad6c15ef0a26596ae27fd6902b0249b92)), closes [#143](https://github.com/freshworks/crayons/issues/143)
- **icon:** fixes icon url path error ([c20bdd8](https://github.com/freshworks/crayons/commit/c20bdd8f5dc3a98f29cbd244a86853eb10cb5017)), closes [#143](https://github.com/freshworks/crayons/issues/143)
- **icon:** minor gulp file fix ([db2d920](https://github.com/freshworks/crayons/commit/db2d920fc9ca62c52c1dd46ef939c3a7e42d190b)), closes [#143](https://github.com/freshworks/crayons/issues/143)

## 2.8.0 (2020-10-14)

### Features

- **components/select/select.tsx:** add a method to set selected values in fw-select component ([1ea13de](https://github.com/freshworks/crayons/commit/1ea13dea040316db62fdddd597ea5a6bb7bdcd1a)), closes [#132](https://github.com/freshworks/crayons/issues/132)

## 2.7.1 (2020-10-05)

### Bug Fixes

- fix datapicker false events trigger ([318f554](https://github.com/freshworks/crayons/commit/318f55479941df2837adc06c393420ad39e1ad36))

## 2.7.0 (2020-09-30)

### Features

- **button:** fix type change ([429e7dc](https://github.com/freshworks/crayons/commit/429e7dca05153a25491cc15214ea92a1feba9ea5)), closes [#112](https://github.com/freshworks/crayons/issues/112)
- **dropdown button:** add missing css prop ([36c157f](https://github.com/freshworks/crayons/commit/36c157f9b7cfff9ae6186b1dc81ed8ffec919cec)), closes [#112](https://github.com/freshworks/crayons/issues/112)
- **dropdown button:** dropdown button adhering to Freshworks Design System ([43e8bda](https://github.com/freshworks/crayons/commit/43e8bda94a06ecc95baae72225bff8515fa7480d)), closes [#112](https://github.com/freshworks/crayons/issues/112)
- **dropdown button:** dropdown button small fix ([003a937](https://github.com/freshworks/crayons/commit/003a9372f9ae0250c0a3d7ab9cd4a2d699e7c5c0)), closes [#122](https://github.com/freshworks/crayons/issues/122)
- **dropdown button:** review comments ([43923cd](https://github.com/freshworks/crayons/commit/43923cd35cd90337aca023e9f2aa3945ba6d949d)), closes [#112](https://github.com/freshworks/crayons/issues/112)
- **dropdown button:** review comments - 2 ([b8bfe71](https://github.com/freshworks/crayons/commit/b8bfe7187861973e817d6128d9df5f094a4deaf0)), closes [#112](https://github.com/freshworks/crayons/issues/112)

## 2.6.3 (2020-09-30)

### Bug Fixes

- **fw-button:** fixes CSS issues with external CSS ([ba327de](https://github.com/freshworks/crayons/commit/ba327defb0ddc2ea6358c0af69fd9e109e5c07f0)), closes [#134](https://github.com/freshworks/crayons/issues/134)

## 2.6.2 (2020-09-30)

### Bug Fixes

- **select:** fixed tag not getting disabled ([3723830](https://github.com/freshworks/crayons/commit/37238304453ab073e0700395d8eeb8a5b2710321)), closes [#137](https://github.com/freshworks/crayons/issues/137)

## 2.6.1 (2020-09-28)

### Bug Fixes

- **toast.scss, toast.scss, readme.md:** added z-index for toast messages, increased default timeout ([99d6b9d](https://github.com/freshworks/crayons/commit/99d6b9d91655487f4c1657351bdaba3d3dd8f6b2))

## 2.6.0 (2020-09-25)

### Features

- toast Component ([3db87dc](https://github.com/freshworks/crayons/commit/3db87dc486b644560ab60d372fddc540acab55c1)), closes [#111](https://github.com/freshworks/crayons/issues/111)

## 2.5.0 (2020-09-17)

### Features

- **input select textarea:** adds new prop - autofocus ([bd88d2b](https://github.com/freshworks/crayons/commit/bd88d2b8a0ade316dd6c652442e11c409f9f0cdc)), closes [#129](https://github.com/freshworks/crayons/issues/129)

## 2.4.0 (2020-08-28)

### Features

- **fw-modal:** added events and `hide-footer` attribute ([a4bd59c](https://github.com/freshworks/crayons/commit/a4bd59c7b3ac79fa7e89124c69590bf81ac75fa2))
- **fw-modal:** introduces modals to crayons ([1725f86](https://github.com/freshworks/crayons/commit/1725f864a9b246d99204b662e7c3620399728486)), closes [#113](https://github.com/freshworks/crayons/issues/113)

## 2.3.4 (2020-08-18)

### Bug Fixes

- **fw-tabs:** fixes Multi-Level Nesting in Tabs ([8e312f2](https://github.com/freshworks/crayons/commit/8e312f24bd252c89b287ca9bad3a9a2396c588ab)), closes [#109](https://github.com/freshworks/crayons/issues/109)

## 2.3.3 (2020-08-14)

### Bug Fixes

- **fw-tabs:** fwChange fires twice ([0135302](https://github.com/freshworks/crayons/commit/0135302f0964c9e64229f11fd4aa789cf232af0a)), closes [#106](https://github.com/freshworks/crayons/issues/106)

## 2.3.2 (2020-07-24)

### Bug Fixes

- **datepicker:** fixes closing the datepicker as designed ([19eec6d](https://github.com/freshworks/crayons/commit/19eec6d2c64bc1fc6ce0f761f46b33acfaeb5832)), closes [#98](https://github.com/freshworks/crayons/issues/98)

## 2.3.1 (2020-07-23)

### Bug Fixes

- close popup on click outside ([a88efc1](https://github.com/freshworks/crayons/commit/a88efc18a89952a240de4b8a78d17d5f0c798a2e)), closes [#98](https://github.com/freshworks/crayons/issues/98)

## 2.3.0 (2020-07-14)

### Bug Fixes

- review comments ([2556171](https://github.com/freshworks/crayons/commit/255617113413207f9d2a15540597dffa5cf97802))
- review comments - 2 ([7dbdf98](https://github.com/freshworks/crayons/commit/7dbdf984f55097e71a012daec56b41a722b109fb))

### Features

- style fix ([71a0794](https://github.com/freshworks/crayons/commit/71a07943a7559d787ee699b5e5e0400a699fed0d))
- **select:** added back readonly ([c78ae16](https://github.com/freshworks/crayons/commit/c78ae16acac8acb5871b935daa54d9444e3dbfc4))
- **select:** review comments -4 ([7501ff8](https://github.com/freshworks/crayons/commit/7501ff8891762ee561fbfedbd3c83479f57dceda))
- **select:** review comments - 3 ([b72687e](https://github.com/freshworks/crayons/commit/b72687ede2f8b9591e8ecb2ac0f3476470737684))
- **textarea, timepicker, select:** improvements in textarea, select, timepicker ([ce02f62](https://github.com/freshworks/crayons/commit/ce02f62eaebc17a6fd5777fe408ce48bb9a5a1f9))

## 2.2.4 (2020-06-23)

### Bug Fixes

- **tabs:** adds active index as an attribute/prop ([6f5cefb](https://github.com/freshworks/crayons/commit/6f5cefb07183314fae1c3e16c14bb27eabaf4581))

## 2.2.3 (2020-06-22)

### Bug Fixes

- **checkbox, radio:** adds reflect property to keep sync of attributes and properties ([57bd15e](https://github.com/freshworks/crayons/commit/57bd15ec8b21beb20c64ef5320819954907fa5f3))

## 2.2.2 (2020-06-19)

### Bug Fixes

- **tabs:** add customizations for color ([96bfac0](https://github.com/freshworks/crayons/commit/96bfac098fe2780d7bca9467e41985f226b28c4e))

## 2.2.1 (2020-06-17)

### Bug Fixes

- **tab:** fixes rendering when props of fw-tab is changed ([4d6a7f3](https://github.com/freshworks/crayons/commit/4d6a7f3417f196101afd73fb3d7a775a3cf74ca7))

## 2.2.0 (2020-06-17)

### Bug Fixes

- **tabs:** re-render on attribute change in `fw-tab` ([cc53bd4](https://github.com/freshworks/crayons/commit/cc53bd4ba8c385541558aad97268e1c6db8a8746))

### Features

- **tabs:** added disable and tabHeaderHtml capability ([4ec6be8](https://github.com/freshworks/crayons/commit/4ec6be8ab60855466a09b756fabd0de181399c68))

## 2.1.1 (2020-05-27)

### Bug Fixes

- **select.tsx, select.scss:** fixed UI bugs for next line input ([151671d](https://github.com/freshworks/crayons/commit/151671d9791169be9ef0740f477dec542743554f))

## 2.1.0 (2020-05-22)

### Bug Fixes

- **tabs:** react to changes within fw-tabs ([c1fe804](https://github.com/freshworks/crayons/commit/c1fe804dc27b38333ebf9fa01e3b4df038425c0a))
- month Year Dropdown ([8ac0322](https://github.com/freshworks/crayons/commit/8ac0322895e4c91e381b9a3e425478c303f9923e))
- select component default value fix ([7be93c5](https://github.com/freshworks/crayons/commit/7be93c5d5f1e5e5c94604d58d4c84afd2d36260f))
- style and default value fix ([dda833f](https://github.com/freshworks/crayons/commit/dda833f3f5440a3fde480131f861f0d11b39f4f1))

### Features

- **datepicker:** adding Datepicker component ([9208e76](https://github.com/freshworks/crayons/commit/9208e765ce161edbce3ca497521c8c06bc946f1f))

## 2.0.5 (2020-05-22)

### Bug Fixes

- **tabs:** react to changes within fw-tabs ([c1fe804](https://github.com/freshworks/crayons/commit/c1fe804dc27b38333ebf9fa01e3b4df038425c0a))

## 2.0.5 (2020-05-19)

### Bug Fixes

- **tabs:** react to changes within fw-tabs ([cbd2895](https://github.com/freshworks/crayons/commit/cbd2895c940708ddee50f7634a276b44b4478fca))

## 2.0.4 (2020-05-07)

### Bug Fixes

- **textarea:** fixes default textarea width to be 100% ([b475c35](https://github.com/freshworks/crayons/commit/b475c3585755a901865429afeb761bc92f99194e)), closes [#30](https://github.com/freshworks/crayons/issues/30)

## 2.0.3 (2020-05-06)

### Bug Fixes

- **select:** fixes select ([93cea4f](https://github.com/freshworks/crayons/commit/93cea4f9aed40f0d08b936eefe7f35cee4a65290))

## 2.0.2 (2020-05-06)

### Bug Fixes

- **select:** fixes error and warning css for select ([c9739fe](https://github.com/freshworks/crayons/commit/c9739fe35e921a18ecbc660413e70a11b05dbffa)), closes [#74](https://github.com/freshworks/crayons/issues/74)

## 2.0.1 (2020-05-06)

### Bug Fixes

- **select:** fixes Select bug that caused `fwChange` not to be fired for last multi-select option ([650c205](https://github.com/freshworks/crayons/commit/650c205022a148697235594eeb223fc2b03a2ce8)), closes [#68](https://github.com/freshworks/crayons/issues/68)

## 2.0.0 (2020-05-06)

### Documentation

- documents ([42055c2](https://github.com/freshworks/crayons/commit/42055c202ea1dc34601c9c2ffc3bf924b09dcee1))

### BREAKING CHANGES

- documents

## 1.1.0 (2020-04-29)

### Features

- **fw-select-options, fw-select, fw-tag:** added 'disabled' state to fw-select options ([d15eb0f](https://github.com/freshworks/crayons/commit/d15eb0fb5900f8839cd8a3887e70246d3990eef4))

## 1.0.1 (2020-04-15)

### Bug Fixes

- **tabs:** fixes initial render for Tabs component ([7ffe365](https://github.com/freshworks/crayons/commit/7ffe365e166455ce0bf06358da7607b517c7985a))

## 1.0.0 (2020-04-15)

### Bug Fixes

- **tab, tabs:** fixes querying nested components ([0f7e9e2](https://github.com/freshworks/crayons/commit/0f7e9e2a4ab784b8d00a3db7956f2f587891a34f))

### Reverts

- reverting Tokens ([e2f2b9a](https://github.com/freshworks/crayons/commit/e2f2b9aa425e6292213697ba835ba876fb3d338c))
