import {
  Button,
  XStack,
  YStack,
  Card,
  Stack,
  Text,
  ScrollView,
  useTheme,
  Input,
  Theme,
} from '@my/ui'
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
    <YStack f={1} jc="center" ai="center" gap="$4" backgroundColor={'black'} padding="$4">
      <TabSelect theme={Theme} />
      <CardWithDropdown />
    </YStack>
  )
}
const CardWithDropdown = () => {
  const [cards, setCards] = useState([{ id: 1, selectedItem: null, showDropdown: false }])
  const [isCardTitleEditing, setIsCardTitleEditing] = useState(false)
  const [cardDescription, setCardDescription] = useState('Description')
  const [isCardDescriptionEditing, setIsCardDescriptionEditing] = useState(false)
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
      borderColor={'$borderColor'}
      borderWidth={1}
      padding="$4"
    >
      {/* Add Todo Button */}
      <Button onPress={addCard} mb="$4" borderRadius="$3" width={150} padding="$2">
        Add Todo
      </Button>

      {/* Scrollable Container for Cards */}
      <ScrollView
        ref={scrollViewRef}
        width="100%"
        height={300}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            width={300}
            height={isCardDescriptionEditing ? 250 : 200}
            borderRadius="$4"
            shadowOpacity={0.2}
            padding="$3"
            mb="$4"
          >
            {/* Editable Card Title */}
            {isCardTitleEditing ? (
              <Input
                onChangeText={(text) => setCardTitle(text)}
                onBlur={() => setIsCardTitleEditing(false)}
                onFocus={() => setIsCardTitleEditing(true)}
                placeholder="Card Title"
                placeholderTextColor="black"
                borderRadius="$3"
                backgroundColor="white"
                padding="$3"
                color="black"
              />
            ) : (
              <YStack>
                <Text
                  onPress={() => setIsCardTitleEditing(true)}
                  fontSize="$6"
                  color="$color"
                  ta="left"
                  numberOfLines={1}
                  fontWeight="bold"
                  ellipsizeMode="tail"
                  width="80%"
                >
                  {cardTitle}
                </Text>
              </YStack>
            )}

            {/* Editable Card Description */}
            {isCardDescriptionEditing ? (
              <Stack>
                <Input
                  onChangeText={(text) => setCardDescription(text)}
                  onBlur={() => setIsCardDescriptionEditing(false)}
                  onFocus={() => setIsCardDescriptionEditing(true)}
                  placeholder="Card Description"
                  placeholderTextColor="black"
                  borderRadius="$3"
                  backgroundColor="white"
                  padding="$3"
                  color="black"
                  height={150}
                />
                <Button
                  onPress={() => setIsCardDescriptionEditing(false)}
                  borderRadius="$3"
                  backgroundColor="grey"
                  padding="$2"
                  color="white"
                  width={80}
                  mt="$2"
                >
                  Done
                </Button>
              </Stack>
            ) : (
              <YStack>
                <Text
                  onPress={() => setIsCardDescriptionEditing(true)}
                  fontSize="$4"
                  color="$color"
                  ta="left"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  width="90%"
                  mt="$2"
                >
                  {cardDescription}
                </Text>

                <Button
                  width={80}
                  onPress={() => toggleDropdown(card.id)}
                  borderRadius="$3"
                  backgroundColor="white"
                  padding="$1"
                  mt="$2"
                >
                  Status
                </Button>
              </YStack>
            )}

            {/* Modal Dropdown */}
            {card.showDropdown && (
              <YStack
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={100}
                backgroundColor="rgba(0, 0, 0, 0.5)"
                justifyContent="center"
                alignItems="center"
              >
                <YStack
                  width={250}
                  backgroundColor="white"
                  padding="$4"
                  borderRadius="$2"
                  zIndex={101}
                  shadowOpacity={0.2}
                >
                  <Text
                    fontSize="$4"
                    color="$color"
                    ta="center"
                    onPress={() => handleSelectItem(card.id, 'Todo')}
                  >
                    Todo
                  </Text>
                  <Text
                    fontSize="$4"
                    color="$color"
                    ta="center"
                    mt="$2"
                    onPress={() => handleSelectItem(card.id, 'Progress')}
                  >
                    Progress
                  </Text>
                  <Text
                    fontSize="$4"
                    color="$color"
                    ta="center"
                    mt="$2"
                    onPress={() => handleSelectItem(card.id, 'Completed')}
                  >
                    Completed
                  </Text>
                  <Button
                    mt="$3"
                    onPress={() => toggleDropdown(card.id)}
                    borderRadius="$3"
                    backgroundColor="grey"
                    color="white"
                    padding="$2"
                  >
                    Close
                  </Button>
                </YStack>
              </YStack>
            )}

            {/* Display Selected Item */}
            {card.selectedItem && (
              <Text mt="$2" fontSize="$5" ta="right">
                {card.selectedItem}
              </Text>
            )}
          </Card>
        ))}
      </ScrollView>
    </YStack>
  )
}

const TabSelect = ({ theme }) => {
  return (
    <XStack padding="$4" mt="$10" ai="center" alignItems="center" width="100%">
      <Button width={120}>Todo</Button>
      <Button>Progress</Button>
      <Button>Completed</Button>
    </XStack>
  )
}
