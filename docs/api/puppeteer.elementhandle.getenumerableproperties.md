---
sidebar_label: ElementHandle.getEnumerableProperties
---

# ElementHandle.getEnumerableProperties() method

#### Signature:

```typescript
class ElementHandle {
  getEnumerableProperties(): Promise<
    Readonly<{
      [K in Extract<keyof ElementType, string>]: HandleFor<
        Awaited<ElementType[K]>
      >;
    }>
  >;
}
```

**Returns:**

Promise&lt;Readonly&lt;{ \[K in Extract&lt;keyof ElementType, string&gt;\]: [HandleFor](./puppeteer.handlefor.md)&lt;Awaited&lt;ElementType\[K\]&gt;&gt;; }&gt;&gt;
