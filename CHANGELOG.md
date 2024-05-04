# [1.1.0](https://github.com/jonathan-lopes/api-cubosfi/compare/v1.0.0...v1.1.0) (2024-05-04)


### Bug Fixes

* fix the error caused when there is no record in the table by setting total_pages to 1 ([e53c76a](https://github.com/jonathan-lopes/api-cubosfi/commit/e53c76a89e82700513bfce4407f165b40df6f366))


### Features

* add middleware for pagination ([752480c](https://github.com/jonathan-lopes/api-cubosfi/commit/752480c78de25ad1cac9f4a388d2a54d7c6bd5d9))
* add pagination in billings route ([7956d5d](https://github.com/jonathan-lopes/api-cubosfi/commit/7956d5d2a8ec7582c4fb8a533acd247330cacfa2))
* add pagination to the customer list and make small refactorings ([332d067](https://github.com/jonathan-lopes/api-cubosfi/commit/332d0672ff902c6e989d92c22c78aed82b11cd44))
* add validation for customer route paging query parameters ([79722fe](https://github.com/jonathan-lopes/api-cubosfi/commit/79722fec4e60784b41d92e58d20510b9b145451d))
* changes the due field type to datetime ([b5518d9](https://github.com/jonathan-lopes/api-cubosfi/commit/b5518d92e62af685ee92cbde1a9c258d6d94d7ba))

# 1.0.0 (2024-03-12)


### Bug Fixes

* add a max of 128 characters to the description property ([30ba71f](https://github.com/jonathan-lopes/api-cubosfi/commit/30ba71fcde7fcb38a710e91aa0f88ca96e53283f))
* add transports function to not return mongodb logger when NODE_ENV for test ([23c30bc](https://github.com/jonathan-lopes/api-cubosfi/commit/23c30bcead45042a6f6bea27221c34ef9b3e6c68))
* change of développement for testing and checking the environment variable ([7f24c83](https://github.com/jonathan-lopes/api-cubosfi/commit/7f24c83ce9e0e00ce7da48423bb53f00bb0e4876))
* check if refresh token is expired ([9b1e9cf](https://github.com/jonathan-lopes/api-cubosfi/commit/9b1e9cfce51af7cb9936921ec466b6126e49481b))
* clear function of sut customer deleted in users table ([6246851](https://github.com/jonathan-lopes/api-cubosfi/commit/624685161f3e51966004755c5cd55f59c786e86c))
* faker.phone.number(format) is deprecated ([554df99](https://github.com/jonathan-lopes/api-cubosfi/commit/554df99f12b7ef1e43220a7805e8993d03b6560a))
* fix testbed with corrupted migrations ([ac69f8c](https://github.com/jonathan-lopes/api-cubosfi/commit/ac69f8cbbd7cdbe3c185c34b803e24787491bc47))
* fix the regex to generate numbers in the range 1 to 9 ([bcc5bb8](https://github.com/jonathan-lopes/api-cubosfi/commit/bcc5bb8d8236ab15f3697f968943ec1ada5da075))
* fix the regex to generate numbers in the range 1 to 9 ([b544248](https://github.com/jonathan-lopes/api-cubosfi/commit/b5442489925e921c1ee214b3d0574c7f2f97120b))
* i replaced setTimeout with useFakeTimers ([a8d12bd](https://github.com/jonathan-lopes/api-cubosfi/commit/a8d12bdda1677a12411b3117453d3284cf2d6e57))
* ignoreRestSiblings invalid rule ([f079891](https://github.com/jonathan-lopes/api-cubosfi/commit/f079891f48d034170ec01548fccec59cd7a0722d))
* logtail is no longer mandatory in production ([5f404c8](https://github.com/jonathan-lopes/api-cubosfi/commit/5f404c8e07898f7c3ba85a206cd943c0614cac9e))
* logtail is no longer mandatory in production ([aa7ee02](https://github.com/jonathan-lopes/api-cubosfi/commit/aa7ee0268bb92286fd0e8cdb31b37ea876afd1cc))
* refactor in helper logger ([7e986a7](https://github.com/jonathan-lopes/api-cubosfi/commit/7e986a72674385ab02fd69890fe2c1405bfdfbe1))
* refactor in helper logger ([490ba15](https://github.com/jonathan-lopes/api-cubosfi/commit/490ba153991e0fb57c0389910c7c664508eb12a7))
* remove the test to find out if the address object is empty ([1dacaa2](https://github.com/jonathan-lopes/api-cubosfi/commit/1dacaa24be2fbb141c522ef67ad91900a7635d22))
* remove use of uuid package ([412aa95](https://github.com/jonathan-lopes/api-cubosfi/commit/412aa9567b00843dad21d1b30940f75fe2757fd4))
* sets a uuid for the id column in an insert ([5be9527](https://github.com/jonathan-lopes/api-cubosfi/commit/5be9527da92bda0b3a630d8e85b1c60cf988e8a6))
* sqlite3 database does not support custom functions ([4168c71](https://github.com/jonathan-lopes/api-cubosfi/commit/4168c712f5e82feb6af91dc38743aa69ba0f5207))
* validates the query entries and removes the cpf query ([c37b799](https://github.com/jonathan-lopes/api-cubosfi/commit/c37b799a7551bd3378e18a89676751e7dbf7f6a5))


### Documentation

* documents the new query parameters ([25f4fed](https://github.com/jonathan-lopes/api-cubosfi/commit/25f4fed30787dcd2ae1f9a5c7f1bae4fd4062785))
* documents the new query parameters ([360bd02](https://github.com/jonathan-lopes/api-cubosfi/commit/360bd02bacab9c712ddd9714da8746343ccb91ab))


### Features

* add a limit for compression of 10kb ([11331b9](https://github.com/jonathan-lopes/api-cubosfi/commit/11331b942d718fc1459e561ff99244c0d5c02ff1))
* add a sut class family ([263cad4](https://github.com/jonathan-lopes/api-cubosfi/commit/263cad48ce2a886dd3495f90b70806d903493e77))
* add API error family ([5358cc6](https://github.com/jonathan-lopes/api-cubosfi/commit/5358cc6c1d82c92864fd837b30611e5f12a5d90a))
* add config for requests ([1932d88](https://github.com/jonathan-lopes/api-cubosfi/commit/1932d8837ee30d0e22fa4a2693186056ed7a2fb8))
* add configuration for development mode ([9e960b3](https://github.com/jonathan-lopes/api-cubosfi/commit/9e960b3d3fb50dc84c04c767caa92a6a9f0d4f61))
* add controller refresh token ([e79239f](https://github.com/jonathan-lopes/api-cubosfi/commit/e79239f4925391a98b547c5536a8aba0ef696484))
* add error middleware ([8a9bbaa](https://github.com/jonathan-lopes/api-cubosfi/commit/8a9bbaa85a594ae510e5f48995216b9d097215f0))
* add extension to psql for UUID generation ([cbaa630](https://github.com/jonathan-lopes/api-cubosfi/commit/cbaa630e875025b9000e5c423a01ba8b01eaebbb))
* add function that returns token for authenticated routes ([14db1c6](https://github.com/jonathan-lopes/api-cubosfi/commit/14db1c6eee3405d1d0970510182d23e46214c094))
* add function to check if UUID is valid ([1a24b58](https://github.com/jonathan-lopes/api-cubosfi/commit/1a24b582c3dceb3dc39f251ac777f3825a90c653))
* add helper function to read environment variable based on NODE_ENV ([d2acc9b](https://github.com/jonathan-lopes/api-cubosfi/commit/d2acc9b6b0cc96a6bf5e9f9edc3d41f2e3eab703))
* add helper function to read knexfile based on NODE_ENV ([1f6a6a1](https://github.com/jonathan-lopes/api-cubosfi/commit/1f6a6a1d5f125f8c90f752612ac815d7e8b5506c))
* add job to check bills overdue ([3cc8fc5](https://github.com/jonathan-lopes/api-cubosfi/commit/3cc8fc5549178ce83b672cd96e7ceee887b7e861))
* add job to delete expired refresh token ([79f729a](https://github.com/jonathan-lopes/api-cubosfi/commit/79f729af59d2ef8bac36eca6077c08ee8bc21384))
* add logger ([df1d3a4](https://github.com/jonathan-lopes/api-cubosfi/commit/df1d3a4c5a4454687c8577dacab1ee39eefac111))
* add logger in error middleware ([0f3d523](https://github.com/jonathan-lopes/api-cubosfi/commit/0f3d523c9b9aea1dfbb395ce099f16e8fcffc298))
* add middleware to check if the HTTP method is supported by the route ([6fd3cee](https://github.com/jonathan-lopes/api-cubosfi/commit/6fd3ceea52fec80d5773097b9e1fde22d62ad935))
* add mongodb transport ([6bd8669](https://github.com/jonathan-lopes/api-cubosfi/commit/6bd86694b793627672793b84922cc5cc9b82e0fa))
* add more filters to list billings ([49c0d1e](https://github.com/jonathan-lopes/api-cubosfi/commit/49c0d1ec621b1c7212811c7cdfc04c02d2b028d0))
* add more filters to list billings ([cf38367](https://github.com/jonathan-lopes/api-cubosfi/commit/cf3836740132bf556e5fe18333e414d86cf5432d))
* add morgan middleware ([f33bab6](https://github.com/jonathan-lopes/api-cubosfi/commit/f33bab6afc831035e1833609db5cc5334a33bdf0))
* add multiple query params ([fb8b4d2](https://github.com/jonathan-lopes/api-cubosfi/commit/fb8b4d28cb6d22dc9a81b5b9ccde975586bce85e))
* add new class, MethodNotImplementedError, the ApiError class family ([200b00e](https://github.com/jonathan-lopes/api-cubosfi/commit/200b00eaf6e3fc4433773a7765d61af6d4a5e06e))
* add package node-schedule ([fef13b8](https://github.com/jonathan-lopes/api-cubosfi/commit/fef13b836dc6ed61be00b2323e0fd1a2b4c3630c))
* add randomData file to create random data ([07e76aa](https://github.com/jonathan-lopes/api-cubosfi/commit/07e76aa5f28a7e3ffb6a47d98c9d1005a2fa9892))
* add rate limit ([99eb60a](https://github.com/jonathan-lopes/api-cubosfi/commit/99eb60ae6bf53cebe1dc8a76a1a447a8a38c1f33))
* add refresh token creation and sending ([3bd2619](https://github.com/jonathan-lopes/api-cubosfi/commit/3bd261912032ce785097bddc648e0568ce7acc9d))
* add refresh token validation scheme ([858f3b5](https://github.com/jonathan-lopes/api-cubosfi/commit/858f3b5864dd7cdf041bd2f52f1823f69fdb70bd))
* add refresh-token route ([350695c](https://github.com/jonathan-lopes/api-cubosfi/commit/350695c44049005006f36ed193639d998a00e7a2))
* add regex for zip code validation ([10a4745](https://github.com/jonathan-lopes/api-cubosfi/commit/10a474517ac60ac0aa791849cbd36ee43b890d59))
* add the new query parameters to the billing validation schema ([76ea85f](https://github.com/jonathan-lopes/api-cubosfi/commit/76ea85fcadcdafbccf1b6486f158dc8bcb673a91))
* add the new query parameters to the billing validation schema ([0225f9e](https://github.com/jonathan-lopes/api-cubosfi/commit/0225f9ed1745ea8357121a502dcbb8f58f210cd4))
* add the pm2 configuration file ([0b32979](https://github.com/jonathan-lopes/api-cubosfi/commit/0b32979ee2f53c30e52d1e85f8bb4effcc4a9736))
* add timezone to timestamp and remove json formatting ([1114cdb](https://github.com/jonathan-lopes/api-cubosfi/commit/1114cdb0d74f7115a8602feeb7610949b31762d8))
* add trigger updated_at ([9d08b1c](https://github.com/jonathan-lopes/api-cubosfi/commit/9d08b1c35ad96b6a9970a92cf09a3fed44fa2c98))
* add user token table migration ([2568673](https://github.com/jonathan-lopes/api-cubosfi/commit/2568673824bdd826071f64a9e374fae69df9290e))
* add uuid generation ([d867433](https://github.com/jonathan-lopes/api-cubosfi/commit/d867433d9f7e8355e568c242761bc17d55d87d95))
* add validation scheme for billing queries ([062fd83](https://github.com/jonathan-lopes/api-cubosfi/commit/062fd83aefa774b5c353e908727d1bf8a7557d70))
* allow the x-no-compression header to not compress the data ([7be67d9](https://github.com/jonathan-lopes/api-cubosfi/commit/7be67d97997dcb345fc56433c146c4e4268c2c4b))
* change for the id to be generated using uuid ([bcf58f3](https://github.com/jonathan-lopes/api-cubosfi/commit/bcf58f3ef712cf85aa4fdbb25609590db8a67668))
* more input size validations ([33a8e93](https://github.com/jonathan-lopes/api-cubosfi/commit/33a8e93ece19c998537995df2ff848e694743df4))
* refactor the routes file to use disallowed methods middleware ([17b25d0](https://github.com/jonathan-lopes/api-cubosfi/commit/17b25d0a193c1eeb78f326c8f301b7a1eeab6323))
* register compression middleware in middleware to serve favicon ([33deeab](https://github.com/jonathan-lopes/api-cubosfi/commit/33deeabefa6847eb2143eac0dcc083ae7c75fa1f))
* register error middleware and import express-async-errors ([9bd9868](https://github.com/jonathan-lopes/api-cubosfi/commit/9bd98687c59bd4d4aeb2d8c6c95a24f666d7a1ba))
* register rate limiter middleware ([c06504e](https://github.com/jonathan-lopes/api-cubosfi/commit/c06504e3afa3cd87359566174ae69cda2da6d5dc))
* register the morgan middleware ([dd0393a](https://github.com/jonathan-lopes/api-cubosfi/commit/dd0393a5fd12ae3fc999f43da21a11bd16cf78fc))
* use scheduled jobs ([202632b](https://github.com/jonathan-lopes/api-cubosfi/commit/202632b9ec963a8726e42ad895f37da72d00de72))
* uUID generation by uuid_generate_v4() ([de3c36a](https://github.com/jonathan-lopes/api-cubosfi/commit/de3c36ab45399e73a2e2c93f9730538acfd8ea22))


### Performance Improvements

* change in billing test ([ce308d0](https://github.com/jonathan-lopes/api-cubosfi/commit/ce308d013e8f95af112bf6bbde54f175b0a45f8b))
* **jobs:** remove the promises array and use the map to be passed to promise.all ([9798e1d](https://github.com/jonathan-lopes/api-cubosfi/commit/9798e1d3ed0d879cd59539a623c4482d762cfe3a))
* **jobs:** removes the loop that created an array of promises ([4e2fea0](https://github.com/jonathan-lopes/api-cubosfi/commit/4e2fea0651b01e862780fdbf2be953d761777a5e))
* remove switch case by returning object key ([2c9fa95](https://github.com/jonathan-lopes/api-cubosfi/commit/2c9fa95755f864fff4d446c533c162c9328d17a1))
* remove unnecessary loops, and eliminate unnecessary code snippets ([68eed14](https://github.com/jonathan-lopes/api-cubosfi/commit/68eed1471fa657dc00cd7cadf3dd1607130afc3f))


### Reverts

* put package.json back into .releaserc assets ([1d5ac28](https://github.com/jonathan-lopes/api-cubosfi/commit/1d5ac2835871a718abbd0892f370c28bb9336972))


### BREAKING CHANGES

* the query parameters greater_than_value and less_than_value are replaced by
value_gt and value_lt
* the query parameters greater_than_value and less_than_value are replaced by
value_gt and value_lt
