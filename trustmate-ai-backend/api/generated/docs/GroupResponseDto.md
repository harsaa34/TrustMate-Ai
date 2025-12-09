# GroupResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Group ID | [default to undefined]
**name** | **string** | Group name | [default to undefined]
**description** | **string** | Group description | [optional] [default to undefined]
**createdBy** | **object** | Group creator | [default to undefined]
**members** | [**Array&lt;GroupResponseDtoMembersInner&gt;**](GroupResponseDtoMembersInner.md) | Group members | [default to undefined]
**settings** | **object** | Group settings | [default to undefined]
**isActive** | **boolean** | Whether the group is active | [default to undefined]
**createdAt** | **string** | Creation date | [default to undefined]
**updatedAt** | **string** | Last update date | [default to undefined]

## Example

```typescript
import { GroupResponseDto } from './api';

const instance: GroupResponseDto = {
    id,
    name,
    description,
    createdBy,
    members,
    settings,
    isActive,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
