# UpdateExpenseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Expense title | [optional] [default to undefined]
**description** | **string** | Expense description | [optional] [default to undefined]
**amount** | **number** | Total expense amount | [optional] [default to undefined]
**paidByUserId** | **string** | User who paid for the expense | [optional] [default to undefined]
**date** | **string** | Expense date | [optional] [default to undefined]
**category** | **string** | Expense category | [optional] [default to undefined]
**splitType** | **string** | Split type | [optional] [default to undefined]
**splits** | [**Array&lt;ExpenseSplitDto&gt;**](ExpenseSplitDto.md) | Updated expense splits (minimum 2 users) | [optional] [default to undefined]
**receiptImageUrl** | **string** | Receipt image URL | [optional] [default to undefined]
**verified** | **boolean** | Mark expense as verified | [optional] [default to undefined]
**location** | **string** | Expense location | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | Tags for categorization | [optional] [default to undefined]

## Example

```typescript
import { UpdateExpenseDto } from './api';

const instance: UpdateExpenseDto = {
    title,
    description,
    amount,
    paidByUserId,
    date,
    category,
    splitType,
    splits,
    receiptImageUrl,
    verified,
    location,
    tags,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
