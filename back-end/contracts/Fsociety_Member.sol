// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MemberPortal {
    uint256 totalMembers;

    event NewMember(address indexed member, uint256 timestamp, string message);

    struct Member {
        address member; // Endereço do usuário 
        string message; // Mensagem
        uint256 timestamp; // Data/hora 
    }

    Member[] members;

    constructor() {
        // O construtor está vazio, mas é mantido aqui para demonstração.
        // Pode ser removido se não houver lógica de inicialização.
    }

    function join(string memory _message) public {
        totalMembers += 1;

        members.push(Member(msg.sender, _message, block.timestamp));

        emit NewMember(msg.sender, block.timestamp, _message);
    }

    function getAllMembers() public view returns (Member[] memory) {
        return members;
    }

    function getTotalMembers() public view returns (uint256) {
        return totalMembers;
    }
}