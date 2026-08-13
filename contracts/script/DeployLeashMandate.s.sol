// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {LeashMandate} from "../src/LeashMandate.sol";

contract DeployLeashMandateScript is Script {
    function run() external returns (LeashMandate leash) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        leash = new LeashMandate();
        vm.stopBroadcast();

        console2.log("LeashMandate deployed at", address(leash));
    }
}

