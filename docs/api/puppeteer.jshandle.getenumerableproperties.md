---
sidebar_label: JSHandle.getEnumerableProperties
---

# JSHandle.getEnumerableProperties() method

Gets a record of handles representing the enumerable properties of the handled object.

#### Signature:

```typescript
class JSHandle {
  getEnumerableProperties(this: JSHandle<object>): Promise<
    Readonly<{
      [K in Extract<keyof T, string>]: HandleFor<Awaited<T[K]>>;
    }>
  >;
}
```

## Parameters

| Parameter | Type                                              | Description |
| --------- | ------------------------------------------------- | ----------- |
| this      | [JSHandle](./puppeteer.jshandle.md)&lt;object&gt; |             |

**Returns:**

Promise&lt;Readonly&lt;{ \[K in Extract&lt;keyof T, string&gt;\]: [HandleFor](./puppeteer.handlefor.md)&lt;Awaited&lt;T\[K\]&gt;&gt;; }&gt;&gt;

## Example

```ts
const listHandle = await page.evaluateHandle(() => document.body.children);
const properties = await listHandle.getEnumerableProperties();
const children = [];
for (const property of Object.values(properties)) {
  const element = property.asElement();
  if (element) {
    children.push(element);
  }
}
children; // holds elementHandles to all children of document.body
```
