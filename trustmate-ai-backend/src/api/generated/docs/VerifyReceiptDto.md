# VerifyReceiptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**extractedAmount** | **number** | Actual amount from receipt | [default to undefined]
**extractedDate** | **string** | Extracted date from receipt | [optional] [default to undefined]
**confidenceScore** | **number** | Confidence score of OCR extraction | [optional] [default to undefined]
**metadata** | **object** | Additional verification metadata | [optional] [default to undefined]

## Example

```typescript
import { VerifyReceiptDto } from './api';

const instance: VerifyReceiptDto = {
    extractedAmount,
    extractedDate,
    confidenceScore,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
