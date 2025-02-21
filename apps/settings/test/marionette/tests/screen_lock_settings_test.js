'use strict';
var Settings = require('../app/app'),
    LockScreen = require('../../../../system/test/marionette/lib/lockscreen'),
    LockScreenPasscodeUnlockActions = require(
      '../../../../system/test/marionette/lib/' +
      'lockscreen_passcode_unlock_actions'),
    Promise = require('es6-promise').Promise, // jshint ignore:line
    assert = require('assert');

marionette('manipulate screenLock settings', function() {
  var client = marionette.client();
  var settingsApp;
  var screenLockPanel;
  var lockScreen;
  var actions;

  setup(function() {
    lockScreen = (new LockScreen()).start(client);
    settingsApp = new Settings(client);
    settingsApp.launch();
    // Navigate to the ScreenLock menu
    screenLockPanel = settingsApp.screenLockPanel;
    screenLockPanel.setupScreenLock();
  });

  test('lockscreen is enabled', function() {
    screenLockPanel.toggleScreenLock();

    assert.ok(screenLockPanel.isScreenLockEnabled(),
      'screenlock is enabled');
    assert.ok(screenLockPanel.isScreenLockChecked(),
      'screenlock is checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip('passcode can\'t be enabled when passcode is wrong', function() {
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode('1234', '5678');

    assert.ok(screenLockPanel.isPasscodeNotMatched());
    assert.ok(!screenLockPanel.isPasscodeLockEnabled(),
      'passcode is not enabled');
    assert.ok(!screenLockPanel.isPasscodeChecked(),
      'passcode is not checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip(
    'passcode is enabled, and we want to disable passcode ' +
    'but failed to enter the right code',
    function() {
      var oldCode = '1234';
      var newCode = '4567';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(oldCode, oldCode);
      screenLockPanel.tapCreatePasscode();

      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is checked');

      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(newCode);

      assert.ok(screenLockPanel.isPasscodeIncorrect(),
        'passcode is not correct');
      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is still enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is still checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip('passcode is enabled, and get disabled successfully', function() {
    var rightCode = '1234';
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(rightCode, rightCode);
    screenLockPanel.tapCreatePasscode();

    assert.ok(screenLockPanel.isPasscodeLockEnabled(),
      'passcode is enabled');
    assert.ok(screenLockPanel.isPasscodeChecked(),
      'passcode is checked');


    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(rightCode);

    assert.ok(!screenLockPanel.isPasscodeLockEnabled(),
      'passcode is disabled');
    assert.ok(!screenLockPanel.isPasscodeChecked(),
      'passcode is not checked');
  });

  test(
    'passcode is enabled and won\'t get disabled if you tap back button ' +
    'when we try to disable passcode directly',
    function() {
      var code = '1234';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(code, code);
      screenLockPanel.tapCreatePasscode();

      screenLockPanel.togglePasscodeLock();
      screenLockPanel.tapBackButton();

      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is still enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is still checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip(
    'passcode is enabled and won\'t get disabled if you tap back button ' +
    'when we try to disable screenlock directly',
    function() {
      var code = '1234';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(code, code);
      screenLockPanel.tapCreatePasscode();

      screenLockPanel.toggleScreenLock();
      screenLockPanel.tapBackButton();

      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is still enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is still checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip(
    'passcode is enabled and won\'t get disabled if you tap back button ' +
    'when we try to edit passcode',
    function() {
      var code = '1234';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(code, code);
      screenLockPanel.tapCreatePasscode();

      screenLockPanel.tapEditPasscode();
      screenLockPanel.tapBackButton();

      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is still enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is still checked');
  });

  test(
    'passcode is enabled, and we want to edit passcode ' +
    'but failed to enter the right code',
    function() {
      var oldCode = '0000';
      var newCode = '4567';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(oldCode, oldCode);
      screenLockPanel.tapCreatePasscode();

      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is checked');



      screenLockPanel.tapEditPasscode(newCode);

      screenLockPanel.waitForElement('passcodeIncorrectLabel');
      assert.ok(screenLockPanel.isPasscodeIncorrect(),
        'passcode is not correct');
      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is still enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is still checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip('passcode is enabled, then get changed successfully', function() {
    var oldCode = '1234';
    var newCode = '4567';
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(oldCode, oldCode);
    screenLockPanel.tapCreatePasscode();

    assert.ok(screenLockPanel.isPasscodeLockEnabled(),
      'passcode is enabled');
    assert.ok(screenLockPanel.isPasscodeChecked(),
      'passcode is checked');

    screenLockPanel.tapEditPasscode(oldCode);
    screenLockPanel.typePasscode(newCode, newCode);
    screenLockPanel.tapChangePasscode();

  });

  // Disabled for intermittent failures. Bug 983171
  test.skip(
    'passcode is enabled, and we want to disable lockscreen directly ' +
    'but failed to enter the right code',
    function() {
      var rightCode = '1234';
      var wrongCode = '5678';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(rightCode, rightCode);
      screenLockPanel.tapCreatePasscode();

      screenLockPanel.toggleScreenLock();
      screenLockPanel.typePasscode(wrongCode);

      assert.ok(screenLockPanel.isPasscodeIncorrect(),
        'passcode is not correct');
      assert.ok(screenLockPanel.isPasscodeLockEnabled(),
        'passcode is still enabled');
      assert.ok(screenLockPanel.isPasscodeChecked(),
        'passcode is still checked');
  });

  // Disabled for intermittent failures. Bug 983171
  test.skip('passcode is enabled, and we want to disable lockscreen directly',
    function() {
      var code = '1234';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(code, code);
      screenLockPanel.tapCreatePasscode();

      screenLockPanel.toggleScreenLock();
      screenLockPanel.typePasscode(code);

      assert.ok(!screenLockPanel.isScreenLockEnabled(),
        'screenlock is not enabled');
      assert.ok(!screenLockPanel.isScreenLockChecked(),
        'screenlock is not checked');
  });

  test('passcode is enabled, and we want to lock and unlock the device',
  function(done) {
    var code = '1337';
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(code, code);
    screenLockPanel.tapCreatePasscode();
    lockScreen.lock();

    new Promise(function(resolve) {
      actions = (new LockScreenPasscodeUnlockActions()).start(client);
      return lockScreen.slideToUnlock(resolve);
    })
    .then(function() {
      code.split('').forEach(function(keyChar) {
        actions.pressKey(keyChar);
      });
    })
    .then(function() {
      return actions.waitForUnlock();
    })
    .then(function() {
      settingsApp.switchTo();
      assert.ok(screenLockPanel.isScreenLockHeaderLabelVisible(),
        'has not returned to settings panel');
    })
    .then(done)
    .catch(done);
  });
});
