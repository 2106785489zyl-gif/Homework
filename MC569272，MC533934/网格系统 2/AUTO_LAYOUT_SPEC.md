# 自动效仿排版模块规格

## 目标

- 基于网格模板自动生成海报首稿
- 支持 `strict`（严格模仿）与 `remix`（风格借用）模式
- 在生成时执行可读性检查和版权风险提醒

## 输入 JSON

```json
{
  "grid": {
    "cols": 12,
    "rows": 12,
    "marginLeft": 90,
    "marginRight": 90,
    "marginTop": 110,
    "marginBottom": 110,
    "moduleX": 75,
    "moduleY": 95,
    "baseline": 12,
    "angle": 0
  },
  "content": {
    "title": "SPRING SALE 2026",
    "subtitle": "新品上新，限时优惠",
    "body": "正文内容",
    "logo": "YOUR BRAND",
    "cta": "立即购买"
  },
  "assets": {
    "heroImage": "data:image/png;base64,...",
    "bgImage": "data:image/jpeg;base64,..."
  },
  "strategy": {
    "mode": "remix",
    "density": "normal",
    "align": "mixed",
    "whitespace": "normal",
    "focus": "center",
    "randomness": 35,
    "similarityThreshold": 70,
    "variantCount": 3
  }
}
```

## 输出 JSON

```json
{
  "variants": [
    {
      "id": "variant-1",
      "seed": 112,
      "mode": "remix",
      "blocks": {
        "logo": { "x": 100, "y": 120, "width": 200, "height": 70 },
        "title": { "x": 100, "y": 220, "width": 600, "height": 280 },
        "subtitle": { "x": 100, "y": 520, "width": 520, "height": 160 },
        "body": { "x": 420, "y": 700, "width": 560, "height": 360 },
        "image": { "x": 700, "y": 180, "width": 300, "height": 520 },
        "cta": { "x": 700, "y": 1110, "width": 280, "height": 120 }
      },
      "checks": [
        "可读性检查通过"
      ]
    }
  ],
  "risk": {
    "copyrightRiskLevel": "low",
    "message": "当前版权风险较低"
  }
}
```

## 排版规则优先级

1. 不允许内容块重叠（先解冲突，再细调）
2. 标题块优先占据视觉重心区域
3. CTA 保持在下半区或底部安全区
4. 正文宽度不超过约 42 字符行长
5. 文本对比度优先满足 WCAG AA（目标 >= 4.5:1）

## 函数接口设计（前端可直接调用）

- `gridFromInputs(): GridSchema`
- `computeBlockPlacement(grid, strategy, variantIndex): BlockPlan`
- `generateVariantPayload(index): VariantPayload`
- `renderVariantCanvas(canvas, payload): string[]`
- `generateVariants(): void`
- `exportActiveVariant(): void`

## 风险策略

- 当 `mode = strict` 且 `similarityThreshold > 80`，触发版权提醒
- 默认推荐 `mode = remix`
- 可读性不通过时在方案卡片中标注风险项
