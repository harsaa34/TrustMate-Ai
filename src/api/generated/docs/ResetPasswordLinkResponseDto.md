# ResetPasswordLinkResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** | Response message | [default to undefined]
**token** | **string** | Reset token (if valid) | [optional] [default to undefined]
**valid** | **boolean** | Whether token is valid | [default to undefined]
**instructions** | **string** | Instructions for resetting password | [optional] [default to undefined]

## Example

```typescript
import { ResetPasswordLinkResponseDto } from './api';

const instance: ResetPasswordLinkResponseDto = {
    message,
    token,
    valid,
    instructions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
