// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

interface IFixStakingStrategy {
    function claim(uint256 _tokenId, address _withdrawToken, uint256 _minWithdrawTokenAmount) external;

    function sell(uint256 _tokenId, address _withdrawToken, uint256 _minWithdrawTokenAmount) external;
}
