# AuthResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token** | **string** | JWT access token | [default to undefined]
**refreshToken** | **string** | Refresh token | [optional] [default to undefined]
**user** | [**UserResponseDto**](UserResponseDto.md) | User information | [default to undefined]
**sessionId** | **string** | Session ID | [optional] [default to undefined]
**security** | **object** | Security information | [optional] [default to undefined]

## Example

```typescript
import { AuthResponseDto } from './api';

const instance: AuthResponseDto = {
    token,
    refreshToken,
    user,
    sessionId,
    security,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
