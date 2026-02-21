'use client'

import { useState, useEffect } from 'react'

export function useDiamonds() {
  const [diamonds, setDiamonds] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('wellv_diamonds')
    setDiamonds(stored ? parseInt(stored) : 0)
    checkMonthlyPremiumBonus()
  }, [])

  const addDiamonds = (amount: number) => {
    const newAmount = diamonds + amount
    setDiamonds(newAmount)
    localStorage.setItem('wellv_diamonds', newAmount.toString())
  }

  const spendDiamonds = (amount: number) => {
    if (diamonds >= amount) {
      const newAmount = diamonds - amount
      setDiamonds(newAmount)
      localStorage.setItem('wellv_diamonds', newAmount.toString())
      return true
    }
    return false
  }

  const checkMonthlyPremiumBonus = () => {
    const isPremium = localStorage.getItem('wellv_premium') === 'true'
    if (!isPremium) return

    const lastBonus = localStorage.getItem('wellv_last_premium_bonus')
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`

    if (lastBonus !== currentMonth) {
      const stored = localStorage.getItem('wellv_diamonds')
      const current = stored ? parseInt(stored) : 0
      const newAmount = current + 500
      setDiamonds(newAmount)
      localStorage.setItem('wellv_diamonds', newAmount.toString())
      localStorage.setItem('wellv_last_premium_bonus', currentMonth)
    }
  }

  const checkDailyReward = () => {
    const today = new Date().toDateString()
    const lastReward = localStorage.getItem('wellv_last_daily_reward')

    if (lastReward !== today) {
      addDiamonds(5)
      localStorage.setItem('wellv_last_daily_reward', today)
      return true
    }
    return false
  }

  return { diamonds, addDiamonds, spendDiamonds, checkDailyReward }
}
