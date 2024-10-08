import { Stack } from 'expo-router'
import { useTheme } from '@my/ui'
import { UserDetailScreen } from 'app/features/user/detail-screen'

export default function Screen() {
  const theme = useTheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'User',
          presentation: 'modal',
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <UserDetailScreen />
    </>
  )
}
