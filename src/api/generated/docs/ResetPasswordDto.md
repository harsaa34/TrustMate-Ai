# ResetPasswordDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token** | **string** | Reset token received via email | [default to undefined]
**newPassword** | **string** | New password (must contain uppercase, lowercase, and number) | [default to undefined]

## Example

```typescript
import { ResetPasswordDto } from './api';

const instance: ResetPasswordDto = {
    token,
    newPassword,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
