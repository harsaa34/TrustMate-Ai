# UserResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | User ID | [default to undefined]
**email** | **string** | User email address | [default to undefined]
**name** | **string** | User full name | [default to undefined]
**isActive** | **boolean** | Whether the user account is active | [default to undefined]
**isVerified** | **boolean** | Whether the user email is verified | [default to undefined]
**phone** | **string** | User phone number | [optional] [default to undefined]
**avatar** | **string** | User avatar URL | [optional] [default to undefined]
**bio** | **string** | User biography | [optional] [default to undefined]
**createdAt** | **string** | Account creation date | [default to undefined]
**updatedAt** | **string** | Last account update date | [default to undefined]

## Example

```typescript
import { UserResponseDto } from './api';

const instance: UserResponseDto = {
    id,
    email,
    name,
    isActive,
    isVerified,
    phone,
    avatar,
    bio,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
