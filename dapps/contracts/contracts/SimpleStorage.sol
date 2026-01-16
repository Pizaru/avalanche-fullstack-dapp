// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    address public owner;
    uint256 private storedValue;

    // Event saat owner ditetapkan/deploy
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // ketika ada update saya akan track perubahannya
    event ValueUpdated(uint256 newValue);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // simpan nilai ke blockchain (write)
    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    // membaca nilai dari blockchain (read) terakhir kali di update
    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
