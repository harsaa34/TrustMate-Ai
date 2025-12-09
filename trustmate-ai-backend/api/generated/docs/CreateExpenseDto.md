# CreateExpenseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Expense title | [default to undefined]
**description** | **string** | Expense description | [optional] [default to undefined]
**amount** | **number** | Total expense amount | [default to undefined]
**paidByUserId** | **string** | User who paid for the expense | [default to undefined]
**date** | **string** | Expense date | [default to undefined]
**category** | **string** | Expense category | [optional] [default to undefined]
**splitType** | **string** | Split type | [default to undefined]
**splits** | [**Array&lt;ExpenseSplitDto&gt;**](ExpenseSplitDto.md) | Expense splits for each user (minimum 2 users) | [default to undefined]
**receiptImageUrl** | **string** | Receipt image URL | [optional] [default to undefined]
**location** | **string** | Expense location | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | Tags for categorization | [optional] [default to undefined]

## Example

```typescript
import { CreateExpenseDto } from './api';

const instance: CreateExpenseDto = {
    title,
    description,
    amount,
    paidByUserId,
    date,
    category,
    splitType,
    splits,
    receiptImageUrl,
    location,
    tags,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
