# InsightResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalSpent** | **number** | Total spent in period | [default to undefined]
**averagePerExpense** | **number** | Average per expense | [default to undefined]
**expenseCount** | **number** | Number of expenses | [default to undefined]
**categories** | **object** | Top categories with amounts | [default to undefined]
**dailyBreakdown** | **object** | Daily spending breakdown | [default to undefined]

## Example

```typescript
import { InsightResponseDto } from './api';

const instance: InsightResponseDto = {
    totalSpent,
    averagePerExpense,
    expenseCount,
    categories,
    dailyBreakdown,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
