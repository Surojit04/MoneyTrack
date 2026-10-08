# MoneyTrack — My Personal Money Manager

A modern, polished, mobile-first personal finance management website built with React, TypeScript, and Tailwind CSS.

Designed specifically for personal monthly money allocation: salary, protected savings, personal spending, girlfriend-related spending, home expenses, and phone recharges.

---

## 🌟 Key Features

1. **Core Monthly Money Structure & Custom Budgets**:
   - Default Salary: ₹10,000
   - Default Allocation:
     - 🛡️ **Savings Target**: ₹6,000 (Removed from spending pool & protected)
     - 👤 **My Personal**: ₹1,000
     - 💖 **Me & My Girlfriend**: ₹1,000
     - 🏡 **Home**: ₹2,000
   - Fully customizable in **Settings / Budgets**, including adding custom categories (Travel, Education, Shopping, etc.).
   - Live reconciliation of allocated vs remaining unallocated money.

2. **Mobile-First Dashboard**:
   - Monthly Overview: Salary (₹10,000), Total Savings (₹6,000), Total Spent, Available to Spend.
   - Interactive SVG Donut Breakdown (Planned Allocation vs Actual Spending).
   - Smart **Money Health Card** evaluating spending health dynamically.
   - Dedicated **Savings Section** with progress bar, confetti goal celebrations, and protected money badge.
   - Dedicated **Category Budget Cards** with dynamic warning color system:
     - **Green**: > 50% remaining
     - **Orange**: 20% – 50% remaining
     - **Red**: < 20% remaining
     - **Dark Red / Critical**: "Budget exhausted"
     - **Danger**: "⚠️ Over Budget" with negative amount
   - Dedicated **Phone Recharge Area** tracked separately.
   - **Monthly Summary Reconciliation** table.

3. **Fast Mobile Expense Entry**:
   - Sticky floating `+ Add Expense` button.
   - Bottom sheet modal with category selector, quick amount presets (`+₹30`, `+₹50`, `+₹100`, `+₹250`, `+₹299`, `+₹500`, `+₹1,000`), description suggestion tags, date, and notes.

4. **Multi-Month Isolation**:
   - Top Month Navigator (`← Sep 2026 | Oct 2026 | Nov 2026 →`) and full Year/Month calendar picker.
   - Complete data isolation per month.

5. **Transactions & Activity**:
   - Full monthly transaction feed with instant search and category filtering.
   - Edit and delete with confirmation dialogs.

6. **Analytics & Reports**:
   - Spending distribution, category vs budget comparison bar charts, multi-month spending & savings trend chart, highest/lowest spending categories, and daily run-rate.

7. **PWA-Ready & Local Storage**:
   - 100% offline, zero backend needed.
   - JSON export and restore/import.
   - Dark Mode / Light Mode with system auto-detection.

---

## 🚀 Running the App

```bash
# Start the dev server (with local Wi-Fi exposure for mobile testing)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Access locally on: `http://localhost:5173/`  
Access from mobile phone on the same Wi-Fi: `http://<your-lan-ip>:5173/`
