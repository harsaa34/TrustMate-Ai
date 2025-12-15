# UserApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userControllerChangePassword**](#usercontrollerchangepassword) | **POST** /api/users/change-password | Change own password|
|[**userControllerDeactivateOwnAccount**](#usercontrollerdeactivateownaccount) | **DELETE** /api/users/deactivate | Deactivate own account|
|[**userControllerDeleteAccount**](#usercontrollerdeleteaccount) | **DELETE** /api/users/profile | Delete own account|
|[**userControllerGetProfile**](#usercontrollergetprofile) | **GET** /api/users/profile | Get current user profile|
|[**userControllerLogin**](#usercontrollerlogin) | **POST** /api/users/login | User login|
|[**userControllerRegister**](#usercontrollerregister) | **POST** /api/users/register | Register a new user|
|[**userControllerUpdateProfile**](#usercontrollerupdateprofile) | **PUT** /api/users/profile | Update own profile|

# **userControllerChangePassword**
> SuccessResponseDto userControllerChangePassword()

Change own password

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.userControllerChangePassword();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**SuccessResponseDto**

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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerDeactivateOwnAccount**
> SuccessResponseDto userControllerDeactivateOwnAccount()

Deactivate own account

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.userControllerDeactivateOwnAccount();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**SuccessResponseDto**

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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerDeleteAccount**
> SuccessResponseDto userControllerDeleteAccount()

Delete own account

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.userControllerDeleteAccount();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**SuccessResponseDto**

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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetProfile**
> UserResponseDto userControllerGetProfile()

Get current user profile

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.userControllerGetProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponseDto**

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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerLogin**
> LoginResponseDto userControllerLogin(loginDto)

User login

### Example

```typescript
import {
    UserApi,
    Configuration,
    LoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let loginDto: LoginDto; //

const { status, data } = await apiInstance.userControllerLogin(
    loginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |


### Return type

**LoginResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | User account is not active |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRegister**
> UserResponseDto userControllerRegister(createUserDto)

Register a new user

### Example

```typescript
import {
    UserApi,
    Configuration,
    CreateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let createUserDto: CreateUserDto; //

const { status, data } = await apiInstance.userControllerRegister(
    createUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**|  | |


### Return type

**UserResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**409** | User already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateProfile**
> UserResponseDto userControllerUpdateProfile()

Update own profile

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.userControllerUpdateProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponseDto**

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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

