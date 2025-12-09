# ExpensesApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**expenseControllerCreateExpense**](#expensecontrollercreateexpense) | **POST** /api/groups/{groupId}/expenses | Create a new expense in a group|
|[**expenseControllerDeleteExpense**](#expensecontrollerdeleteexpense) | **DELETE** /api/groups/{groupId}/expenses/{expenseId} | Delete an expense|
|[**expenseControllerGetBalances**](#expensecontrollergetbalances) | **GET** /api/groups/{groupId}/expenses/balances | Calculate balances for all group members|
|[**expenseControllerGetExpenseById**](#expensecontrollergetexpensebyid) | **GET** /api/groups/{groupId}/expenses/{expenseId} | Get expense by ID|
|[**expenseControllerGetExpenseSummary**](#expensecontrollergetexpensesummary) | **GET** /api/groups/{groupId}/expenses/summary | Get expense summary for a group|
|[**expenseControllerGetGroupExpenses**](#expensecontrollergetgroupexpenses) | **GET** /api/groups/{groupId}/expenses | Get all expenses for a group with filters|
|[**expenseControllerGetSpendingInsights**](#expensecontrollergetspendinginsights) | **GET** /api/groups/{groupId}/expenses/insights | Get spending insights for a group|
|[**expenseControllerUpdateExpense**](#expensecontrollerupdateexpense) | **PUT** /api/groups/{groupId}/expenses/{expenseId} | Update an expense|
|[**expenseControllerUploadReceipt**](#expensecontrolleruploadreceipt) | **POST** /api/groups/{groupId}/expenses/upload-receipt | Upload receipt image|
|[**expenseControllerVerifyReceipt**](#expensecontrollerverifyreceipt) | **POST** /api/groups/{groupId}/expenses/{expenseId}/verify | Verify receipt for an expense|

# **expenseControllerCreateExpense**
> ExpenseResponseDto expenseControllerCreateExpense(createExpenseDto)

Create a new expense in a group

### Example

```typescript
import {
    ExpensesApi,
    Configuration,
    CreateExpenseDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)
let createExpenseDto: CreateExpenseDto; //

const { status, data } = await apiInstance.expenseControllerCreateExpense(
    groupId,
    createExpenseDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createExpenseDto** | **CreateExpenseDto**|  | |
| **groupId** | [**string**] | Group ID | defaults to undefined|


### Return type

**ExpenseResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerDeleteExpense**
> object expenseControllerDeleteExpense()

Delete an expense

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)
let expenseId: string; //Expense ID (default to undefined)

const { status, data } = await apiInstance.expenseControllerDeleteExpense(
    groupId,
    expenseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] | Group ID | defaults to undefined|
| **expenseId** | [**string**] | Expense ID | defaults to undefined|


### Return type

**object**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerGetBalances**
> Array<BalanceResponseDto> expenseControllerGetBalances()

Calculate balances for all group members

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)

const { status, data } = await apiInstance.expenseControllerGetBalances(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] | Group ID | defaults to undefined|


### Return type

**Array<BalanceResponseDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerGetExpenseById**
> ExpenseResponseDto expenseControllerGetExpenseById()

Get expense by ID

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)
let expenseId: string; //Expense ID (default to undefined)

const { status, data } = await apiInstance.expenseControllerGetExpenseById(
    groupId,
    expenseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] | Group ID | defaults to undefined|
| **expenseId** | [**string**] | Expense ID | defaults to undefined|


### Return type

**ExpenseResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerGetExpenseSummary**
> object expenseControllerGetExpenseSummary()

Get expense summary for a group

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)

const { status, data } = await apiInstance.expenseControllerGetExpenseSummary(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] | Group ID | defaults to undefined|


### Return type

**object**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerGetGroupExpenses**
> ExpenseListResponseDto expenseControllerGetGroupExpenses()

Get all expenses for a group with filters

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)
let category: 'food' | 'transport' | 'accommodation' | 'shopping' | 'entertainment' | 'bills' | 'health' | 'education' | 'other'; //Filter by category (optional) (default to undefined)
let fromDate: string; //Filter from date (optional) (default to undefined)
let toDate: string; //Filter to date (optional) (default to undefined)
let paidByUserId: string; //Filter by paid by user ID (optional) (default to undefined)
let verified: boolean; //Filter by verified status (optional) (default to undefined)
let search: string; //Search in title and description (optional) (default to undefined)
let sortBy: 'date' | 'amount' | 'createdAt'; //Sort field (optional) (default to undefined)
let sortOrder: 'asc' | 'desc'; //Sort direction (optional) (default to undefined)
let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)

const { status, data } = await apiInstance.expenseControllerGetGroupExpenses(
    groupId,
    category,
    fromDate,
    toDate,
    paidByUserId,
    verified,
    search,
    sortBy,
    sortOrder,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] | Group ID | defaults to undefined|
| **category** | [**&#39;food&#39; | &#39;transport&#39; | &#39;accommodation&#39; | &#39;shopping&#39; | &#39;entertainment&#39; | &#39;bills&#39; | &#39;health&#39; | &#39;education&#39; | &#39;other&#39;**]**Array<&#39;food&#39; &#124; &#39;transport&#39; &#124; &#39;accommodation&#39; &#124; &#39;shopping&#39; &#124; &#39;entertainment&#39; &#124; &#39;bills&#39; &#124; &#39;health&#39; &#124; &#39;education&#39; &#124; &#39;other&#39;>** | Filter by category | (optional) defaults to undefined|
| **fromDate** | [**string**] | Filter from date | (optional) defaults to undefined|
| **toDate** | [**string**] | Filter to date | (optional) defaults to undefined|
| **paidByUserId** | [**string**] | Filter by paid by user ID | (optional) defaults to undefined|
| **verified** | [**boolean**] | Filter by verified status | (optional) defaults to undefined|
| **search** | [**string**] | Search in title and description | (optional) defaults to undefined|
| **sortBy** | [**&#39;date&#39; | &#39;amount&#39; | &#39;createdAt&#39;**]**Array<&#39;date&#39; &#124; &#39;amount&#39; &#124; &#39;createdAt&#39;>** | Sort field | (optional) defaults to undefined|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort direction | (optional) defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|


### Return type

**ExpenseListResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerGetSpendingInsights**
> InsightResponseDto expenseControllerGetSpendingInsights()

Get spending insights for a group

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)

const { status, data } = await apiInstance.expenseControllerGetSpendingInsights(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] | Group ID | defaults to undefined|


### Return type

**InsightResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerUpdateExpense**
> ExpenseResponseDto expenseControllerUpdateExpense(updateExpenseDto)

Update an expense

### Example

```typescript
import {
    ExpensesApi,
    Configuration,
    UpdateExpenseDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)
let expenseId: string; //Expense ID (default to undefined)
let updateExpenseDto: UpdateExpenseDto; //

const { status, data } = await apiInstance.expenseControllerUpdateExpense(
    groupId,
    expenseId,
    updateExpenseDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateExpenseDto** | **UpdateExpenseDto**|  | |
| **groupId** | [**string**] | Group ID | defaults to undefined|
| **expenseId** | [**string**] | Expense ID | defaults to undefined|


### Return type

**ExpenseResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerUploadReceipt**
> object expenseControllerUploadReceipt()

Upload receipt image

### Example

```typescript
import {
    ExpensesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

const { status, data } = await apiInstance.expenseControllerUploadReceipt();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **expenseControllerVerifyReceipt**
> object expenseControllerVerifyReceipt(verifyReceiptDto)

Verify receipt for an expense

### Example

```typescript
import {
    ExpensesApi,
    Configuration,
    VerifyReceiptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ExpensesApi(configuration);

let groupId: string; //Group ID (default to undefined)
let expenseId: string; //Expense ID (default to undefined)
let verifyReceiptDto: VerifyReceiptDto; //

const { status, data } = await apiInstance.expenseControllerVerifyReceipt(
    groupId,
    expenseId,
    verifyReceiptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyReceiptDto** | **VerifyReceiptDto**|  | |
| **groupId** | [**string**] | Group ID | defaults to undefined|
| **expenseId** | [**string**] | Expense ID | defaults to undefined|


### Return type

**object**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

