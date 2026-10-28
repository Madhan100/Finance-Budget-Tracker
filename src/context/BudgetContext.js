import React, { createContext, useState, useContext, useMemo } from 'react';
import { Alert } from 'react-native';
import { INITIAL_TRANSACTIONS } from '../constants/initialData';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Active in-app notification banner for personalized alerts
  const [activeAlert, setActiveAlert] = useState(null);

  /**
   * Helper to trigger personalized alert both in-app banner and native Alert dialog
   */
  const triggerPersonalizedAlert = (type, title, message, showNativeDialog = true) => {
    const alertData = {
      id: Date.now().toString(),
      type, // 'success' | 'info' | 'warning' | 'danger'
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveAlert(alertData);

    if (showNativeDialog) {
      Alert.alert(title, message, [{ text: 'OK', onPress: () => {} }]);
    }

    // Auto-dismiss in-app banner after 4.5 seconds
    setTimeout(() => {
      setActiveAlert(current => (current?.id === alertData.id ? null : current));
    }, 4500);
  };

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  /**
   * Add a new transaction
   */
  const addTransaction = (newTxData) => {
    const userDisplayName = currentUser?.name || 'User';
    const tx = {
      id: `tx-${Date.now()}`,
      title: newTxData.title.trim(),
      amount: parseFloat(newTxData.amount),
      type: newTxData.type || 'expense', // 'expense' | 'income'
      category: newTxData.category || 'food',
      date: newTxData.date || new Date().toISOString().split('T')[0],
      notes: (newTxData.notes || '').trim(),
      paymentMethod: newTxData.paymentMethod || 'UPI / Card',
      userName: userDisplayName,
      userRole: currentUser?.role || 'Customer',
    };

    setTransactions(prev => [tx, ...prev]);

    // Personalized alert requirement
    const currency = currentUser?.currencySymbol || '₹';
    const typeLabel = tx.type === 'expense' ? 'expense' : 'income';
    const alertTitle = tx.type === 'expense' ? 'Expense Added' : 'Income Added';
    const alertMsg = `Hi ${userDisplayName}, your ${typeLabel} "${tx.title}" of ${currency}${tx.amount.toLocaleString()} has been added successfully.`;

    triggerPersonalizedAlert('success', alertTitle, alertMsg);
    return tx;
  };

  /**
   * Update an existing transaction
   */
  const updateTransaction = (id, updatedFields) => {
    const userDisplayName = currentUser?.name || 'User';
    let updatedTx = null;

    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === id) {
          updatedTx = {
            ...tx,
            ...updatedFields,
            amount: parseFloat(updatedFields.amount !== undefined ? updatedFields.amount : tx.amount),
          };
          return updatedTx;
        }
        return tx;
      })
    );

    const currency = currentUser?.currencySymbol || '₹';
    const alertTitle = 'Transaction Updated';
    const alertMsg = `Hi ${userDisplayName}, your transaction "${updatedFields.title || updatedTx?.title || 'Record'}" has been updated successfully.`;

    triggerPersonalizedAlert('info', alertTitle, alertMsg);
    return true;
  };

  /**
   * Delete a transaction
   */
  const deleteTransaction = (id) => {
    const userDisplayName = currentUser?.name || 'User';
    const targetTx = transactions.find(t => t.id === id);

    setTransactions(prev => prev.filter(tx => tx.id !== id));

    const alertTitle = 'Transaction Deleted';
    const alertMsg = `Hi ${userDisplayName}, your transaction "${targetTx?.title || 'Item'}" has been deleted.`;

    triggerPersonalizedAlert('warning', alertTitle, alertMsg);
    return true;
  };

  // Helper date parsing
  const getParsedDate = (dateStr) => {
    // dateStr format: YYYY-MM-DD
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  };

  /**
   * Summary calculations (Total Income, Total Expense, Net Balance)
   */
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        income += amt;
      } else {
        expense += amt;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0,
      totalCount: transactions.length,
    };
  }, [transactions]);

  /**
   * Daily, Weekly, and Monthly Report calculations for Home Screen (Part III - Requirement 3)
   */
  const reports = useMemo(() => {
    // Reference date based on current transactions (2026-10-28)
    const todayStr = '2026-10-28';
    const refDate = getParsedDate(todayStr);

    // 1. Daily: Transactions on today's date
    const dailyTx = transactions.filter(t => t.date === todayStr);
    let dailyIncome = 0;
    let dailyExpense = 0;
    dailyTx.forEach(t => {
      if (t.type === 'income') dailyIncome += Number(t.amount);
      else dailyExpense += Number(t.amount);
    });

    // 2. Weekly: Transactions in the current 7-day window (2026-10-22 to 2026-10-28)
    const weekAgo = new Date(refDate);
    weekAgo.setDate(refDate.getDate() - 7);

    const weeklyTx = transactions.filter(t => {
      const d = getParsedDate(t.date);
      return d >= weekAgo && d <= refDate;
    });
    let weeklyIncome = 0;
    let weeklyExpense = 0;
    weeklyTx.forEach(t => {
      if (t.type === 'income') weeklyIncome += Number(t.amount);
      else weeklyExpense += Number(t.amount);
    });

    // 3. Monthly: Transactions in current month (2026-10)
    const currentMonthPrefix = '2026-10';
    const monthlyTx = transactions.filter(t => t.date.startsWith(currentMonthPrefix));
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    monthlyTx.forEach(t => {
      if (t.type === 'income') monthlyIncome += Number(t.amount);
      else monthlyExpense += Number(t.amount);
    });

    return {
      daily: {
        income: dailyIncome,
        expense: dailyExpense,
        balance: dailyIncome - dailyExpense,
        count: dailyTx.length,
        label: 'Today (28 Oct 2026)',
      },
      weekly: {
        income: weeklyIncome,
        expense: weeklyExpense,
        balance: weeklyIncome - weeklyExpense,
        count: weeklyTx.length,
        label: 'This Week (22 - 28 Oct)',
      },
      monthly: {
        income: monthlyIncome,
        expense: monthlyExpense,
        balance: monthlyIncome - monthlyExpense,
        count: monthlyTx.length,
        label: 'This Month (October 2026)',
      },
    };
  }, [transactions]);

  /**
   * Month-wise transactions grouping (Screen 4)
   * Available months in dataset: '2026-10', '2026-09', '2026-08'
   */
  const availableMonths = useMemo(() => {
    const monthMap = new Map();
    transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7); // '2026-10'
      if (!monthMap.has(monthKey)) {
        const [year, month] = monthKey.split('-');
        const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
        const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthMap.set(monthKey, { key: monthKey, label: monthName, year, month });
      }
    });

    // Ensure sorted descending (latest first)
    return Array.from(monthMap.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [transactions]);

  const getTransactionsForMonth = (monthKey) => {
    return transactions.filter(t => t.date.startsWith(monthKey));
  };

  /**
   * Category spending calculations (Screen 5 & Screen 6)
   */
  const categoryStats = useMemo(() => {
    const totalExpense = totals.expense || 1; // prevent div by 0

    return categories.map(cat => {
      const catTransactions = transactions.filter(t => t.category === cat.id && t.type === 'expense');
      const totalSpent = catTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const percentage = Math.min(100, Math.round((totalSpent / totalExpense) * 100));
      const budgetProgress = cat.budget > 0 ? Math.min(100, Math.round((totalSpent / cat.budget) * 100)) : 0;

      return {
        ...cat,
        totalSpent,
        transactionCount: catTransactions.length,
        percentage,
        budgetProgress,
        isOverBudget: cat.budget > 0 && totalSpent > cat.budget,
      };
    });
  }, [categories, transactions, totals.expense]);

  const getCategoryDetails = (categoryId) => {
    const cat = categoryStats.find(c => c.id === categoryId) || categories.find(c => c.id === categoryId);
    const catTransactions = transactions.filter(t => t.category === categoryId);
    return {
      category: cat,
      transactions: catTransactions,
    };
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        categories,
        totals,
        reports,
        availableMonths,
        categoryStats,
        activeAlert,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionsForMonth,
        getCategoryDetails,
        triggerPersonalizedAlert,
        dismissAlert,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
