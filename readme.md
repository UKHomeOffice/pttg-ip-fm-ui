Income Proving Family Migration UI
==================================

pttg-ip-fm-ui

[![Docker Repository on Quay](https://quay.io/repository/ukhomeofficedigital/pttg-ip-fm-ui/status "Docker Repository on Quay")](https://quay.io/repository/ukhomeofficedigital/pttg-ip-fm-ui)

Overview
-

This is the Income Proving HMRC UI. Interfaces with the HMRC via [pttg-ip-api] to retrieve incomes and employments which calculates if a migrant has sufficient income to support migration of family members. 

This UI gathers the migrant details and displays the calculated result.

## Find Us

* [GitHub]
* [Quay.io]

### Technical Notes

The UI is implemented using Angular v1 on Node.Js.


### Infrastructure

This service is packaged as a Docker image and stored on [Quay.io]

This service currently runs in AWS and has an associated [kubernetes configuration]

## Building

This service is built using Gradle on Drone using [Drone yaml]

## Versioning

For the versions available, see the [tags on this repository].

## Authors

See the list of [contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENCE.md]
file for details.



[contributors]:                     https://github.com/UKHomeOffice/pttg-ip-fm-ui/graphs/contributors
[pttg-ip-api]:                      https://github.com/UKHomeOffice/pttg-ip-api
[Quay.io]:                          https://quay.io/repository/ukhomeofficedigital/pttg-ip-fm-ui
[kubernetes configuration]:         https://github.com/UKHomeOffice/kube-pttg-ip-fm-ui
[Drone yaml]:                       .drone.yml
[tags on this repository]:          https://github.com/UKHomeOffice/pttg-ip-fm-ui/tags
[LICENCE.md]:                       LICENCE.md
[GitHub]:                           https://github.com/UKHomeOffice/pttg-fm-ui
