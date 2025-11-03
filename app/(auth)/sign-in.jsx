import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '@/assets/styles/auth.styles.js' 
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors.js'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if(err.errors?.[0]?.code === 'form_password_incorrect') {
        setError('Password is incorrect')
      } else {
        console.error('Sign-in error:', err)
        console.error('Error details:', JSON.stringify(err, null, 2))
        alert(`Sign-in error: ${err.message || 'Unknown error occurred'}`)
      }
    }
  }

  return (
    <KeyboardAwareScrollView 
      style={{flex:1}}
      enableOnAndroid={true}
      contentContainerStyle={{flexGrow:1}}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
    >
      <View style={[styles.container, {alignItems:"center", justifyContent:"center"}]}>
      <Image source={require("../../assets/images/revenue-i4.png")} style={styles.illustration}/>
      <Text style={{ marginTop: 20, marginBottom: 10 }}>Sign in</Text>
      <View style={{width:"80%", marginBottom: 10}}>
        {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={24} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity> 
            </View>
          ) : null}
      </View>
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      <TouchableOpacity onPress={onSignInPress}>
      <Text style={styles.button}>Continue</Text>
      </TouchableOpacity>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
        <Link href="/(auth)/sign-up">
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      </View>
    </KeyboardAwareScrollView>
  )
}