# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.4.0](https://github.com/TurboCheetah/succubus.space-api/compare/v2.3.2...v2.4.0) (2021-08-12)


### Features

* accurately log amount of entries scraped ([bd2730d](https://github.com/TurboCheetah/succubus.space-api/commit/bd2730d018be5682dea97bf766a3318565302971))
* add Doujin support ([2a55f7f](https://github.com/TurboCheetah/succubus.space-api/commit/2a55f7f200e0be3f63efca450ddf4734d22ceb89))
* Brand resolver ([72c9739](https://github.com/TurboCheetah/succubus.space-api/commit/72c973956335c5d58079416de5aacabe6b8e57bc))
* change docker-compose to use pre-built image ([2410015](https://github.com/TurboCheetah/succubus.space-api/commit/2410015ef7afb80061037a6dca1530e8c1c71d13))
* code organization ([b922700](https://github.com/TurboCheetah/succubus.space-api/commit/b922700cf065820fa67ebb9fded63dd6df1bc2d3))
* Monthly rank resolver ([f9a8e1f](https://github.com/TurboCheetah/succubus.space-api/commit/f9a8e1ff974b59078407b93fb63817c9868a062d))
* only store valid data in redis for an hour ([4296eea](https://github.com/TurboCheetah/succubus.space-api/commit/4296eea31f32f05336c4733062cf2286d78643d7))
* Remove express-status-monitor ([cc96b5b](https://github.com/TurboCheetah/succubus.space-api/commit/cc96b5bdd441b98b8a37280385656762257d12a1))
* remove un-used middlewares ([c0adb79](https://github.com/TurboCheetah/succubus.space-api/commit/c0adb7924bb2908e795f0597bcd08cd9bb493048))
* REST endpoint equivalents ([a2105e6](https://github.com/TurboCheetah/succubus.space-api/commit/a2105e6a9cfb58db11dc614593ee4266dadb6dd3))
* revamped MAL scrpaer ([5c1e4f6](https://github.com/TurboCheetah/succubus.space-api/commit/5c1e4f61fd93060a3a96837946a1f754751cdc99))
* search by producer name ([00e8fb2](https://github.com/TurboCheetah/succubus.space-api/commit/00e8fb27131e6fbdf4cbb1a6e2535017b30da72f))
* simplifly Dockerfile ([455087c](https://github.com/TurboCheetah/succubus.space-api/commit/455087c73325935650d5d9ea8de141cdae9d9c72))
* smaller docker image ([3086208](https://github.com/TurboCheetah/succubus.space-api/commit/30862088ff4eaa7dfca21c2c5d16c649f5bac84e))
* sort by popularity on tags endpoint ([c206b3b](https://github.com/TurboCheetah/succubus.space-api/commit/c206b3b4f10c4fa3f7efd7ba41048d09cf65771b))
* Tag resolver ([9cd0384](https://github.com/TurboCheetah/succubus.space-api/commit/9cd0384bd3adcffd0560cd3dfe853ca702baee3b))
* wrap functions into single function ([8111392](https://github.com/TurboCheetah/succubus.space-api/commit/8111392f80587d0a5c00f96d57203d3ff2a86040))


### Bug Fixes

* actually return data ([d7b6896](https://github.com/TurboCheetah/succubus.space-api/commit/d7b689620540e881440fa3d296d60354356a1852))
* always return a Hentai ([14dd56a](https://github.com/TurboCheetah/succubus.space-api/commit/14dd56a734d7d993c0c1a32648eb226168e8d01a))
* dataBuilder not returning values ([55f0bdc](https://github.com/TurboCheetah/succubus.space-api/commit/55f0bdca9464add69276f7bcc749c14158de9d2f))
* get all data when performing a searchByName ([f781bab](https://github.com/TurboCheetah/succubus.space-api/commit/f781babf90c17db808b5efab402085d3a59ed08d))
* mal scraper returning wrong result ([17f7aae](https://github.com/TurboCheetah/succubus.space-api/commit/17f7aaeeea7ac54c24ccf484da22712b5aca4c86))
* properly return ([0c111dc](https://github.com/TurboCheetah/succubus.space-api/commit/0c111dc829d4c5b7185cbf4e60ebd225da10f157))
* remove 404 status as it does not return JSON ([c0dd50b](https://github.com/TurboCheetah/succubus.space-api/commit/c0dd50b31c2e6e1e404b4a67c3e8e7cc63e0af89))
* remove JWT from config as it is not used ([484ed1d](https://github.com/TurboCheetah/succubus.space-api/commit/484ed1d788e5aa097f067cf13ced4ca0d06ecc40))
* remove version ([3167e17](https://github.com/TurboCheetah/succubus.space-api/commit/3167e17dfdd809c4d829272853a90d6f6654fa44))
* return match for exact match ([119eb31](https://github.com/TurboCheetah/succubus.space-api/commit/119eb318c49d02720f825828d215209ee346fa5e))
* scraper now works with new HAnime module ([466f604](https://github.com/TurboCheetah/succubus.space-api/commit/466f604f889aa6af9d2f56f66fbffd15514769ea))
* specify env file ([f047026](https://github.com/TurboCheetah/succubus.space-api/commit/f047026614a81a5f62c86c335dab364609829339))
* use correct logger ([5e2e007](https://github.com/TurboCheetah/succubus.space-api/commit/5e2e007bac919ac5d3219526a1cc08a23d9829d9))
* use databuilder in MongoDB middleware ([94791c7](https://github.com/TurboCheetah/succubus.space-api/commit/94791c7277d4c3f1f169a0f928dd19751f79806c))
* use MongoDB middleware on /random endpoint ([2b1a464](https://github.com/TurboCheetah/succubus.space-api/commit/2b1a46472c5ad8a7701dfdb2c6ef6ad7024afce1))
* vscode removed next() function ([76f1086](https://github.com/TurboCheetah/succubus.space-api/commit/76f1086c0c8cc23a3cddd0c53fbde3c12127459c))

### [2.3.2](https://github.com/TurboCheetah/succubus.space-api/compare/v2.3.1...v2.3.2) (2021-08-06)


### Features

* if query is a name search MongoDB with regex ([f6a39ba](https://github.com/TurboCheetah/succubus.space-api/commit/f6a39ba65973d343decdbfe8c2b4e6fa01bf1ea9))


### Bug Fixes

* Remove duplicate code ([d17de75](https://github.com/TurboCheetah/succubus.space-api/commit/d17de75903562aa432a04b1d2f61f8e447669aea))

### [2.3.1](https://github.com/TurboCheetah/succubus.space-api/compare/v2.3.0...v2.3.1) (2021-08-06)


### Bug Fixes

* Sentry running on dev envs ([c1864ac](https://github.com/TurboCheetah/succubus.space-api/commit/c1864ace7b9e5621845606692ba4f911eb4eced7))

## [2.3.0](https://github.com/TurboCheetah/succubus.space-api/compare/v2.2.1...v2.3.0) (2021-08-06)


### Features

* add MongoDB to GraphQL resolver ([e3bb5e1](https://github.com/TurboCheetah/succubus.space-api/commit/e3bb5e17dbb1d2576a2a42bcd87434c6d8a1d2aa))


### Bug Fixes

* clean up deps ([ed5aa4c](https://github.com/TurboCheetah/succubus.space-api/commit/ed5aa4c328f77ec822543cd1ec716bec8ea35372))
* properly integrate Sentry ([ed8c3c5](https://github.com/TurboCheetah/succubus.space-api/commit/ed8c3c55c9610bb0ccb3e177b740e8da51d9cd0f))

### [2.2.1](https://github.com/TurboCheetah/succubus.space-api/compare/v2.2.0...v2.2.1) (2021-08-05)


### Features

* add Sentry integration ([59d27e5](https://github.com/TurboCheetah/succubus.space-api/commit/59d27e501cc3c77735a98d579f54a459fe29ab72))
* add version to index ([143d90a](https://github.com/TurboCheetah/succubus.space-api/commit/143d90acec24902923d4c182cd62218f02c30fd5))


### Bug Fixes

* searching a name caused Mongo to die ([3dff95b](https://github.com/TurboCheetah/succubus.space-api/commit/3dff95b347463a75753a71ee45c8b5786bccb4e6))

## [2.2.0](https://github.com/TurboCheetah/succubus.space-api/compare/v2.1.0...v2.2.0) (2021-08-05)


### Features

* implement MongoDB intermediary layer ([3a0570d](https://github.com/TurboCheetah/succubus.space-api/commit/3a0570d9d91209a8b976b93a01d464ca1516833c))
* save data to MongoDB ([e2304a0](https://github.com/TurboCheetah/succubus.space-api/commit/e2304a0a8a7963eb875cdc2af51f39020fb9e83e))


### Bug Fixes

* cache middleware typo in file name ([ed6db8c](https://github.com/TurboCheetah/succubus.space-api/commit/ed6db8c5bbf69a2872d699aa1be74f550c16548f))

## [2.1.0](https://github.com/TurboCheetah/succubus.space-api/compare/v2.0.0...v2.1.0) (2021-08-05)


### Features

* implement graphql ([edcfb29](https://github.com/TurboCheetah/succubus.space-api/commit/edcfb29fad56e13c485ce378750e5ebc734a1a23))


### Bug Fixes

* include .env.test ([ae213d6](https://github.com/TurboCheetah/succubus.space-api/commit/ae213d625c3e3fa1987592e666b01008af4c985a))
* include scraper ([249c96e](https://github.com/TurboCheetah/succubus.space-api/commit/249c96edece869d860a1d21fb34b766666b4c78d))
* returning un-formatted data ([587eeb6](https://github.com/TurboCheetah/succubus.space-api/commit/587eeb6007a132a901571601b363787efb0dea36))

## [2.0.0](https://github.com/TurboCheetah/succubus.space-api/compare/v1.2.0...v2.0.0) (2021-08-03)

## [1.2.0](https://github.com/TurboCheetah/succubus.space-api/compare/v1.1.40...v1.2.0) (2021-08-03)


### Features

* Rewrite Succubus.Space in Typescript ([3d90c1a](https://github.com/TurboCheetah/succubus.space-api/commit/3d90c1a2d857fbf627af9723aa60c1e65ece81d1))
* use modulus ([4303bd3](https://github.com/TurboCheetah/succubus.space-api/commit/4303bd3e005c86c04c3789ac9f95a29006908118))

### [1.1.40](https://github.com/TurboCheetah/hentai-list/compare/v1.1.39...v1.1.40) (2021-08-01)


### Features

* implement ratelimiting ([1c83b28](https://github.com/TurboCheetah/hentai-list/commit/1c83b281bb2c7d597d244d0cb80ebfe163813536))

### [1.1.39](https://github.com/TurboCheetah/hentai-list/compare/v1.1.38...v1.1.39) (2021-07-30)


### Features

* add docs link to README ([0941d23](https://github.com/TurboCheetah/hentai-list/commit/0941d23808947f7fb9739f6afb6610dc77ceb153))


### Bug Fixes

* 404 ([94e5867](https://github.com/TurboCheetah/hentai-list/commit/94e58675996371f5e4e3b381fe855dabfd147bd2))

### [1.1.38](https://github.com/TurboCheetah/hentai-list/compare/v1.1.37...v1.1.38) (2021-07-30)


### Features

* remove useless MAL route ([86fb1d7](https://github.com/TurboCheetah/hentai-list/commit/86fb1d790024fc3f88cac6785f84dff0f51c6dde))

### [1.1.37](https://github.com/TurboCheetah/hentai-list/compare/v1.1.36...v1.1.37) (2021-07-30)


### Features

* cleanup utils ([8104055](https://github.com/TurboCheetah/hentai-list/commit/81040554e6b2bbb79d9667dc5e3e117011a6fd0c))

### [1.1.36](https://github.com/TurboCheetah/hentai-list/compare/v1.1.35...v1.1.36) (2021-07-30)


### Features

* use es6 import/export ([bacf098](https://github.com/TurboCheetah/hentai-list/commit/bacf098c351a434fc53ac2fdc688165655d406b8))

### [1.1.35](https://github.com/TurboCheetah/hentai-list/compare/v1.1.34...v1.1.35) (2021-07-30)


### Features

* /random endpoint ([e5414a2](https://github.com/TurboCheetah/hentai-list/commit/e5414a295b35e2e47a55c6b55ff7b3c33086e127))

### [1.1.34](https://github.com/TurboCheetah/hentai-list/compare/v1.1.33...v1.1.34) (2021-07-28)


### Features

* clean up console ([580a8a1](https://github.com/TurboCheetah/hentai-list/commit/580a8a1a45e86a537db1fc15fb2b7ab90d46a3a0))

### [1.1.33](https://github.com/TurboCheetah/hentai-list/compare/v1.1.32...v1.1.33) (2021-07-28)


### Features

* clean some stuff up ([1773720](https://github.com/TurboCheetah/hentai-list/commit/1773720a9cef246a86ffef4b32935aecc5a53796))

### [1.1.32](https://github.com/TurboCheetah/hentai-list/compare/v1.1.31...v1.1.32) (2021-07-28)


### Features

* cache searches to reduce ratelimiting ([bd8fcb1](https://github.com/TurboCheetah/hentai-list/commit/bd8fcb1878304c4066df7f6dba63f0e13a7833fa))

### [1.1.31](https://github.com/TurboCheetah/hentai-list/compare/v1.1.30...v1.1.31) (2021-07-27)


### Bug Fixes

* increase duration to prevent ratelimiting ([cbcf305](https://github.com/TurboCheetah/hentai-list/commit/cbcf305f7f49865cbe37b188f936e0c7d6b09e6c))

### [1.1.30](https://github.com/TurboCheetah/hentai-list/compare/v1.1.29...v1.1.30) (2021-07-27)


### Bug Fixes

* release date ([107abe0](https://github.com/TurboCheetah/hentai-list/commit/107abe02b61a31783339922efd0d70c704efa0e8))

### [1.1.29](https://github.com/TurboCheetah/hentai-list/compare/v1.1.28...v1.1.29) (2021-07-27)


### Bug Fixes

* handle new API changes ([e175897](https://github.com/TurboCheetah/hentai-list/commit/e175897641a4f95f64eac1b309127a4bcd7cf231))

### [1.1.28](https://github.com/TurboCheetah/hentai-list/compare/v1.1.27...v1.1.28) (2021-07-27)


### Bug Fixes

* grab titles in a better manner ([ed978e6](https://github.com/TurboCheetah/hentai-list/commit/ed978e6f4499e957f2c02be72eec5c1b24d2a478))

### [1.1.27](https://github.com/TurboCheetah/hentai-list/compare/v1.1.26...v1.1.27) (2021-07-27)


### Bug Fixes

* incorrect title being passed to malSearch ([f48e170](https://github.com/TurboCheetah/hentai-list/commit/f48e170c6456ba0b985c9263346e0356035a0e28))

### [1.1.26](https://github.com/TurboCheetah/hentai-list/compare/v1.1.25...v1.1.26) (2021-07-27)


### Features

* use new API endpoint ([d778854](https://github.com/TurboCheetah/hentai-list/commit/d77885472095082cd5c2d1c360ac4ee4f3b7974d))

### [1.1.25](https://github.com/TurboCheetah/hentai-list/compare/v1.1.24...v1.1.25) (2021-07-27)


### Features

* save streamURL ([1dca00e](https://github.com/TurboCheetah/hentai-list/commit/1dca00e4a33db1997b4afc92eb466aaa6a56237f))

### [1.1.24](https://github.com/TurboCheetah/hentai-list/compare/v1.1.23...v1.1.24) (2021-07-21)

### [1.1.23](https://github.com/TurboCheetah/hentai-list/compare/v1.1.22...v1.1.23) (2021-07-21)

### [1.1.22](https://github.com/TurboCheetah/hentai-list/compare/v1.1.21...v1.1.22) (2021-07-17)

### [1.1.21](https://github.com/TurboCheetah/hentai-list/compare/v1.1.20...v1.1.21) (2021-07-17)

### [1.1.20](https://github.com/TurboCheetah/hentai-list/compare/v1.1.19...v1.1.20) (2021-07-17)


### Features

* clean up ([eddfb07](https://github.com/TurboCheetah/hentai-list/commit/eddfb071c5048bb85f7981e0fa54ef8650198f8c))

### [1.1.19](https://github.com/TurboCheetah/hentai-list/compare/v1.1.18...v1.1.19) (2021-07-16)


### Bug Fixes

* update module functions ([b002c8b](https://github.com/TurboCheetah/hentai-list/commit/b002c8b694d5f76951a089391f03678ebb0a8b4a))

### [1.1.18](https://github.com/TurboCheetah/hentai-list/compare/v1.1.17...v1.1.18) (2021-07-16)


### Bug Fixes

* typo ([20f0987](https://github.com/TurboCheetah/hentai-list/commit/20f0987cfe41fb1929fa7d3f663178bc620aa2eb))

### [1.1.17](https://github.com/TurboCheetah/hentai-list/compare/v1.1.16...v1.1.17) (2021-07-16)


### Features

* clean stuff up ([1b9aae7](https://github.com/TurboCheetah/hentai-list/commit/1b9aae75734be0c07b6c52909a16ac708e8cd865))

### [1.1.16](https://github.com/TurboCheetah/hentai-list/compare/v1.1.15...v1.1.16) (2021-07-16)

### [1.1.15](https://github.com/TurboCheetah/hentai-list/compare/v1.1.14...v1.1.15) (2021-07-16)


### Features

* clean stuff up ([c049be2](https://github.com/TurboCheetah/hentai-list/commit/c049be2416b8ac8846557f36c741ebf2f9bd4214))

### [1.1.14](https://github.com/TurboCheetah/hentai-list/compare/v1.1.13...v1.1.14) (2021-07-15)


### Bug Fixes

* increase rate limit to prevent antibot ([a907070](https://github.com/TurboCheetah/hentai-list/commit/a90707071673719d0ab5141c2f20bafc534688b3))

### [1.1.13](https://github.com/TurboCheetah/hentai-list/compare/v1.1.12...v1.1.13) (2021-07-15)


### Bug Fixes

* clean Dockerfile ([2b2bb10](https://github.com/TurboCheetah/hentai-list/commit/2b2bb103eea80f342244ddbc29050ef83cf83e6f))
* typo in REDIS_HOST environment var ([8aba371](https://github.com/TurboCheetah/hentai-list/commit/8aba3716d3203328150751b6697eb5b65b4e9feb))

### [1.1.12](https://github.com/TurboCheetah/hentai-list/compare/v1.1.11...v1.1.12) (2021-07-15)


### Features

* clean up stuff ([2c152d5](https://github.com/TurboCheetah/hentai-list/commit/2c152d5f4acbd0bf929fbbb833c1d74d27e10e0c))
* clean yarn cache ([dcbed89](https://github.com/TurboCheetah/hentai-list/commit/dcbed89fe1e101584f51fb31bbe34fd72fef402c))
* use Bull queue ([3f5e05a](https://github.com/TurboCheetah/hentai-list/commit/3f5e05aec0feabbf33878a67ed7e503ca4575115))

### [1.1.11](https://github.com/TurboCheetah/hentai-list/compare/v1.1.10...v1.1.11) (2021-07-15)


### Bug Fixes

* Dockerfile index path ([8480660](https://github.com/TurboCheetah/hentai-list/commit/84806609833e4313581aeac54046da0c1202fe17))

### [1.1.10](https://github.com/TurboCheetah/hentai-list/compare/v1.1.9...v1.1.10) (2021-07-15)


### Features

* organization ([5f90ea9](https://github.com/TurboCheetah/hentai-list/commit/5f90ea9c8c59461c050fded58809fb1c57d02724))


### Bug Fixes

* docker-compose formatting ([d3575f8](https://github.com/TurboCheetah/hentai-list/commit/d3575f88a4c60d9acb7f42de05bf69a1f203dbde))

### [1.1.9](https://github.com/TurboCheetah/hentai-list/compare/v1.1.8...v1.1.9) (2021-07-15)


### Features

* prebuild docker image ([6bf8dde](https://github.com/TurboCheetah/hentai-list/commit/6bf8dde0a5fb4203eaab9dc7cf0cbc37d58800f7))

### [1.1.8](https://github.com/TurboCheetah/hentai-list/compare/v1.1.7...v1.1.8) (2021-07-15)


### Features

* update README ([3325c34](https://github.com/TurboCheetah/hentai-list/commit/3325c34b653b819a94130de0b25373711bad8c00))

### [1.1.7](https://github.com/TurboCheetah/hentai-list/compare/v1.1.6...v1.1.7) (2021-07-15)

### [1.1.6](https://github.com/TurboCheetah/hentai-list/compare/v1.1.5...v1.1.6) (2021-07-15)

### [1.1.5](https://github.com/TurboCheetah/hentai-list/compare/v1.1.4...v1.1.5) (2021-07-15)

### [1.1.4](https://github.com/TurboCheetah/hentai-list/compare/v1.1.3...v1.1.4) (2021-07-15)

### [1.1.3](https://github.com/TurboCheetah/hentai-list/compare/v1.1.2...v1.1.3) (2021-07-15)


### Bug Fixes

* only install production modules ([895d560](https://github.com/TurboCheetah/hentai-list/commit/895d5609e3fd7f538e114b82dad462f827de1bb6))

### [1.1.2](https://github.com/TurboCheetah/hentai-list/compare/v1.1.1...v1.1.2) (2021-07-15)


### Bug Fixes

* copy lockfile ([0f8e134](https://github.com/TurboCheetah/hentai-list/commit/0f8e134b236ca0a028591946d499783c3519f57c))

### [1.1.1](https://github.com/TurboCheetah/hentai-list/compare/v1.1.0...v1.1.1) (2021-07-15)

## 1.1.0 (2021-07-15)


### Features

* clean everything ([685175b](https://github.com/TurboCheetah/hentai-list/commit/685175bccb2b39c667bc330f38cc3ea3b7fcc7c1))
* clean up stuff ([3358ef1](https://github.com/TurboCheetah/hentai-list/commit/3358ef1004b39629a7c94284b37f03774ceb1896))

### [1.0.1](https://github.com/TurboCheetah/hentai-list/compare/v1.2.0...v1.0.1) (2021-07-15)
