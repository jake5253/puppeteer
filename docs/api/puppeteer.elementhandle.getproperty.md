---
sidebar_label: ElementHandle.getProperty
---

# ElementHandle.getProperty() method

#### Signature:

```typescript
class ElementHandle {
  getProperty<K extends keyof ElementType>(
    propertyName: HandleOr<K>
  ): Promise<HandleFor<ElementType[K]>>;
}
```

## Parameters

| Parameter    | Type                                         | Description |
| ------------ | -------------------------------------------- | ----------- |
| propertyName | [HandleOr](./puppeteer.handleor.md)&lt;K&gt; |             |

**Returns:**

Promise&lt;[HandleFor](./puppeteer.handlefor.md)&lt;ElementType\[K\]&gt;&gt;
