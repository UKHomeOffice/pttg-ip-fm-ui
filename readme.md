Income Proving Family Migration UI
==================================

pttg-ip-fm-ui

[![Docker Repository on Quay](https://quay.io/repository/ukhomeofficedigital/pttg-ip-fm-ui/status "Docker Repository on Quay")](https://quay.io/repository/ukhomeofficedigital/pttg-ip-fm-ui)

##Overview

This is the Income Proving UI. It consists of 2 pages; a Search page and a Results page.

This UI gathers the migrant(s) details and displays the appropriate calculated result.

This service talks with HMRC via [pttg-ip-api] to match an individual(s), retrieve incomes and employments and calculates if a migrant has sufficient income to support themselves and any associated dependants during their time in the UK. Data entered by the user defines how much data is considered for the calculation and the threshold income amount which should be applied to this data.

## Technical Notes

The UI is implemented using Angular v1 on Node.Js.

## Building

This service is built using Node JS on [Drone] using [Drone yaml].

## Infrastructure

This service is packaged as a Docker image and stored on [Quay.io]

This service is deployed by [Drone] onto a Kubernetes cluster running on the ACP platform using its [Kubernetes configuration]

## Running Locally

This assumes that node and npm are installed locally.

* Check out the project and run command `npm run init` to install dependencies
* Run command `npm run build` to build the project
* Run command `npm start` to start the UI

The UI should be available at localhost:8000 (which is defined in [server] as variable port).

Note that the UI needs a back-end to talk to, which is provided by [pttg-ip-api]. The location of the back-end is defined in [server] in variable apiRoot, which should be the default server port in pttg-ip-api.

## Dependencies

The full suite of components in the whole Income Proving service are:
* [pttg-ip-api]
* [pttg-ip-hmrc]
* [pttg-ip-hmrc-access-code]
* [pttg-ip-audit]
* [pttg-feedback]
* [pttg-feedback-export]
* [pttg-postgres]
* [pttg-ip-stats-ui]

## Find Us

* [GitHub]

## Versioning

For the versions available, see the [tags on this repository].

## Authors

See the list of [contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENCE.md] file for details.


[contributors]:                     https://github.com/UKHomeOffice/pttg-ip-fm-ui/graphs/contributors
[Quay.io]:                          https://quay.io/repository/ukhomeofficedigital/pttg-ip-fm-ui
[Kubernetes configuration]:         https://github.com/UKHomeOffice/kube-pttg-ip-fm-ui
[Drone]:                            https://drone.acp.homeoffice.gov.uk/UKHomeOffice/pttg-ip-fm-ui
[Drone yaml]:                       .drone.yml
[server]:                           .server.js
[tags on this repository]:          https://github.com/UKHomeOffice/pttg-ip-fm-ui/tags
[LICENCE.md]:                       LICENCE.md
[GitHub]:                           https://github.com/orgs/UKHomeOffice/teams/pttg
[pttg-ip-api]:                      https://github.com/UKHomeOffice/pttg-ip-api
[pttg-ip-hmrc]:                     https://github.com/UKHomeOffice/pttg-ip-hmrc
[pttg-ip-hmrc-access-code]:         https://github.com/UKHomeOffice/pttg-ip-hmrc-access-code
[pttg-ip-audit]:                    https://github.com/UKHomeOffice/pttg-ip-audit
[pttg-feedback]:                    https://github.com/UKHomeOffice/pttg-feedback
[pttg-feedback-export]:             https://github.com/UKHomeOffice/pttg-feedback-export
[pttg-postgres]:                    https://github.com/UKHomeOffice/pttg-postgres
[pttg-ip-stats-ui]:                 https://github.com/UKHomeOffice/pttg-ip-stats-ui
