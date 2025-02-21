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
            'name': 'packagedapp1',
            'manifest_url': self.marionette.absolute_url('webapps/packaged1/manifest.webapp'),
            'title': 'Packaged app1'}

        # Install app
        self.apps.install_package(self.test_data['manifest_url'])

        # Wait for the notification to disappear
        system = System(self.marionette)
        system.wait_for_system_banner_displayed()
        system.wait_for_system_banner_not_displayed()

        self.apps.switch_to_displayed_app()
        self.homescreen.wait_for_app_icon_present(self.test_data['manifest_url'])

    def test_launch_app(self):
        """https://moztrap.mozilla.org/manage/case/6116/"""
        # Verify that the app icon is visible on one of the homescreen pages
        self.assertTrue(
            self.homescreen.is_app_installed(self.test_data['manifest_url']),
            'App %s not found on homescreen' % self.test_data['manifest_url'])

        # Click icon and wait for h1 element displayed
        self.homescreen.installed_app(self.test_data['manifest_url']).tap_icon()
        Wait(self.marionette).until(
            lambda m: m.title == self.test_data['title'])

    def tearDown(self):
        self.apps.uninstall(self.test_data['manifest_url'])

        GaiaTestCase.tearDown(self)
