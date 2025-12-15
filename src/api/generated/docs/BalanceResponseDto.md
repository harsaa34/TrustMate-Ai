# BalanceResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** | User ID | [default to undefined]
**userName** | **string** | User name | [default to undefined]
**amount** | **number** | Net balance (negative &#x3D; owes, positive &#x3D; is owed) | [default to undefined]
**paidAmount** | **number** | Total amount paid by user | [default to undefined]
**owedAmount** | **number** | Total amount owed by user | [default to undefined]
**currency** | **string** | Currency | [default to undefined]

## Example

```typescript
import { BalanceResponseDto } from './api';

const instance: BalanceResponseDto = {
    userId,
    userName,
    amount,
    paidAmount,
    owedAmount,
    currency,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
