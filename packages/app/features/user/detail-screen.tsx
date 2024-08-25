import { Button, Paragraph, YStack, Card, Stack, Text, ScrollView, useTheme } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useParams, useRouter } from 'solito/navigation'
import React, { useState, useRef } from 'react'
import { ScrollView as RNScrollView } from 'react-native'
import { Platform } from 'react-native'

export function UserDetailScreen() {
  const router = useRouter()
  const { id } = useParams()

  if (Platform.OS === 'web') {
    return (
      <YStack f={1} jc="center" ai="center" background={'white'}>
        <YStack flexDirection="row" gap={10}>
          <CardWithDropdown />
          <CardWithDropdown />
          <CardWithDropdown />
        </YStack>
      </YStack>
    )
  }
  return (
    <YStack f={1} jc="center" ai="center" gap="$4" bg="$background">
      <CardWithDropdown />
    </YStack>
  )
}
const CardWithDropdown = () => {
  const [cards, setCards] = useState([{ id: 1, selectedItem: null, showDropdown: false }])
  const [cardTitle, setCardTitle] = useState('Title')
  const scrollViewRef = useRef<RNScrollView>(null)
  const toggleDropdown = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, showDropdown: !card.showDropdown } : card
      )
    )
  }

  const handleSelectItem = (id, item) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, selectedItem: item, showDropdown: false } : card
      )
    )
  }

  const addCard = () => {
    const newCard = {
      id: cards.length + 1,
      selectedItem: null,
      showDropdown: false,
    }
    setCards((prevCards) => [...prevCards, newCard])

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }

  const theme = useTheme()

  return (
    <YStack
      borderRadius={20}
      backgroundColor={'white'}
      justifyContent="center"
      alignItems="center"
      p="$4"
    >
      <Button onPress={addCard} mb="$4" borderRadius="$3" width={200}>
        Add Card
      </Button>
      <ScrollView
        ref={scrollViewRef} // Attach the ref to ScrollView
        width="100%"
        height={400}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 50 }} // To ensure the last card is not hidden
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            width={300}
            borderRadius="$4"
            shadowOpacity={0.2}
            padding="$3"
            mb="$4"
          >
            <Text fontSize="$6" color="$color" ta="center">
              Card {card.id}
            </Text>
            <Stack ai="center" mt="$2">
              <Button onPress={() => toggleDropdown(card.id)} borderRadius="$3">
                Toggle Dropdown
              </Button>
            </Stack>
            {card.showDropdown && (
              <YStack background="$backgroundStrong" p="$2" mt="$2" borderRadius="$2">
                <Text
                  fontSize="$4"
                  color="$color"
                  ta="center"
                  onPress={() => handleSelectItem(card.id, 'Item 1')}
                >
                  Dropdown Item 1
                </Text>
                <Text
                  fontSize="$4"
                  color="$color"
                  ta="center"
                  onPress={() => handleSelectItem(card.id, 'Item 2')}
                >
                  Dropdown Item 2
                </Text>
                <Text
                  fontSize="$4"
                  color="$color"
                  ta="center"
                  onPress={() => handleSelectItem(card.id, 'Item 3')}
                >
                  Dropdown Item 3
                </Text>
              </YStack>
            )}
            {card.selectedItem && (
              <Text mt="$2" fontSize="$5" ta="center">
                Selected: {card.selectedItem}
              </Text>
            )}
          </Card>
        ))}
      </ScrollView>
    </YStack>
  )
}
