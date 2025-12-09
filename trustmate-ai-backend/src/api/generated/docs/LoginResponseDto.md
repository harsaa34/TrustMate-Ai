# LoginResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token** | **string** | JWT token | [default to undefined]
**user** | [**UserResponseDto**](UserResponseDto.md) | Authenticated user information | [default to undefined]
**refreshToken** | **string** | Refresh token | [optional] [default to undefined]

## Example

```typescript
import { LoginResponseDto } from './api';

const instance: LoginResponseDto = {
    token,
    user,
    refreshToken,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
