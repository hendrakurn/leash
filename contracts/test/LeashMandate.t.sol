// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {LeashMandate} from "../src/LeashMandate.sol";

contract LeashMandateTest is Test {
    LeashMandate internal leash;

    address internal owner;
    address internal sessionKey;
    address internal rockBurger;
    address internal evilStore;
    address internal attacker;

    bytes32 internal constant MANDATE_ID = keccak256("leash-default-mandate");
    bytes32 internal constant PAYMENT_REF = keccak256("rock-burger-order-001");
    uint256 internal constant MAX_AMOUNT = 60_000;
    uint256 internal validUntil;

    event AuthorizationGranted(
        bytes32 indexed mandateId,
        address indexed sessionKey,
        address indexed target,
        uint256 amount,
        bytes32 paymentRef
    );
    event MandateRevoked(bytes32 indexed mandateId);

    function setUp() public {
        vm.warp(1_700_000_000);

        leash = new LeashMandate();
        owner = makeAddr("owner");
        sessionKey = makeAddr("sessionKey");
        rockBurger = makeAddr("rockBurger");
        evilStore = makeAddr("evilStore");
        attacker = makeAddr("attacker");
        validUntil = block.timestamp + 1 days;
    }

    function testRegisterMandateStoresFields() public {
        _registerDefaultMandate();

        (
            address storedOwner,
            address storedSessionKey,
            uint256 maxAmount,
            uint256 spentAmount,
            uint256 storedValidUntil,
            bool revoked
        ) = leash.mandates(MANDATE_ID);

        assertEq(storedOwner, owner);
        assertEq(storedSessionKey, sessionKey);
        assertEq(maxAmount, MAX_AMOUNT);
        assertEq(spentAmount, 0);
        assertEq(storedValidUntil, validUntil);
        assertFalse(revoked);
    }

    function testRegisterMandateSetsAllowedTargets() public {
        _registerDefaultMandate();

        assertTrue(leash.allowedTargets(MANDATE_ID, rockBurger));
        assertFalse(leash.allowedTargets(MANDATE_ID, evilStore));
    }

    function testCannotRegisterDuplicateMandate() public {
        _registerDefaultMandate();
        address[] memory targets = _singleTarget(rockBurger);

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.MandateAlreadyExists.selector);
        leash.registerMandate(MANDATE_ID, sessionKey, MAX_AMOUNT, validUntil, targets);
        vm.stopPrank();
    }

    function testCannotRegisterWithZeroSessionKey() public {
        address[] memory targets = _singleTarget(rockBurger);

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.InvalidMandate.selector);
        leash.registerMandate(MANDATE_ID, address(0), MAX_AMOUNT, validUntil, targets);
        vm.stopPrank();
    }

    function testCannotRegisterWithZeroCap() public {
        address[] memory targets = _singleTarget(rockBurger);

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.InvalidMandate.selector);
        leash.registerMandate(MANDATE_ID, sessionKey, 0, validUntil, targets);
        vm.stopPrank();
    }

    function testCannotRegisterWithInvalidExpiry() public {
        address[] memory targets = _singleTarget(rockBurger);

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.InvalidMandate.selector);
        leash.registerMandate(MANDATE_ID, sessionKey, MAX_AMOUNT, block.timestamp, targets);
        vm.stopPrank();
    }

    function testCannotRegisterWithoutTargets() public {
        address[] memory targets = new address[](0);

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.InvalidMandate.selector);
        leash.registerMandate(MANDATE_ID, sessionKey, MAX_AMOUNT, validUntil, targets);
        vm.stopPrank();
    }

    function testValidPaymentAuthorizationSucceeds() public {
        _registerDefaultMandate();

        vm.prank(sessionKey);
        leash.authorizePayment(MANDATE_ID, rockBurger, 52_000, PAYMENT_REF);

        assertEq(_spentAmount(), 52_000);
    }

    function testAuthorizationIncreasesSpentAmount() public {
        _registerDefaultMandate();

        vm.prank(sessionKey);
        leash.authorizePayment(MANDATE_ID, rockBurger, 20_000, PAYMENT_REF);

        vm.prank(sessionKey);
        leash.authorizePayment(MANDATE_ID, rockBurger, 32_000, keccak256("order-002"));

        assertEq(_spentAmount(), 52_000);
    }

    function testValidAuthorizationEmitsEvent() public {
        _registerDefaultMandate();

        vm.expectEmit(true, true, true, true, address(leash));
        emit AuthorizationGranted(MANDATE_ID, sessionKey, rockBurger, 52_000, PAYMENT_REF);

        vm.prank(sessionKey);
        leash.authorizePayment(MANDATE_ID, rockBurger, 52_000, PAYMENT_REF);
    }

    function testWrongSessionKeyReverts() public {
        _registerDefaultMandate();

        vm.startPrank(attacker);
        vm.expectRevert(LeashMandate.NotOwner.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 1_000, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
    }

    function testTargetOutsideAllowlistReverts() public {
        _registerDefaultMandate();

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.TargetNotAllowed.selector);
        leash.authorizePayment(MANDATE_ID, evilStore, 50_000, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
    }

    function testSingleAmountOverCapReverts() public {
        _registerDefaultMandate();

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.AmountExceedsCap.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 60_001, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
    }

    function testCumulativeAmountOverCapReverts() public {
        _registerDefaultMandate();

        vm.prank(sessionKey);
        leash.authorizePayment(MANDATE_ID, rockBurger, 52_000, PAYMENT_REF);

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.AmountExceedsCap.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 10_000, keccak256("order-over-cap"));
        vm.stopPrank();

        assertEq(_spentAmount(), 52_000);
    }

    function testExpiredMandateReverts() public {
        _registerDefaultMandate();
        vm.warp(validUntil + 1);

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.Expired.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 1_000, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
    }

    function testRevokedMandateReverts() public {
        _registerDefaultMandate();

        vm.prank(owner);
        leash.revokeMandate(MANDATE_ID);

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.Revoked.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 1_000, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
    }

    function testUnknownMandateReverts() public {
        bytes32 unknownMandate = keccak256("unknown");

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.InvalidMandate.selector);
        leash.authorizePayment(unknownMandate, rockBurger, 1_000, PAYMENT_REF);
        vm.stopPrank();
    }

    function testZeroAmountReverts() public {
        _registerDefaultMandate();

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.ZeroAmount.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 0, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
    }

    function testOwnerCanRevokeMandate() public {
        _registerDefaultMandate();

        vm.expectEmit(true, false, false, false, address(leash));
        emit MandateRevoked(MANDATE_ID);

        vm.prank(owner);
        leash.revokeMandate(MANDATE_ID);

        (,,,,, bool revoked) = leash.mandates(MANDATE_ID);
        assertTrue(revoked);
    }

    function testNonOwnerCannotRevokeMandate() public {
        _registerDefaultMandate();

        vm.startPrank(attacker);
        vm.expectRevert(LeashMandate.NotOwner.selector);
        leash.revokeMandate(MANDATE_ID);
        vm.stopPrank();

        (,,,,, bool revoked) = leash.mandates(MANDATE_ID);
        assertFalse(revoked);
    }

    function testRevokedMandateCannotAuthorize() public {
        _registerDefaultMandate();

        vm.prank(owner);
        leash.revokeMandate(MANDATE_ID);

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.Revoked.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 52_000, PAYMENT_REF);
        vm.stopPrank();

        assertEq(_spentAmount(), 0);
        (,,,,, bool revoked) = leash.mandates(MANDATE_ID);
        assertTrue(revoked);
    }

    function testAttackInvalidTargetLeavesStateAndEmitsNoAuthorization() public {
        _registerDefaultMandate();
        uint256 spentBefore = _spentAmount();
        bytes32 authorizationSignature = keccak256("AuthorizationGranted(bytes32,address,address,uint256,bytes32)");

        vm.recordLogs();
        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.TargetNotAllowed.selector);
        leash.authorizePayment(MANDATE_ID, evilStore, 50_000, keccak256("prompt-injection"));
        vm.stopPrank();
        Vm.Log[] memory logs = vm.getRecordedLogs();

        assertEq(_spentAmount(), spentBefore);
        for (uint256 i; i < logs.length; ++i) {
            assertTrue(logs[i].topics.length == 0 || logs[i].topics[0] != authorizationSignature);
        }
    }

    function testCannotRegisterZeroTarget() public {
        address[] memory targets = _singleTarget(address(0));

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.InvalidMandate.selector);
        leash.registerMandate(MANDATE_ID, sessionKey, MAX_AMOUNT, validUntil, targets);
        vm.stopPrank();
    }

    function testAuthorizationAtExactExpiryReverts() public {
        _registerDefaultMandate();
        vm.warp(validUntil);

        vm.startPrank(sessionKey);
        vm.expectRevert(LeashMandate.Expired.selector);
        leash.authorizePayment(MANDATE_ID, rockBurger, 1_000, PAYMENT_REF);
        vm.stopPrank();
    }

    function testSecondRevocationReverts() public {
        _registerDefaultMandate();

        vm.prank(owner);
        leash.revokeMandate(MANDATE_ID);

        vm.startPrank(owner);
        vm.expectRevert(LeashMandate.Revoked.selector);
        leash.revokeMandate(MANDATE_ID);
        vm.stopPrank();
    }

    function _registerDefaultMandate() internal {
        address[] memory targets = _singleTarget(rockBurger);
        vm.prank(owner);
        leash.registerMandate(MANDATE_ID, sessionKey, MAX_AMOUNT, validUntil, targets);
    }

    function _singleTarget(address target) internal pure returns (address[] memory targets) {
        targets = new address[](1);
        targets[0] = target;
    }

    function _spentAmount() internal view returns (uint256 spentAmount) {
        (,,, spentAmount,,) = leash.mandates(MANDATE_ID);
    }
}

