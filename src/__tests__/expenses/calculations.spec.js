import { describe, it, expect } from 'vitest'

const expenses = [
  { cost: 100, isPaid: true },
  { cost: 100, isPaid: false },
  { cost: 100, isPaid: false },
  { cost: 100, isPaid: true },
  { cost: 100, isPaid: true },
]

const income = [
  { amount: 10000 },
  { amount: 5000 }
]

describe('Expenses', () => {
  it('Should calculate gross expense', () => {
    const grossExpense = () => {
      return expenses.reduce((sum, item) => sum += item.cost, 0)
    }
    
    expect(grossExpense()).toBe(500)
  })

  it('Should return remaining expense amount', () => {
    const grossExpense = () => {
      return expenses.reduce((sum, item) => sum += item.cost, 0)
    }

    const remainingExpenseAmount = () => {
      return expenses.reduce((sum, item) => sum -= item.isPaid ? item.cost : 0, grossExpense())
    }

    expect(remainingExpenseAmount()).toBe(200)
  })

  it('Should calculate total income', () => {
    const calculateTotalIncome = () => income.reduce((sum, item) => sum += item.amount, 0)
    expect(calculateTotalIncome()).toBe(15000)
  })

  it('Should calculate total remaining income', () => {
    const grossExpense = () => {
      return expenses.reduce((sum, item) => sum += item.cost, 0)
    }

    const calculateTotalIncome = () => income.reduce((sum, item) => sum += item.amount, 0)

    const remainingExpenseAmount = () => {
      return expenses.reduce((sum, item) => sum -= item.isPaid ? item.cost : 0, grossExpense())
    }

    expect(calculateTotalIncome() - remainingExpenseAmount()).toBe(14800)
  })
})