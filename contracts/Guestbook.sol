// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Onchain Guestbook
/// @notice Anyone can sign the guestbook with a short message. Every entry is
///         stored permanently on-chain together with the signer's address and
///         the block timestamp.
contract Guestbook {
    /// @notice One guestbook entry.
    struct Entry {
        address signer; // who signed
        string message; // what they wrote
        uint256 timestamp; // when (block time)
    }

    /// @dev All entries, in the order they were signed.
    Entry[] private entries;

    /// @notice Emitted whenever someone signs the guestbook.
    event Signed(address indexed signer, string message, uint256 timestamp);

    /// @notice Maximum allowed message length (in bytes) to keep gas bounded.
    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    /// @notice Sign the guestbook with `message`.
    /// @param message The text to store. Must be non-empty and within the limit.
    function sign(string calldata message) external {
        bytes memory raw = bytes(message);
        require(raw.length > 0, "Guestbook: empty message");
        require(raw.length <= MAX_MESSAGE_LENGTH, "Guestbook: message too long");

        entries.push(
            Entry({
                signer: msg.sender,
                message: message,
                timestamp: block.timestamp
            })
        );

        emit Signed(msg.sender, message, block.timestamp);
    }

    /// @notice Total number of entries signed so far.
    function total() external view returns (uint256) {
        return entries.length;
    }

    /// @notice Return every entry. Convenient for small guestbooks / frontends.
    function getMessages() external view returns (Entry[] memory) {
        return entries;
    }

    /// @notice Return a single entry by index.
    function getEntry(uint256 index) external view returns (Entry memory) {
        require(index < entries.length, "Guestbook: index out of range");
        return entries[index];
    }
}
