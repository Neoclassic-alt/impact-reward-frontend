## Meaning

`TypeScript` API types hold in this folder. There are three types:

- `request` - request type
- `response` - response type
- `errors` - errors types in the process of accessing the API

Pay attention that `request` and `response` in the singular, while `errors` are multiple.

## Export types

When importing this types in another files, you **must** rename this types according to the purpose. Example:

`import type { response as userInfoResponse } from '@/types/api/user-info'`
