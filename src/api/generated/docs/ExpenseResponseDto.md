# ExpenseResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Expense ID | [default to undefined]
**groupId** | **string** | Group ID | [default to undefined]
**title** | **string** | Expense title | [default to undefined]
**description** | **string** | Expense description | [optional] [default to undefined]
**amount** | **number** | Total expense amount | [default to undefined]
**paidByUserId** | **string** | User who paid for the expense | [default to undefined]
**paidByUserName** | **string** | Paid by user name | [optional] [default to undefined]
**date** | **string** | Expense date | [default to undefined]
**category** | **string** | Expense category | [optional] [default to undefined]
**splitType** | **string** | Split type | [default to undefined]
**splits** | [**Array&lt;ExpenseSplitResponseDto&gt;**](ExpenseSplitResponseDto.md) | Expense splits | [default to undefined]
**receiptImageUrl** | **string** | Receipt image URL | [optional] [default to undefined]
**location** | **string** | Expense location | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | Tags for categorization | [optional] [default to undefined]
**verified** | **boolean** | Whether expense is verified | [default to undefined]
**createdByUserId** | **string** | Created by user ID | [default to undefined]
**createdByUserName** | **string** | Created by user name | [optional] [default to undefined]
**createdAt** | **string** | Creation timestamp | [default to undefined]
**updatedAt** | **string** | Update timestamp | [default to undefined]

## Example

```typescript
import { ExpenseResponseDto } from './api';

const instance: ExpenseResponseDto = {
    id,
    groupId,
    title,
    description,
    amount,
    paidByUserId,
    paidByUserName,
    date,
    category,
    splitType,
    splits,
    receiptImageUrl,
    location,
    tags,
    verified,
    createdByUserId,
    createdByUserName,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
