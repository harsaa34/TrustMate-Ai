# ExpenseSplitResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** | User ID for this split | [default to undefined]
**amount** | **number** | Amount for this user | [default to undefined]
**percentage** | **number** | Percentage for this user | [optional] [default to undefined]
**shares** | **number** | Shares for this user | [optional] [default to undefined]
**note** | **string** | Note for this split | [optional] [default to undefined]

## Example

```typescript
import { ExpenseSplitResponseDto } from './api';

const instance: ExpenseSplitResponseDto = {
    userId,
    amount,
    percentage,
    shares,
    note,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
