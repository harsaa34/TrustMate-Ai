# ExpenseListResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expenses** | [**Array&lt;ExpenseResponseDto&gt;**](ExpenseResponseDto.md) | List of expenses | [default to undefined]
**total** | **number** | Total count | [default to undefined]
**page** | **number** | Page number | [default to undefined]
**limit** | **number** | Items per page | [default to undefined]
**totalPages** | **number** | Total pages | [default to undefined]

## Example

```typescript
import { ExpenseListResponseDto } from './api';

const instance: ExpenseListResponseDto = {
    expenses,
    total,
    page,
    limit,
    totalPages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
