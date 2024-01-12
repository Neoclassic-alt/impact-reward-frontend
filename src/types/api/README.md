## Meaning

`TypeScript` API types hold in this folder. There are three types:

- `request` - request type
- `response` - response type
- `error` (`errors`) - errors types in the process of accessing the API

## Export types

When importing this types in another files, you **must** rename this types according to the purpose. Example:

`import type { response as userInfoResponse } from '@/types/api/user-info'`
