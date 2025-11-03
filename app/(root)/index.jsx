import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/sign-out-button'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react'


export default function Page() {
  const { user } = useUser()
  const { summary, transactions, isLoading, error, loadData, deleteTransaction } = useTransactions(user?.id)
 
  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id, loadData])
  
  // Log transactions - visible in terminal when running on iOS/Android
  // For web: logs appear in browser console (F12)
  useEffect(() => {
    if (transactions) {
      console.log('\n========== TRANSACTIONS ==========')
      console.log('Transactions:', transactions)
      console.log('Count:', transactions.length)
      console.log('================================\n')
      
      console.log('User ID:', user?.id)
    }
  }, [transactions, user?.id])
  if(error) {
    return <Text>Error: {error.message}</Text>
  };

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Income: {summary.income}</Text>
        <Text>Expense: {summary.expenses}</Text>
        <Text>Balance: {summary.balance}</Text>
        <SignOutButton />    
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}