# AuthenticationApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerChangePassword**](#authcontrollerchangepassword) | **POST** /api/auth/change-password | Change user password|
|[**authControllerCheckEmailAvailability**](#authcontrollercheckemailavailability) | **GET** /api/auth/check-email/{email} | Check if email is available for registration|
|[**authControllerDeleteAccount**](#authcontrollerdeleteaccount) | **DELETE** /api/auth/account | Delete user account (soft delete)|
|[**authControllerForgotPassword**](#authcontrollerforgotpassword) | **POST** /api/auth/forgot-password | Request password reset email|
|[**authControllerGetProfile**](#authcontrollergetprofile) | **GET** /api/auth/profile | Get authenticated user profile|
|[**authControllerHandleResetPasswordLink**](#authcontrollerhandleresetpasswordlink) | **GET** /api/auth/reset-password | Handle reset password link from email|
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /api/auth/login | Authenticate user and return JWT tokens|
|[**authControllerLogout**](#authcontrollerlogout) | **POST** /api/auth/logout | Logout user and invalidate refresh token|
|[**authControllerLogoutFromAllDevices**](#authcontrollerlogoutfromalldevices) | **POST** /api/auth/logout-all | Logout user from all devices|
|[**authControllerRefreshToken**](#authcontrollerrefreshtoken) | **POST** /api/auth/refresh-token | Refresh access token using refresh token|
|[**authControllerResendVerificationEmail**](#authcontrollerresendverificationemail) | **POST** /api/auth/resend-verification | Resend verification email|
|[**authControllerResetPassword**](#authcontrollerresetpassword) | **POST** /api/auth/reset-password | Reset password using reset token|
|[**authControllerSignup**](#authcontrollersignup) | **POST** /api/auth/signup | Register a new user account|
|[**authControllerUpdateProfile**](#authcontrollerupdateprofile) | **PUT** /api/auth/profile | Update authenticated user profile|
|[**authControllerValidateToken**](#authcontrollervalidatetoken) | **GET** /api/auth/validate | Validate JWT token|
|[**authControllerVerifyEmail**](#authcontrollerverifyemail) | **GET** /api/auth/verify-email | Verify email address using verification token|

# **authControllerChangePassword**
> object authControllerChangePassword(changePasswordDto)

Change user password

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    ChangePasswordDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let changePasswordDto: ChangePasswordDto; //

const { status, data } = await apiInstance.authControllerChangePassword(
    changePasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordDto** | **ChangePasswordDto**|  | |


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
|**400** | Password validation failed: undefined |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerCheckEmailAvailability**
> object authControllerCheckEmailAvailability()

Check if email is available for registration

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let email: string; // (default to undefined)

const { status, data } = await apiInstance.authControllerCheckEmailAvailability(
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] |  | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerDeleteAccount**
> object authControllerDeleteAccount()

Delete user account (soft delete)

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerDeleteAccount();
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
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerForgotPassword**
> object authControllerForgotPassword(forgotPasswordDto)

Request password reset email

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    ForgotPasswordDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let forgotPasswordDto: ForgotPasswordDto; //

const { status, data } = await apiInstance.authControllerForgotPassword(
    forgotPasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **forgotPasswordDto** | **ForgotPasswordDto**|  | |


### Return type

**object**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerGetProfile**
> UserResponseDto authControllerGetProfile()

Get authenticated user profile

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerGetProfile();
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

# **authControllerHandleResetPasswordLink**
> ResetPasswordLinkResponseDto authControllerHandleResetPasswordLink()

Handle reset password link from email

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.authControllerHandleResetPasswordLink(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


### Return type

**ResetPasswordLinkResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogin**
> AuthResponseDto authControllerLogin(loginDto)

Authenticate user and return JWT tokens

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    LoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let loginDto: LoginDto; //

const { status, data } = await apiInstance.authControllerLogin(
    loginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |


### Return type

**AuthResponseDto**

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
|**403** | Your account has been deactivated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogout**
> object authControllerLogout()

Logout user and invalidate refresh token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerLogout();
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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogoutFromAllDevices**
> object authControllerLogoutFromAllDevices()

Logout user from all devices

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerLogoutFromAllDevices();
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
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefreshToken**
> object authControllerRefreshToken(refreshTokenDto)

Refresh access token using refresh token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RefreshTokenDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let refreshTokenDto: RefreshTokenDto; //

const { status, data } = await apiInstance.authControllerRefreshToken(
    refreshTokenDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenDto** | **RefreshTokenDto**|  | |


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**400** | Invalid or expired verification token |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResendVerificationEmail**
> object authControllerResendVerificationEmail()

Resend verification email

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerResendVerificationEmail();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResetPassword**
> object authControllerResetPassword(resetPasswordDto)

Reset password using reset token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    ResetPasswordDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let resetPasswordDto: ResetPasswordDto; //

const { status, data } = await apiInstance.authControllerResetPassword(
    resetPasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordDto** | **ResetPasswordDto**|  | |


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**400** | Password validation failed: undefined |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSignup**
> AuthResponseDto authControllerSignup(signUpDto)

Register a new user account

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    SignUpDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let signUpDto: SignUpDto; //

const { status, data } = await apiInstance.authControllerSignup(
    signUpDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpDto** | **SignUpDto**|  | |


### Return type

**AuthResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Success |  -  |
|**400** | User update failed: undefined |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**409** | User with email undefined already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerUpdateProfile**
> UserResponseDto authControllerUpdateProfile(updateProfileDto)

Update authenticated user profile

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    UpdateProfileDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let updateProfileDto: UpdateProfileDto; //

const { status, data } = await apiInstance.authControllerUpdateProfile(
    updateProfileDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProfileDto** | **UpdateProfileDto**|  | |


### Return type

**UserResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | User update failed: undefined |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerValidateToken**
> object authControllerValidateToken()

Validate JWT token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerValidateToken();
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
|**200** | Success |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |
|**403** | Forbidden - Insufficient permissions |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyEmail**
> object authControllerVerifyEmail()

Verify email address using verification token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.authControllerVerifyEmail(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Invalid or expired verification token |  -  |
|**401** | Unauthorized - Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

