// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title LeashMandate
/// @notice Enforces user-approved spending authority for an AI agent session key.
/// @dev This contract authorizes spending but deliberately transfers no funds or tokens.
contract LeashMandate {
    error NotOwner();
    error InvalidMandate();
    error Revoked();
    error Expired();
    error TargetNotAllowed();
    error AmountExceedsCap();
    error MandateAlreadyExists();
    error ZeroAmount();

    struct Mandate {
        address owner;
        address sessionKey;
        uint256 maxAmount;
        uint256 spentAmount;
        uint256 validUntil;
        bool revoked;
    }

    mapping(bytes32 mandateId => Mandate mandate) public mandates;
    mapping(bytes32 mandateId => mapping(address target => bool allowed)) public allowedTargets;

    event MandateRegistered(
        bytes32 indexed mandateId,
        address indexed owner,
        address indexed sessionKey,
        uint256 maxAmount,
        uint256 validUntil
    );

    event AuthorizationGranted(
        bytes32 indexed mandateId,
        address indexed sessionKey,
        address indexed target,
        uint256 amount,
        bytes32 paymentRef
    );

    event MandateRevoked(bytes32 indexed mandateId);

    function registerMandate(
        bytes32 mandateId,
        address sessionKey,
        uint256 maxAmount,
        uint256 validUntil,
        address[] calldata targets
    ) external {
        if (mandates[mandateId].owner != address(0)) revert MandateAlreadyExists();
        if (sessionKey == address(0) || maxAmount == 0 || validUntil <= block.timestamp || targets.length == 0) {
            revert InvalidMandate();
        }

        uint256 targetCount = targets.length;
        for (uint256 i; i < targetCount; ++i) {
            if (targets[i] == address(0)) revert InvalidMandate();
        }

        mandates[mandateId] = Mandate({
            owner: msg.sender,
            sessionKey: sessionKey,
            maxAmount: maxAmount,
            spentAmount: 0,
            validUntil: validUntil,
            revoked: false
        });

        for (uint256 i; i < targetCount; ++i) {
            allowedTargets[mandateId][targets[i]] = true;
        }

        emit MandateRegistered(mandateId, msg.sender, sessionKey, maxAmount, validUntil);
    }

    function authorizePayment(bytes32 mandateId, address target, uint256 amount, bytes32 paymentRef) external {
        Mandate storage mandate = mandates[mandateId];

        if (mandate.owner == address(0)) revert InvalidMandate();
        if (msg.sender != mandate.sessionKey) revert NotOwner();
        if (mandate.revoked) revert Revoked();
        if (block.timestamp >= mandate.validUntil) revert Expired();
        if (!allowedTargets[mandateId][target]) revert TargetNotAllowed();
        if (amount == 0) revert ZeroAmount();
        if (amount > mandate.maxAmount - mandate.spentAmount) revert AmountExceedsCap();

        mandate.spentAmount += amount;

        emit AuthorizationGranted(mandateId, msg.sender, target, amount, paymentRef);
    }

    function revokeMandate(bytes32 mandateId) external {
        Mandate storage mandate = mandates[mandateId];

        if (mandate.owner == address(0)) revert InvalidMandate();
        if (msg.sender != mandate.owner) revert NotOwner();
        if (mandate.revoked) revert Revoked();

        mandate.revoked = true;
        emit MandateRevoked(mandateId);
    }
}

