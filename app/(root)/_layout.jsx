import { Redirect } from "expo-router";
import { Stack} from "expo-router/stack";
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
    const { isSignedIn} = useAuth();
    if(!isSignedIn) return <Redirect href={"/(auth)/sign-in"}></Redirect>
    return <Stack screenOptions={{ headerShown: false}}></Stack>
};

