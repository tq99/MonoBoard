import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  SwitchThemeButton,
  SwitchRouterButton,
  XStack,
  YStack,
  Input,
} from '@my/ui'
import { ChevronDown, ChevronUp, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Platform } from 'react-native'
import { signInWithEmail, signUpWithEmail } from '../../api/api'
import { useLink } from 'solito/navigation'

// import { signUpWithEmail } from '../../config/firebase-config'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const linkProps = useLink({
    href: `${linkTarget}/nate`,
  })

  const handleSignin = async () => {
    let response
    try {
      console.log('Signing up...', JSON.stringify(email))
      response = await signInWithEmail(email, password)

      console.log('Sign-up successful:', response)
    } catch (error) {
      console.error('Error during sign-up:', error)
    }
    if (response) {
      linkProps.onPress()
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background">
      <XStack
        pos="absolute"
        w="100%"
        t="$6"
        gap="$6"
        jc="center"
        fw="wrap"
        $sm={{ pos: 'relative', t: 0 }}
      >
        {Platform.OS === 'web' && (
          <>
            <SwitchRouterButton pagesMode={pagesMode} />
            <SwitchThemeButton />
          </>
        )}
      </XStack>

      <YStack gap="$4">
        <H1 ta="center" col="$color12">
          Welcome to Monoboard.
        </H1>
        <Paragraph col="$color10" ta="center">
          Already a user signin
        </Paragraph>
        <Separator />
        <Input
          onChangeText={(text) => {
            const email = String(text)
            setEmail(email)
            console.log(email)
          }}
          placeholder="Email"
          placeholderTextColor="black"
          borderRadius="$3"
          backgroundColor="white"
          padding="$3"
          color="black"
        />
        <Input
          onChangeText={(text) => {
            setPassword(String(text))
          }}
          placeholder="Password"
          placeholderTextColor="black"
          borderRadius="$3"
          backgroundColor="white"
          padding="$3"
          color="black"
        />

        <Separator />
      </YStack>

      <Button onPress={handleSignin}>Sign Up</Button>

      {/* <SheetDemo /> */}
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle bg="$gray8" />
        <Sheet.Frame ai="center" jc="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph ta="center">Made by</Paragraph>
            <Anchor col="$blue10" href="https://twitter.com/natebirdman" target="_blank">
              @natebirdman,
            </Anchor>
            <Anchor
              color="$purple10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
