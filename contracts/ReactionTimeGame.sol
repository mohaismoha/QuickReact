// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IQuickReactPoint {
    function mint(address to, uint256 amount) external;
}

contract ReactionTimeGame is Pausable, Ownable {
    using ECDSA for bytes32;

    IQuickReactPoint public token;
    uint256 public maxSignatureAge = 300;
    mapping(address => uint256) public nonces;

    event Claimed(address indexed player, uint256 reactionTime, uint256 points, uint256 nonce);

    bytes32 public constant CLAIM_TYPEHASH = keccak256("Claim(uint256 reactionTime,uint256 timestamp,uint256 nonce,address contractAddress,uint256 chainId)");
    bytes32 public DOMAIN_SEPARATOR;

    constructor(address tokenAddress) Ownable(msg.sender) {
        token = IQuickReactPoint(tokenAddress);
    }
    
    function setDomainSeparator(uint256 chainId) public onlyOwner {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("QuickReact")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function calculatePoints(uint256 reactionTime) public pure returns (uint256) {
        if (reactionTime < 300) return 5;
        if (reactionTime < 500) return 3;
        return 1;
    }

    function claim(
        uint256 reactionTime,
        uint256 timestamp,
        uint256 nonce,
        bytes calldata signature
    ) external whenNotPaused {
        require(block.timestamp >= timestamp, "Invalid timestamp");
        require(block.timestamp - timestamp <= maxSignatureAge, "Signature expired");
        require(nonce == nonces[msg.sender], "Invalid nonce");

        bytes32 structHash = keccak256(abi.encode(
            CLAIM_TYPEHASH,
            reactionTime,
            timestamp,
            nonce,
            address(this),
            block.chainid
        ));

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        address recovered = ECDSA.recover(digest, signature);

        require(recovered == msg.sender, "Invalid signature");

        nonces[msg.sender] = nonce + 1;

        uint256 points = calculatePoints(reactionTime);
        require(points > 0, "No points");

        token.mint(msg.sender, points * 1e18);

        emit Claimed(msg.sender, reactionTime, points, nonce);
    }

    function setMaxSignatureAge(uint256 secs) external onlyOwner {
        maxSignatureAge = secs;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
