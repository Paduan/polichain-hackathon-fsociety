// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MemberPortal {
    uint256 public totalMembers;
    mapping(address => bool) public isMember;

    event NewMember(address indexed member, uint256 timestamp, string message);
    event MemberLeft(address indexed member);

    struct Member {
        address member;
        string message;
        uint256 timestamp;
    }

    Member[] public members;

    function join(string memory _message) public {
        require(!isMember[msg.sender], "Endereco ja e membro.");

        isMember[msg.sender] = true;
        totalMembers += 1;
        members.push(Member(msg.sender, _message, block.timestamp));

        emit NewMember(msg.sender, block.timestamp, _message);
    }

    function quit() public {
        require(isMember[msg.sender], "Nao e membro.");

        isMember[msg.sender] = false;
        removeMember(msg.sender);
        totalMembers -= 1;

        emit MemberLeft(msg.sender);
    }

    function getAllMembers() public view returns (Member[] memory) {
        return members;
    }

    function getTotalMembers() public view returns (uint256) {
        return totalMembers;
    }

    function removeMember(address memberAddress) internal {
        uint memberIndex = 0;
        bool found = false;

        // Encontrar o índice do membro
        for (uint i = 0; i < members.length; i++) {
            if (members[i].member == memberAddress) {
                memberIndex = i;
                found = true;
                break;
            }
        }

        require(found, "Membro nao encontrado.");

        // Remover o membro substituindo pelo último e removendo o último
        members[memberIndex] = members[members.length - 1];
        members.pop();
    }
}