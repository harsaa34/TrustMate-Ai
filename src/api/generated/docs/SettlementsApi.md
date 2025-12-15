# SettlementsApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**settlementControllerCreateOptimizedSettlements**](#settlementcontrollercreateoptimizedsettlements) | **POST** /api/groups/{groupId}/settlements/optimize/auto-create | Create optimized settlements automatically|
|[**settlementControllerCreateSettlement**](#settlementcontrollercreatesettlement) | **POST** /api/groups/{groupId}/settlements | Create a new settlement|
|[**settlementControllerDeleteSettlement**](#settlementcontrollerdeletesettlement) | **DELETE** /api/groups/{groupId}/settlements/{settlementId} | Delete a settlement|
|[**settlementControllerGetBalances**](#settlementcontrollergetbalances) | **GET** /api/groups/{groupId}/settlements/balances | Calculate balances for all group members|
|[**settlementControllerGetGroupSettlements**](#settlementcontrollergetgroupsettlements) | **GET** /api/groups/{groupId}/settlements | Get all settlements for a group|
|[**settlementControllerGetOptimizedSettlements**](#settlementcontrollergetoptimizedsettlements) | **GET** /api/groups/{groupId}/settlements/optimize | Get optimized settlement suggestions|
|[**settlementControllerGetSettlementById**](#settlementcontrollergetsettlementbyid) | **GET** /api/groups/{groupId}/settlements/{settlementId} | Get settlement by ID|
|[**settlementControllerGetStatistics**](#settlementcontrollergetstatistics) | **GET** /api/groups/{groupId}/settlements/statistics | Get settlement statistics|
|[**settlementControllerUpdateSettlementStatus**](#settlementcontrollerupdatesettlementstatus) | **PUT** /api/groups/{groupId}/settlements/{settlementId}/status | Update settlement status|

# **settlementControllerCreateOptimizedSettlements**
> Array<SettlementResponseDto> settlementControllerCreateOptimizedSettlements(createOptimizedSettlementsDto)

Create optimized settlements automatically

### Example

```typescript
import {
    SettlementsApi,
    Configuration,
    CreateOptimizedSettlementsDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)
let createOptimizedSettlementsDto: CreateOptimizedSettlementsDto; //

const { status, data } = await apiInstance.settlementControllerCreateOptimizedSettlements(
    groupId,
    createOptimizedSettlementsDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOptimizedSettlementsDto** | **CreateOptimizedSettlementsDto**|  | |
| **groupId** | [**string**] |  | defaults to undefined|


### Return type

**Array<SettlementResponseDto>**

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

# **settlementControllerCreateSettlement**
> SettlementResponseDto settlementControllerCreateSettlement(createSettlementDto)

Create a new settlement

### Example

```typescript
import {
    SettlementsApi,
    Configuration,
    CreateSettlementDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)
let createSettlementDto: CreateSettlementDto; //

const { status, data } = await apiInstance.settlementControllerCreateSettlement(
    groupId,
    createSettlementDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSettlementDto** | **CreateSettlementDto**|  | |
| **groupId** | [**string**] |  | defaults to undefined|


### Return type

**SettlementResponseDto**

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

# **settlementControllerDeleteSettlement**
> settlementControllerDeleteSettlement()

Delete a settlement

### Example

```typescript
import {
    SettlementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)
let settlementId: string; // (default to undefined)

const { status, data } = await apiInstance.settlementControllerDeleteSettlement(
    groupId,
    settlementId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|
| **settlementId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **settlementControllerGetBalances**
> Array<BalanceResponseDto> settlementControllerGetBalances()

Calculate balances for all group members

### Example

```typescript
import {
    SettlementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)

const { status, data } = await apiInstance.settlementControllerGetBalances(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|


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

# **settlementControllerGetGroupSettlements**
> SettlementListResponseDto settlementControllerGetGroupSettlements()

Get all settlements for a group

### Example

```typescript
import {
    SettlementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)
let status: 'pending' | 'completed' | 'cancelled'; //Filter by status (optional) (default to undefined)
let fromDate: string; //Filter from date (optional) (default to undefined)
let toDate: string; //Filter to date (optional) (default to undefined)
let userId: string; //Filter by user ID (optional) (default to undefined)
let isAutoGenerated: boolean; //Filter by auto-generated settlements (optional) (default to undefined)
let sortBy: 'date' | 'amount' | 'createdAt' | 'updatedAt'; //Sort by field (optional) (default to undefined)
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to undefined)
let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)

const { status, data } = await apiInstance.settlementControllerGetGroupSettlements(
    groupId,
    status,
    fromDate,
    toDate,
    userId,
    isAutoGenerated,
    sortBy,
    sortOrder,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|
| **status** | [**&#39;pending&#39; | &#39;completed&#39; | &#39;cancelled&#39;**]**Array<&#39;pending&#39; &#124; &#39;completed&#39; &#124; &#39;cancelled&#39;>** | Filter by status | (optional) defaults to undefined|
| **fromDate** | [**string**] | Filter from date | (optional) defaults to undefined|
| **toDate** | [**string**] | Filter to date | (optional) defaults to undefined|
| **userId** | [**string**] | Filter by user ID | (optional) defaults to undefined|
| **isAutoGenerated** | [**boolean**] | Filter by auto-generated settlements | (optional) defaults to undefined|
| **sortBy** | [**&#39;date&#39; | &#39;amount&#39; | &#39;createdAt&#39; | &#39;updatedAt&#39;**]**Array<&#39;date&#39; &#124; &#39;amount&#39; &#124; &#39;createdAt&#39; &#124; &#39;updatedAt&#39;>** | Sort by field | (optional) defaults to undefined|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|


### Return type

**SettlementListResponseDto**

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

# **settlementControllerGetOptimizedSettlements**
> Array<SettlementOptimizationResultDto> settlementControllerGetOptimizedSettlements()

Get optimized settlement suggestions

### Example

```typescript
import {
    SettlementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)

const { status, data } = await apiInstance.settlementControllerGetOptimizedSettlements(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|


### Return type

**Array<SettlementOptimizationResultDto>**

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

# **settlementControllerGetSettlementById**
> SettlementResponseDto settlementControllerGetSettlementById()

Get settlement by ID

### Example

```typescript
import {
    SettlementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)
let settlementId: string; // (default to undefined)

const { status, data } = await apiInstance.settlementControllerGetSettlementById(
    groupId,
    settlementId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|
| **settlementId** | [**string**] |  | defaults to undefined|


### Return type

**SettlementResponseDto**

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

# **settlementControllerGetStatistics**
> SettlementStatisticsDto settlementControllerGetStatistics()

Get settlement statistics

### Example

```typescript
import {
    SettlementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)

const { status, data } = await apiInstance.settlementControllerGetStatistics(
    groupId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **groupId** | [**string**] |  | defaults to undefined|


### Return type

**SettlementStatisticsDto**

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

# **settlementControllerUpdateSettlementStatus**
> SettlementResponseDto settlementControllerUpdateSettlementStatus(updateSettlementStatusDto)

Update settlement status

### Example

```typescript
import {
    SettlementsApi,
    Configuration,
    UpdateSettlementStatusDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SettlementsApi(configuration);

let groupId: string; // (default to undefined)
let settlementId: string; // (default to undefined)
let updateSettlementStatusDto: UpdateSettlementStatusDto; //

const { status, data } = await apiInstance.settlementControllerUpdateSettlementStatus(
    groupId,
    settlementId,
    updateSettlementStatusDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateSettlementStatusDto** | **UpdateSettlementStatusDto**|  | |
| **groupId** | [**string**] |  | defaults to undefined|
| **settlementId** | [**string**] |  | defaults to undefined|


### Return type

**SettlementResponseDto**

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

