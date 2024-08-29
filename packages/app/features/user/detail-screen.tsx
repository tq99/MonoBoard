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
  SelectItemParentProvider,
} from '@my/ui'
import { useParams, useRouter } from 'solito/navigation'
import React, { useState, useRef } from 'react'
import { ScrollView as RNScrollView } from 'react-native'
import { Platform } from 'react-native'

export function UserDetailScreen() {
  const router = useRouter()
  const { id } = useParams()
  const theme = useTheme()

  if (Platform.OS === 'web') {
    return (
      <YStack f={1} justifyContent="center" alignItems="center" background="white">
        {/* Outer container to center cards */}
        <YStack width="100%" maxWidth={900} flexDirection="row" gap={10} justifyContent="center">
          {/* Inner containers to manage card layout */}
          <YStack width="45%" flexDirection="column" gap={10}>
            <CardWithDropdown initialTasks={tasks} category="Todo" />
          </YStack>
          <YStack width="45%" flexDirection="column" gap={10}>
            <CardWithDropdown initialTasks={tasks} category="Progress" />
          </YStack>
          <YStack width="45%" flexDirection="column" gap={10}>
            <CardWithDropdown initialTasks={tasks} category="Completed" />
          </YStack>
        </YStack>
      </YStack>
    )
  }
  return (
    <YStack f={1} jc="center" ai="center" gap="$4" backgroundColor={'$background'} padding="$4">
      <TabSelect theme={Theme} />
      <CardWithDropdown initialTasks={tasks} category="Todo" />
    </YStack>
  )
}

const tasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'This is the description for Task 1.',
    showDropdown: false,
    selectedItem: null,
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'This is the description for Task 2.',
    showDropdown: false,
    selectedItem: null,
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'This is the description for Task 3.',
    showDropdown: false,
    selectedItem: null,
  },
  {
    id: 4,
    title: 'Task 4',
    description: 'This is the description for Task 4.',
    showDropdown: false,
    selectedItem: null,
  },
  {
    id: 5,
    title: 'Task 5',
    description: 'This is the description for Task 5.',
    showDropdown: false,
    selectedItem: null,
  },
]

const CardWithDropdown = ({ initialTasks, category }) => {
  const [cards, setCards] = useState(initialTasks || [])
  const [isCardTitleEditing, setIsCardTitleEditing] = useState(null) // track which card is being edited
  const [isCardDescriptionEditing, setIsCardDescriptionEditing] = useState(null) // track which card is being edited
  const scrollViewRef = useRef<RNScrollView>(null)
  const theme = useTheme()

  // Toggle dropdown visibility for a specific card
  const toggleDropdown = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, showDropdown: !card.showDropdown } : card
      )
    )
  }

  // Handle item selection from the dropdown menu
  const handleSelectItem = (id, item) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, selectedItem: item, showDropdown: false } : card
      )
    )
  }

  // Add a new card to the list
  const addCard = () => {
    const newCard = {
      id: cards.length + 1,
      title: 'Title',
      description: 'Description',
      selectedItem: category,
      showDropdown: false,
    }
    setCards((prevCards) => [...prevCards, newCard])

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }

  // Update the title of a specific card
  const setCardTitle = (id, newTitle) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, title: newTitle } : card))
    )
  }

  // Update the description of a specific card
  const setCardDescription = (id, newDescription) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, description: newDescription } : card))
    )
  }

  return (
    <YStack
      borderRadius={20}
      backgroundColor={'#E8E8E8'}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      width={'100%'}
    >
      <Button
        onPress={addCard}
        mb="$4"
        borderRadius="$3"
        backgroundColor={theme.buttonBackground}
        width={150}
        padding="$2"
      >
        Add Todo
      </Button>

      <ScrollView
        ref={scrollViewRef}
        width={'100%'}
        height={300}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
          minWidth: '100%',
          alignItems: 'center', // Center items horizontally
        }}
      >
        {cards.map(
          (card) =>
            category === card.selectedItem && (
              <Card
                key={card.id}
                width={350}
                height={isCardDescriptionEditing === card.id ? 250 : 200}
                borderRadius="$4"
                shadowOpacity={0.2}
                padding="$3"
                mb="$4"
                backgroundColor={theme.cardBackground}
              >
                {/* Editable Card Title */}
                {isCardTitleEditing === card.id ? (
                  <Input
                    onChangeText={(text) => setCardTitle(card.id, text)}
                    onBlur={() => setIsCardTitleEditing(null)}
                    onFocus={() => setIsCardTitleEditing(card.id)}
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
                      onPress={() => setIsCardTitleEditing(card.id)}
                      fontSize="$6"
                      color="$color"
                      ta="left"
                      numberOfLines={1}
                      fontWeight="bold"
                      ellipsizeMode="tail"
                      width="80%"
                    >
                      {card.title}
                    </Text>
                  </YStack>
                )}

                {/* Editable Card Description */}
                {isCardDescriptionEditing === card.id ? (
                  <Stack>
                    <Input
                      onChangeText={(text) => setCardDescription(card.id, text)}
                      onBlur={() => setIsCardDescriptionEditing(null)}
                      onFocus={() => setIsCardDescriptionEditing(card.id)}
                      placeholder="Card Description"
                      placeholderTextColor="black"
                      borderRadius="$3"
                      backgroundColor="white"
                      padding="$3"
                      color="black"
                      height={150}
                    />
                    <Button
                      onPress={() => setIsCardDescriptionEditing(null)}
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
                      onPress={() => setIsCardDescriptionEditing(card.id)}
                      fontSize="$4"
                      color="$color"
                      ta="left"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      width="90%"
                      mt="$2"
                    >
                      {card.description}
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
            )
        )}
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

const CardComponent = ({
  card,
  cardTitle,
  cardDescription,
  setCardTitle,
  setCardDescription,
  toggleDropdown,
  handleSelectItem,
}) => {
  const [isCardTitleEditing, setIsCardTitleEditing] = useState(false)
  const [isCardDescriptionEditing, setIsCardDescriptionEditing] = useState(false)

  return (
    <Card
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
          onChangeText={setCardTitle()}
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
  )
}
