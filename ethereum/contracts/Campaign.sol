// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;
contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint minimum, uint goal, uint durationInDays) public {
    address newCampaign = address(
      new Campaign(
        msg.sender, 
        minimum,
        goal,
        durationInDays
      ));
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }
}

contract Campaign {
  
    address public manager;
    struct Request {
      string description;
      address recipient;
      uint value;
      bool complete;
      uint approvalCount;
      mapping (address => bool) voters;
    }
    mapping (uint256 => Request) public requests;
    mapping (address => uint) public contributors;

    uint public minimumContribution;
    uint public goalAmount;
    uint public deadline;
    bool public isCanceled = false;
    bool public goalReached = false;
    uint256 public contributorsCount = 0;
    uint256 private currentIndexRequest = 0;

    constructor(address creator, uint minimumValue, uint goal, uint durationInDays) {
        manager = creator;
        minimumContribution = minimumValue;
        goalAmount = goal;
        deadline = block.timestamp + (durationInDays * 1 days);
    }

    function contribute() public payable {
      require(msg.sender != manager, "The manager cant contribute");
      require(msg.value > minimumContribution, "Ether value must be greater than minimum contribution.");

      if (contributors[msg.sender] == 0) {
        contributorsCount++;
      }
      contributors[msg.sender] += msg.value;

      if (address(this).balance >= goalAmount) {
        goalReached = true;
      }
    }

    function approveRequest(uint requestIndex) public {
      require(msg.sender != manager, "The manager cant approve");
      require(contributors[msg.sender] > 0, "You must be a contributer in order to approve requests");

      Request storage request = requests[requestIndex];
      require(!request.voters[msg.sender], "You already voted");

      request.voters[msg.sender] = true;
      request.approvalCount++;
    }

    function getRefund() public {
      require(isCanceled || block.timestamp > deadline, 'Refunds not available');
      require(!goalReached, "The goal was reached");
      uint amount = contributors[msg.sender];
      require(amount > 0, "You have no funds to refund");

      contributors[msg.sender] = 0;
      msg.sender.transfer(amount);
    }

    function getBalance() public restricted view returns (uint) {
      return address(this).balance;
    }

    function getRequestCount() public view returns (uint) {
      return currentIndexRequest;
    }

    //restricted functions

    function createRequest(string memory description, uint value, address recipient) public restricted {
      Request storage newRequestInStorage = requests[currentIndexRequest];
      newRequestInStorage.description = description;
      newRequestInStorage.value = value;
      newRequestInStorage.recipient = recipient;
      newRequestInStorage.complete = false;
      newRequestInStorage.approvalCount = 0;
      currentIndexRequest++;
    }

   function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (contributorsCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function cancelCampaign() public restricted {
      isCanceled = true;
    }

    modifier restricted() {
      require(msg.sender == manager);
      _;
    }
}