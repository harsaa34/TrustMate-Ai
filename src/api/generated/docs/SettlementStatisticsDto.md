# SettlementStatisticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalSettlements** | **number** | Total number of settlements | [default to undefined]
**totalAmount** | **number** | Total amount settled | [default to undefined]
**totalDebt** | **number** | Total outstanding debt | [default to undefined]
**pendingCount** | **number** | Number of pending settlements | [default to undefined]
**completedCount** | **number** | Number of completed settlements | [default to undefined]
**cancelledCount** | **number** | Number of cancelled settlements | [default to undefined]
**recentSettlements** | [**Array&lt;SettlementResponseDto&gt;**](SettlementResponseDto.md) | Recent settlements | [default to undefined]
**balances** | [**Array&lt;BalanceResponseDto&gt;**](BalanceResponseDto.md) | Current balances | [default to undefined]

## Example

```typescript
import { SettlementStatisticsDto } from './api';

const instance: SettlementStatisticsDto = {
    totalSettlements,
    totalAmount,
    totalDebt,
    pendingCount,
    completedCount,
    cancelledCount,
    recentSettlements,
    balances,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
