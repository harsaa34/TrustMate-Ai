# GroupsApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**groupControllerAddMember**](#groupcontrolleraddmember) | **POST** /api/groups/{id}/members | Add member to group|
|[**groupControllerCreateGroup**](#groupcontrollercreategroup) | **POST** /api/groups | Create a new group|
|[**groupControllerDeleteGroup**](#groupcontrollerdeletegroup) | **DELETE** /api/groups/{id} | Delete group|
|[**groupControllerGetGroupById**](#groupcontrollergetgroupbyid) | **GET** /api/groups/{id} | Get group details|
|[**groupControllerGetGroupMembers**](#groupcontrollergetgroupmembers) | **GET** /api/groups/{id}/members | Get group members|
|[**groupControllerGetGroupStatistics**](#groupcontrollergetgroupstatistics) | **GET** /api/groups/{id}/stats | Get group statistics|
|[**groupControllerGetUserGroups**](#groupcontrollergetusergroups) | **GET** /api/groups | Get user\&#39;s groups|
|[**groupControllerRemoveMember**](#groupcontrollerremovemember) | **DELETE** /api/groups/{id}/members/{memberId} | Remove member from group|
|[**groupControllerUpdateGroup**](#groupcontrollerupdategroup) | **PUT** /api/groups/{id} | Update group|

# **groupControllerAddMember**
> GroupResponseDto groupControllerAddMember(addMemberDto)

Add member to group

### Example

```typescript
import {
    GroupsApi,
    Configuration,
    AddMemberDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)
let addMemberDto: AddMemberDto; //

const { status, data } = await apiInstance.groupControllerAddMember(
    id,
    addMemberDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addMemberDto** | **AddMemberDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**GroupResponseDto**

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

# **groupControllerCreateGroup**
> GroupResponseDto groupControllerCreateGroup(createGroupDto)

Create a new group

### Example

```typescript
import {
    GroupsApi,
    Configuration,
    CreateGroupDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let createGroupDto: CreateGroupDto; //

const { status, data } = await apiInstance.groupControllerCreateGroup(
    createGroupDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createGroupDto** | **CreateGroupDto**|  | |


### Return type

**GroupResponseDto**

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

# **groupControllerDeleteGroup**
> groupControllerDeleteGroup()

Delete group

### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.groupControllerDeleteGroup(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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

# **groupControllerGetGroupById**
> GroupResponseDto groupControllerGetGroupById()

Get group details

### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.groupControllerGetGroupById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**GroupResponseDto**

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

# **groupControllerGetGroupMembers**
> Array<GroupMemberResponseDto> groupControllerGetGroupMembers()

Get group members

### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.groupControllerGetGroupMembers(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Array<GroupMemberResponseDto>**

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

# **groupControllerGetGroupStatistics**
> GroupStatisticsDto groupControllerGetGroupStatistics()

Get group statistics

### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.groupControllerGetGroupStatistics(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**GroupStatisticsDto**

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

# **groupControllerGetUserGroups**
> Array<GroupResponseDto> groupControllerGetUserGroups()

Get user\'s groups

### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let sortBy: 'name' | 'createdAt' | 'updatedAt'; //Field to sort by (optional) (default to undefined)
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to undefined)
let page: number; //Page number (optional) (default to 1)
let limit: number; //Items per page (optional) (default to 20)

const { status, data } = await apiInstance.groupControllerGetUserGroups(
    sortBy,
    sortOrder,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sortBy** | [**&#39;name&#39; | &#39;createdAt&#39; | &#39;updatedAt&#39;**]**Array<&#39;name&#39; &#124; &#39;createdAt&#39; &#124; &#39;updatedAt&#39;>** | Field to sort by | (optional) defaults to undefined|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **limit** | [**number**] | Items per page | (optional) defaults to 20|


### Return type

**Array<GroupResponseDto>**

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

# **groupControllerRemoveMember**
> groupControllerRemoveMember()

Remove member from group

### Example

```typescript
import {
    GroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)
let memberId: string; // (default to undefined)

const { status, data } = await apiInstance.groupControllerRemoveMember(
    id,
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **memberId** | [**string**] |  | defaults to undefined|


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

# **groupControllerUpdateGroup**
> GroupResponseDto groupControllerUpdateGroup(updateGroupDto)

Update group

### Example

```typescript
import {
    GroupsApi,
    Configuration,
    UpdateGroupDto
} from './api';

const configuration = new Configuration();
const apiInstance = new GroupsApi(configuration);

let id: string; // (default to undefined)
let updateGroupDto: UpdateGroupDto; //

const { status, data } = await apiInstance.groupControllerUpdateGroup(
    id,
    updateGroupDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateGroupDto** | **UpdateGroupDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**GroupResponseDto**

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

