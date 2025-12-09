# SignUpDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | User email address | [default to undefined]
**password** | **string** | User password (must contain uppercase, lowercase, and number) | [default to undefined]
**name** | **string** | User full name | [default to undefined]
**phone** | **string** | User phone number | [optional] [default to undefined]

## Example

```typescript
import { SignUpDto } from './api';

const instance: SignUpDto = {
    email,
    password,
    name,
    phone,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
