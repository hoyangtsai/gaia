# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from marionette_driver import Wait

from gaiatest import GaiaTestCase
from gaiatest.apps.homescreen.app import Homescreen
from gaiatest.apps.homescreen.regions.confirm_install import ConfirmInstall
from gaiatest.apps.system.app import System


class TestLaunchApp(GaiaTestCase):

    def setUp(self):
        GaiaTestCase.setUp(self)
        self.connect_to_local_area_network()

        self.homescreen = Homescreen(self.marionette)
        self.apps.switch_to_displayed_app()

        self.test_data = {
            'name': 'Mozilla QA WebRT Tester',
            'manifest': self.marionette.absolute_url('webapps/mozqa.com/manifest.webapp')
        }

        self.apps.install(self.test_data['manifest'])

        # Wait for the notification to disappear
        system = System(self.marionette)
        system.wait_for_system_banner_displayed()
        system.wait_for_system_banner_not_displayed()

        self.apps.switch_to_displayed_app()
        self.homescreen.wait_for_app_icon_present(self.test_data['manifest'])

    def test_launch_app(self):
        # Verify that the app icon is visible on one of the homescreen pages
        self.assertTrue(
            self.homescreen.is_app_installed(self.test_data['manifest']),
            'App %s not found on homescreen' % self.test_data['manifest'])

        # Click icon and wait for h1 element displayed
        self.homescreen.installed_app(self.test_data['manifest']).tap_icon()
        Wait(self.marionette).until(
            lambda m: m.title == self.test_data['name'])

    def tearDown(self):
        self.apps.uninstall(self.test_data['manifest'])

        GaiaTestCase.tearDown(self)
