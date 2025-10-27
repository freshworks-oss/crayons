# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0-dew.10](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-dew.9...@freshworks/crayons-custom-objects@1.4.0-dew.10) (2025-10-27)

**Note:** Version bump only for package @freshworks/crayons-custom-objects





## [1.4.0-dew.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-dew.8...@freshworks/crayons-custom-objects@1.4.0-dew.9) (2025-10-21)

### Bug Fixes

- **form-builder:** replace CSS variable with hardcoded color for consistency ([c734773](https://github.com/freshworks/crayons/commit/c7347737800338258a2f908fffc586e5c74775b0))

## [1.4.0-dew.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-dew.4...@freshworks/crayons-custom-objects@1.4.0-dew.5) (2025-08-28)

### Bug Fixes

- **styles:** correct background color syntax to use CSS variable for consistency ([1b05731](https://github.com/freshworks/crayons/commit/1b05731fafa4332934dfeed5448741bf1c8d086a))
- **styles:** update background and border colors to use CSS variables for consistency ([27182b0](https://github.com/freshworks/crayons/commit/27182b09c4becaf3648e20c0e9148997247ac4ca))
- **styles:** update background color to use CSS variable for consistency ([92dcb13](https://github.com/freshworks/crayons/commit/92dcb134b15c767bf5c32064bc60e0440b5dfded))

### Features

- **styles:** update color properties to use CSS variables for improved theming consistency ([c83f5ff](https://github.com/freshworks/crayons/commit/c83f5ffdd3d71442c3247400712a26e557451b15))

## [1.4.0-dew.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-dew.3...@freshworks/crayons-custom-objects@1.4.0-dew.4) (2025-08-14)

### Features

- **field-editor:** add theme configuration for form builder UI and update icon background logic ([a3d9d8d](https://github.com/freshworks/crayons/commit/a3d9d8d44c63fcd09a52ee03f066eb1d15e10ab3))
- **form-builder:** add theme support and update icon background logic ([2f203ea](https://github.com/freshworks/crayons/commit/2f203ea5b441bf7eb4eaf7c70ec9c978b25e5923))
- **styles:** update background and color properties to use CSS variables for improved theming ([710d6bf](https://github.com/freshworks/crayons/commit/710d6bf6565fa94889bebe01f266b500aefa8f92))

## [1.4.0-beta.32](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.31...@freshworks/crayons-custom-objects@1.4.0-beta.32) (2025-04-08)

### Bug Fixes

- **draggable.ts, drag-container.tsx, and form-builder.tsx:** fix bugs related to dep & msdd epic ([6529787](https://github.com/freshworks/crayons/commit/652978711b2cc0a4e19fcd4ce277bec650962f5d))
- **form-builder:** include same container check in count logic ([7b57550](https://github.com/freshworks/crayons/commit/7b57550ed914fadcec7675209ec3a1e90d842b12))
- **fw-form-builder:** pass field_options to fix delete button shown issue ([366b8c3](https://github.com/freshworks/crayons/commit/366b8c3a3e5c60e3a0a9ef8950c428f4558dfd96))
- pass field's options ([598ed43](https://github.com/freshworks/crayons/commit/598ed43f5015ca6a7e1781d895c1225fc130badb))

### BREAKING CHANGES

- **draggable.ts, drag-container.tsx, and form-builder.tsx:** The logic for computing the count within sections is revised

## [1.4.0-beta.31](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.30...@freshworks/crayons-custom-objects@1.4.0-beta.31) (2025-02-27)

### Bug Fixes

- added dependent changes ([191d7f1](https://github.com/freshworks/crayons/commit/191d7f15b08f58953558815055266d2dc4fb68ce))

## [1.4.0-beta.26](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.25...@freshworks/crayons-custom-objects@1.4.0-beta.26) (2024-11-26)

### Bug Fixes

- added the fix for validation label ([#956](https://github.com/freshworks/crayons/issues/956)) ([40176fc](https://github.com/freshworks/crayons/commit/40176fc49f4cd54faeebb1cd634cddeac53a9971))
- enable date filter to contain maxYear for filters in custom object ([0c3aa43](https://github.com/freshworks/crayons/commit/0c3aa43782af0cda33b344c842547c7f0f2d2ffc))
- set condition for maxYear and minYear for DATE props ([0734b71](https://github.com/freshworks/crayons/commit/0734b71f461adb2767248de08b908bd6b8519346))

## [1.4.0-beta.24](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.23...@freshworks/crayons-custom-objects@1.4.0-beta.24) (2024-11-12)

### Bug Fixes

- added the fix for label validation error for duplicate name ([#950](https://github.com/freshworks/crayons/issues/950)) ([35814f3](https://github.com/freshworks/crayons/commit/35814f3395e51ab12931969cfec8f0049dedb2f9))
- ensure the empty search screen is available is available when the search result is empty ([fa6c89d](https://github.com/freshworks/crayons/commit/fa6c89d829664f541cad6b741c23732148a7a16f))

## [1.4.0-beta.22](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.21...@freshworks/crayons-custom-objects@1.4.0-beta.22) (2024-10-28)

### Bug Fixes

- added support article link ([cf63a30](https://github.com/freshworks/crayons/commit/cf63a30ae8eaf0b7793ae1361147de7b676f909d))
- added the fix for error label validation in section ([#944](https://github.com/freshworks/crayons/issues/944)) ([5cab368](https://github.com/freshworks/crayons/commit/5cab368af667a150a0060c2252d3b09bc249634c))

## [1.4.0-beta.21](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.20...@freshworks/crayons-custom-objects@1.4.0-beta.21) (2024-10-21)

### Bug Fixes

- pass of position of the form values on searching specific field ([5e388e5](https://github.com/freshworks/crayons/commit/5e388e53ce5b8a82fdcc49cf4e75bb9f2fec5a88))

## [1.4.0-beta.20](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.19...@freshworks/crayons-custom-objects@1.4.0-beta.20) (2024-10-15)

### Bug Fixes

- added the search for section fields ([#942](https://github.com/freshworks/crayons/issues/942)) ([d5c304f](https://github.com/freshworks/crayons/commit/d5c304fa6571dc72b258defb7284dfc928b0988c))

## [1.4.0-beta.19](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.18...@freshworks/crayons-custom-objects@1.4.0-beta.19) (2024-10-03)

### Bug Fixes

- removed the icon for dynamic sections ([#941](https://github.com/freshworks/crayons/issues/941)) ([2d19558](https://github.com/freshworks/crayons/commit/2d19558ccd3bbc154dc7373f90706d34ec883f13))

## [1.4.0-beta.18](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.17...@freshworks/crayons-custom-objects@1.4.0-beta.18) (2024-09-30)

### Bug Fixes

- **test fix:** test fix ([32c9f76](https://github.com/freshworks/crayons/commit/32c9f76c8f415935070347f7053f2ddf44adf10f))

## [1.4.0-beta.17](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.16...@freshworks/crayons-custom-objects@1.4.0-beta.17) (2024-09-17)

### Bug Fixes

- "fix the drop allowed fields in the edit section ([5bde97c](https://github.com/freshworks/crayons/commit/5bde97ce924a53824f321792885b96846342f959))
- added index.html ([eb44517](https://github.com/freshworks/crayons/commit/eb445179fd2a4227e6ef99d2dcadbb2e52da4f1b))
- added the add field after typing label and click add field ([150ce15](https://github.com/freshworks/crayons/commit/150ce15efdbdaadb22a28ff5dee3ae3091133f87))
- added the dependent,lookup,dropdown field restriction ([b7291d7](https://github.com/freshworks/crayons/commit/b7291d743780969cd635b111e09d4587d8000e1d))
- added the disable required field ([9935c9d](https://github.com/freshworks/crayons/commit/9935c9df0f6ad236682ee75a72ec84289b199362))
- **added the drag and drop section changes:** added the drag and drop section changes ([31aa2b6](https://github.com/freshworks/crayons/commit/31aa2b65ebc765e8a5fd7c1da368913e511bbf16))
- added the edit and delete icon ([07c88fb](https://github.com/freshworks/crayons/commit/07c88fb1b4d971e3f1c37b1c67559dda84858f8d))
- added the fix for cancel button changes for section ([6f4b109](https://github.com/freshworks/crayons/commit/6f4b1094d815ffba8f98017cb8eebfdb7ace9001))
- added the fix for dependent id index issue ([936df81](https://github.com/freshworks/crayons/commit/936df812554d56a26220e72189a4df4a406780e3))
- added the icon for empty section drag and drop ([404bac0](https://github.com/freshworks/crayons/commit/404bac0f5562ea1b2fc8323930eb8089ffb1af5a))
- added the multiple section for drag and drop and empty section container ([78e62fe](https://github.com/freshworks/crayons/commit/78e62fe81721be206ce6b6e6482c2482bc712d16))
- added the reposition from one section to another and within section ([eb88b76](https://github.com/freshworks/crayons/commit/eb88b76e2522dfc46046e84deac3cf4c8dddd91b))
- added the reposition from section to outside and outside to section ([6d2a8c8](https://github.com/freshworks/crayons/commit/6d2a8c81807ebb4402c21f6fbea8db8ac54c8359))
- added the section drag drop component ([f0adbfb](https://github.com/freshworks/crayons/commit/f0adbfb71b3f85b500fe14728b5ef5394e784369))
- added the section drag-drop component" ([7a338ce](https://github.com/freshworks/crayons/commit/7a338cea341ecb9138cb2272b0e4e165383fc7c3))
- added the section header name ([b127af6](https://github.com/freshworks/crayons/commit/b127af6d84da21c1414c1fe7d80db341d5d37378))
- address the review comments ([239ab72](https://github.com/freshworks/crayons/commit/239ab729ef8f457185c2ef43c251c5f657b89ac6))
- addressed review comments ([344ed3e](https://github.com/freshworks/crayons/commit/344ed3eafb6effe481e9306ab71af1a0e68d0995))
- addressed the comments ([f0b4462](https://github.com/freshworks/crayons/commit/f0b4462745e85d959d47ae43fa3627018df82d0b))
- choice fix ([7ca6a90](https://github.com/freshworks/crayons/commit/7ca6a90ec2125c73495a019c90a12a71031a4a59))
- delete section fix ([9da9a27](https://github.com/freshworks/crayons/commit/9da9a2754ef982e8d99e4fdc3499ba9d806ac579))
- drag error message fix ([501c75d](https://github.com/freshworks/crayons/commit/501c75de67716aa15aadbff22fcc52c9e9c75250))
- edit section ([c11b75f](https://github.com/freshworks/crayons/commit/c11b75f436f3b37696d79ef9488c2170bb7394e5))
- fix for cancel multiple section ([f5cba12](https://github.com/freshworks/crayons/commit/f5cba12af0f3a6c257f8ad9cb9c4bc41ba3a686f))
- fix the drag and drop issue from left side drag ([e69f109](https://github.com/freshworks/crayons/commit/e69f1093e3e1b54ea4d3d3655d34778a138ea28c))
- fix the reposition render issue ([6d46717](https://github.com/freshworks/crayons/commit/6d46717a1136a862722ff73e14c6380c1a4e9e63))
- fixed delete section ([cb227f5](https://github.com/freshworks/crayons/commit/cb227f5ecbe714417e2437f35048ff3c36648c72))
- fixing the choice limit issue ([1d75c4a](https://github.com/freshworks/crayons/commit/1d75c4a4bcb3678bfc15e4bfec08006c9af4afcc))
- git commit -m "fixed the reposition from one section to another and within section and uniq id ([8ad63fc](https://github.com/freshworks/crayons/commit/8ad63fc3fe1bfa89a26dd5b837705a8a71eb5bb5))
- parent index and section name ([04ac108](https://github.com/freshworks/crayons/commit/04ac10817f5fb9ac6ba24e883959b5ff557ed61d))
- prevent rendering empty div ([01a0c56](https://github.com/freshworks/crayons/commit/01a0c567900d7d140569fcaea1ad3694bf2aa846))
- removed the delete button when it is inside section ([6754da3](https://github.com/freshworks/crayons/commit/6754da3a28797887f346199dcafea87a4e549ac4))
- reposition inside the sections ([912db04](https://github.com/freshworks/crayons/commit/912db04ff45fabb8ebbf25474acee93f439e7e71))
- restrict 15 fields inside the section ([adee54e](https://github.com/freshworks/crayons/commit/adee54e957212173e992a52e8a78e3e4fbb1c032))
- section delete ([5938a6f](https://github.com/freshworks/crayons/commit/5938a6fbfe097a2642618c7d761ab02aa3ba5b13))
- section name validation ([91bba6c](https://github.com/freshworks/crayons/commit/91bba6ce1e107be2355b65aaf2149737026add72))
- translation changes ([a2604cb](https://github.com/freshworks/crayons/commit/a2604cb58101618c1b732d1b1e2635f77772bdd0))

### Features

- add section changes ([2cf7451](https://github.com/freshworks/crayons/commit/2cf7451d1d0925a0b734b2d1456cf36746b366d9))
- added functionality for add section and beta flag check ([d658c80](https://github.com/freshworks/crayons/commit/d658c8087589287822d6b4083370391070e64794))
- added tooltip and section container ([da8111f](https://github.com/freshworks/crayons/commit/da8111f425897283a15d78d163315c1ff0b6d723))
- blur out other fields when section is expanded ([42306a1](https://github.com/freshworks/crayons/commit/42306a1caf669ec079482e668284cddfce5bdb74))
- **component:** add section button changes ([2e4a92a](https://github.com/freshworks/crayons/commit/2e4a92a78f6c628dff15b31c75172f737ba0a14a))
- create new section ([6dc9544](https://github.com/freshworks/crayons/commit/6dc9544e5e7afc4d9f2eb856c17ad8d99ee0df7b))
- create section flows ([c04b22c](https://github.com/freshworks/crayons/commit/c04b22c9d41927d28339b9f607fc234c55d9dccf))
- cSS fixes ([b065efa](https://github.com/freshworks/crayons/commit/b065efa2dd62ceb16092180818666f7eb3fd778e))
- delete section changes ([3b382ff](https://github.com/freshworks/crayons/commit/3b382ffd7353da63adcf89580650e4e80ea9dc21))
- disable choice with section ([2002f30](https://github.com/freshworks/crayons/commit/2002f305e4160d9833ff80813fc03ea114948b71))
- expand and show sections ([e93b762](https://github.com/freshworks/crayons/commit/e93b7621251c29752f86911f3d6dd977046385b7))
- moved isDefaultNonCustomField to parent ([36f4bd4](https://github.com/freshworks/crayons/commit/36f4bd42f5b4471b7ce9f7c848a6fbd3a1d92bd5))
- rBAC changes ([87c2afa](https://github.com/freshworks/crayons/commit/87c2afa3f42c8f482c42c640aaa00680b47368c1))
- save section ([6dd7813](https://github.com/freshworks/crayons/commit/6dd78133daced0450a2ce81847091d7d0d2ec253))
- section count and validations ([881fa2b](https://github.com/freshworks/crayons/commit/881fa2bb8a50b24ee608c5f8f1855c561c9fa1bd))
- section name validations ([96d7d11](https://github.com/freshworks/crayons/commit/96d7d11acdf8c9f15deda634682d05674cfb4ca4))
- test case fix ([6829179](https://github.com/freshworks/crayons/commit/68291792ea734e47f8b7c41c3696f9e9bb23792a))
- tooltip changes ([1f59dae](https://github.com/freshworks/crayons/commit/1f59dae1b04aa951e49a8009c3c41d06997d62c6))

## [1.4.0-beta.14](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.13...@freshworks/crayons-custom-objects@1.4.0-beta.14) (2024-07-17)

### Bug Fixes

- fix ([e4391cc](https://github.com/freshworks/crayons/commit/e4391cc7db0f269b0515319b67e53902702659aa))
- made changes ([2cb4f65](https://github.com/freshworks/crayons/commit/2cb4f655640e3056a535b5a24a9f1fcd623765c1))

## [1.4.0-beta.13](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.12...@freshworks/crayons-custom-objects@1.4.0-beta.13) (2024-06-10)

### Bug Fixes

- fix ([012563a](https://github.com/freshworks/crayons/commit/012563adf760dbd7f84f996b3709e209fcae49f1))

## [1.4.0-beta.12](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.11...@freshworks/crayons-custom-objects@1.4.0-beta.12) (2024-05-22)

### Bug Fixes

- added validation for dropdown ([3c4c376](https://github.com/freshworks/crayons/commit/3c4c37606b5c9e6bffb93ee0201add8fc73e8b51))
- bug fix ([c8657b3](https://github.com/freshworks/crayons/commit/c8657b3a3d43cfa54cb7b8eed716843c4dc3ff99))
- fix ([cb9646e](https://github.com/freshworks/crayons/commit/cb9646ea5aefe819d8e9a66840630fd4306567c1))
- test cases add ([5401509](https://github.com/freshworks/crayons/commit/540150915dad8b41f07c1f1fba2cb92069476b09))
- user is not shown with the correct error message on exceeding the limit for internal name field ([45f801d](https://github.com/freshworks/crayons/commit/45f801dc681d24aaa7b0808a94278e309336cdf5))

## [1.4.0-beta.10](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.9...@freshworks/crayons-custom-objects@1.4.0-beta.10) (2024-04-10)

### Bug Fixes

- [FE][FC-122306]: Fixes dependent field editable permission issues ([6684563](https://github.com/freshworks/crayons/commit/6684563bb8168dc337eba746726e6726101e09d2))

### Features

- **field-editor:** i have added the sla timer toggle when we are passing the feature flag ([eb99d77](https://github.com/freshworks/crayons/commit/eb99d77f48ebe948dd77d5bfda6925b4ea0a3d78))
- **field-editor:** i have added the sla timer toggle when we are passing the feature flag ([af9602b](https://github.com/freshworks/crayons/commit/af9602b5ac562a3979577824d73b2f1a9ce87614))

## [1.4.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.8...@freshworks/crayons-custom-objects@1.4.0-beta.9) (2024-03-18)

### Bug Fixes

- adds cloned fieldBuilderOptions and rel for anchor ([9e64bda](https://github.com/freshworks/crayons/commit/9e64bdafd78d9721a5254e10c00b658996a30ad9))
- adds two level dependency with validation on various steps ([de17335](https://github.com/freshworks/crayons/commit/de173358823e399f6fe6054cf615d7eb80bdf68a))
- validating fields length ([10649c3](https://github.com/freshworks/crayons/commit/10649c3d2bd8eb494c032e0cf398e4ae742edb93))
- validating the duplicate before removing the dictEl ([43a0e3d](https://github.com/freshworks/crayons/commit/43a0e3d2ae84d76173c5acad38634d70e013b8a0))

### Features

- [FC-120856]: Enables two level dependent field ([9280495](https://github.com/freshworks/crayons/commit/92804951336ae0a1005494623bea1a43ee4b8629))

## [1.4.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.4.0-beta.7...@freshworks/crayons-custom-objects@1.4.0-beta.8) (2024-01-17)

### Bug Fixes

- [FC-118243]: Adds dependent id with level to avoid cross drag and drop ([#906](https://github.com/freshworks/crayons/issues/906)) ([41a01c3](https://github.com/freshworks/crayons/commit/41a01c387e9752b28a417431e2e4894dcadb604b))
- [FC-118330]: Creates Id if the dropdown is created by textbox ([#907](https://github.com/freshworks/crayons/issues/907)) ([bbd072c](https://github.com/freshworks/crayons/commit/bbd072ce9a275095aa0382b4323e28bd6d34d0e8))

## [1.4.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.3.1-beta.2...@freshworks/crayons-custom-objects@1.4.0-beta.0) (2023-08-14)

### Features

- **fw-platform-table:** [Enhancement] - Ability to modify CSS or (change height or width) of fw-data-table of FwPlatformTable ([#886](https://github.com/freshworks/crayons/issues/886)) ([1eaf33a](https://github.com/freshworks/crayons/commit/1eaf33a73561747ef8cd074d90c39e8f7b5cfcc4))

## [1.3.0-beta.19](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.3.0-beta.18...@freshworks/crayons-custom-objects@1.3.0-beta.19) (2023-06-27)

### Features

- **component:** lookupField added for CONVERSATION_PROPERTIES form ([#866](https://github.com/freshworks/crayons/issues/866)) ([63c90f0](https://github.com/freshworks/crayons/commit/63c90f01488fdb41db2b1bb29334e73e0703a1be))

## [1.3.0-beta.18](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.3.0-beta.17...@freshworks/crayons-custom-objects@1.3.0-beta.18) (2023-06-10)

### Bug Fixes

- **filter-condition:** avoid passing value to date picker when mode is range ([#867](https://github.com/freshworks/crayons/issues/867)) ([7a6f372](https://github.com/freshworks/crayons/commit/7a6f37266a78e53b8a6b820748fc00b599c1fb16))

## [1.3.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.3.0-beta.4...@freshworks/crayons-custom-objects@1.3.0-beta.5) (2023-03-22)

### Features

- **fb-max-limits:** exclude default fields from max limits feature implemented ([#822](https://github.com/freshworks/crayons/issues/822)) ([98fd48a](https://github.com/freshworks/crayons/commit/98fd48a20677e9163a81849e647776323066955b))

## [1.3.0-beta.4](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.3.0-beta.3...@freshworks/crayons-custom-objects@1.3.0-beta.4) (2023-03-16)

### Bug Fixes

- **fchat-fixes-1403:** fix for label warning message retain and blank dropdown choices been added ([#819](https://github.com/freshworks/crayons/issues/819)) ([0db591c](https://github.com/freshworks/crayons/commit/0db591c42c1f354e2f4aad73a2c53106982d51d0))

## [1.3.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.2.1-beta.2...@freshworks/crayons-custom-objects@1.3.0-beta.0) (2023-03-02)

### Features

- **fb-permission:** Integrated functionality to restrict features in form builder based on role and permission ([#812](https://github.com/freshworks/crayons/issues/812)) ([7694f67](https://github.com/freshworks/crayons/commit/7694f67f2c99af05f62d28e284ba5b6172d24e7b))

## [1.2.0-beta.9](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.2.0-beta.8...@freshworks/crayons-custom-objects@1.2.0-beta.9) (2023-01-23)

### Features

- **form-builder:** Form mapper to support FormServe implemented, Internal name generation implemented and Free user restrictions done ([#778](https://github.com/freshworks/crayons/issues/778)) ([4793976](https://github.com/freshworks/crayons/commit/47939769de61c1c705f69d1a44f0cfd5d9d0a1ed))

## [1.2.0-beta.7](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.2.0-beta.6...@freshworks/crayons-custom-objects@1.2.0-beta.7) (2023-01-09)

### Features

- add form-builder-wrapper component with functions to add new field, delete and reposition ([2bf1a1e](https://github.com/freshworks/crayons/commit/2bf1a1e01135606a6edbb4462bf54dc72b11fcc5))

## [1.2.0-beta.5](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.2.0-beta.4...@freshworks/crayons-custom-objects@1.2.0-beta.5) (2022-12-18)

### Bug Fixes

- fix value setter in select condition component ([d0bf4c3](https://github.com/freshworks/crayons/commit/d0bf4c3fd6214ea938c6ec4c2ec3348362b9d4ca))

## [1.2.0-beta.0](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.1.4...@freshworks/crayons-custom-objects@1.2.0-beta.0) (2022-10-19)

### Features

- add i18n strings for sort-select and datatable ([a9eee87](https://github.com/freshworks/crayons/commit/a9eee871f5c5e6fae52432b64b4ff0edde90f500))

## [1.1.0-beta.8](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.1.0-beta.7...@freshworks/crayons-custom-objects@1.1.0-beta.8) (2022-09-09)

### Bug Fixes

- **crayons:** i18n mapping changes and icon circular deps fix and enable autoDefineCustomElements ([#679](https://github.com/freshworks/crayons/issues/679)) ([e66ed1d](https://github.com/freshworks/crayons/commit/e66ed1d432996f4f78eeccd23e302fc619df2569))

## [1.1.0-beta.3](https://github.com/freshworks/crayons/compare/@freshworks/crayons-custom-objects@1.1.0-beta.2...@freshworks/crayons-custom-objects@1.1.0-beta.3) (2022-09-01)

### Bug Fixes

- **form-builder:** fixed field add and search bug in form builder implementation ([#670](https://github.com/freshworks/crayons/issues/670)) ([51c2be1](https://github.com/freshworks/crayons/commit/51c2be1f0b78b09690b4028cddb78f8e5c2d4ffa))

### Features

- **hydrate-output-target:** output target to support SSR and upgraded to stencil 2.17 ([#671](https://github.com/freshworks/crayons/issues/671)) ([a422c16](https://github.com/freshworks/crayons/commit/a422c166c026e75fcd3c2664bdb2d9347d2a2cea))

## 1.1.0-beta.0 (2022-08-23)

### Features

- **custom-objects:** added custom objects to crayons via crayons-extended ([#640](https://github.com/freshworks/crayons/issues/640)) ([b1690d9](https://github.com/freshworks/crayons/commit/b1690d9830930a542a42b27dfa63a33521eb3cc5))
