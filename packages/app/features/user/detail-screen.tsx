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
  Paragraph,
} from '@my/ui'
import { useParams, useRouter } from 'solito/navigation'
import React, { useState, useRef, useEffect } from 'react'
import { ScrollView as RNScrollView } from 'react-native'
import { Platform } from 'react-native'
import { db } from '../../config/firebase-config'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  DocumentData,
  setDoc,
  doc,
} from 'firebase/firestore'
import { useEmailStore } from '../../store/store'

export function UserDetailScreen() {
  const router = useRouter()
  const { id } = useParams()
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = useState('Todo')
  const [projectName, setProjectName] = useState('')

  const handleTabSelect = (tab) => {
    setSelectedTab(tab)
  }

  if (Platform.OS === 'web') {
    return (
      <YStack f={1} justifyContent="center" alignItems="center" background="white">
        <YStack width={'100%'} ml="$10">
          <Text
            textAlign="left"
            width="100%"
            fontSize="$8"
            color={theme.text}
            ta="left"
            numberOfLines={1}
            fontWeight={'bold'}
          >
            {' '}
            Mono Board
          </Text>
          <Paragraph
            textAlign="left"
            mt="$4"
            mb="$4"
            width="100%"
            fontSize="$2"
            color={theme.textSecondary}
            ta="left"
          >
            Monoboard is a simple project management app that allows you to create and manage
            tasks,and track progress.
          </Paragraph>
        </YStack>
        <YStack width="100%" maxWidth={900} flexDirection="row" gap={10} justifyContent="center">
          <YStack width="50%" flexDirection="column" gap={10}>
            <CardWithDropdown initialTasks={[]} category="Todo" containerHeight={600} />
          </YStack>
          <YStack width="50%" flexDirection="column" gap={10}>
            <CardWithDropdown initialTasks={[]} category="Progress" containerHeight={600} />
          </YStack>
          <YStack width="50%" flexDirection="column" gap={10}>
            <CardWithDropdown initialTasks={[]} category="Completed" containerHeight={600} />
          </YStack>
        </YStack>
      </YStack>
    )
  }
  return (
    <YStack f={1} jc="center" ai="center" gap="$4" backgroundColor={'$background'} padding="$4">
      <Text
        textAlign="left"
        width="100%"
        fontSize="$8"
        color="$color"
        ta="left"
        numberOfLines={1}
        fontWeight={'bold'}
      >
        {' '}
        Mono Board
      </Text>
      <Paragraph textAlign="left" width="100%" fontSize="$2" color="$color" ta="left">
        Monoboard is a simple project management app that allows you to create and manage tasks,and
        track progress.
      </Paragraph>
      <TabSelect theme={theme} onTabSelect={handleTabSelect} />
      <CardWithDropdown containerHeight={500} initialTasks={[]} category={selectedTab} />
    </YStack>
  )
}

interface CardType {
  id: number
  title: string
  description: string
  selectedItem: string
  showDropdown: boolean
}

const CardWithDropdown = ({ initialTasks, category, containerHeight }) => {
  const [cards, setCards] = useState(initialTasks || [])
  const [isCardTitleEditing, setIsCardTitleEditing] = useState(null) // track which card is being edited
  const [isCardDescriptionEditing, setIsCardDescriptionEditing] = useState(null) // track which card is being edited
  const scrollViewRef = useRef<RNScrollView>(null)
  const theme = useTheme()
  const { email } = useEmailStore()

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

  useEffect(() => {
    getCardsByEmail(email)
  }, [email])

  useEffect(() => {
    saveCardsToFirebase()
  }, [cards])

  const getCardsByEmail = async (email: string) => {
    try {
      const cardsRef = collection(db, 'cards')
      const q = query(cardsRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      const fetchedCards: CardType[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData
        if (Array.isArray(data.cards)) {
          fetchedCards.push(...data.cards)
        }
      })

      setCards(fetchedCards)
    } catch (e) {
      console.error('Error fetching documents: ', e)
    }
  }
  const saveCardsToFirebase = async () => {
    try {
      const cardsRef = collection(db, 'cards')

      const q = query(cardsRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          const docRef = doc(db, 'cards', docSnap.id)
          await setDoc(docRef, { cards: cards }, { merge: true })
          console.log('Document updated with ID: ', docSnap.id)
        })
      } else {
        const newDocRef = await addDoc(collection(db, 'cards'), {
          cards: cards,
          email: email,
        })
        console.log('New document created with ID: ', newDocRef.id)
      }
    } catch (e) {
      console.error('Error saving documents: ', e)
    }
  }

  const handleDeleteCard = (id) => {
    const updatedCards = cards.filter((card) => card.id !== id)

    setCards(updatedCards)
  }

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

  const setCardTitle = (id, newTitle) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, title: newTitle } : card))
    )
  }

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
      height={containerHeight ? containerHeight : 300}
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
        Add {category}
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
                height={isCardDescriptionEditing === card.id ? 250 : 170}
                borderRadius="$4"
                shadowOpacity={0.2}
                padding="$3"
                mb="$4"
                backgroundColor={theme.cardBackground}
              >
                {!isCardTitleEditing && (
                  <Button
                    onPress={() => handleDeleteCard(card.id)}
                    position="absolute"
                    top={5}
                    right={5}
                    borderRadius="$6"
                    backgroundColor="black"
                    color="white"
                  >
                    X
                  </Button>
                )}
                {isCardTitleEditing === card.id ? (
                  <Input
                    onChangeText={(text) => setCardTitle(card.id, text)}
                    value={card.title}
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
                      multiline={true}
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

                    <XStack width="100%" justifyContent="space-between" alignItems="center" mt="$6">
                      {/* Status Button */}
                      <Button
                        width={80}
                        onPress={() => toggleDropdown(card.id)}
                        borderRadius="$3"
                        backgroundColor="white"
                        padding="$1"
                      >
                        Status
                      </Button>

                      {/* Status Text */}
                      {card.selectedItem && (
                        <Text fontSize="$5" ta="right">
                          {card.selectedItem}
                        </Text>
                      )}
                    </XStack>
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
                {/* {card.selectedItem && (
                  <Text mt="$2" fontSize="$5" ta="right">
                    {card.selectedItem}
                  </Text>
                )} */}
              </Card>
            )
        )}
      </ScrollView>
    </YStack>
  )
}
const TabSelect = ({ theme, onTabSelect }) => {
  const [activeTab, setActiveTab] = useState('Todo')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (onTabSelect) {
      onTabSelect(tab) // Pass the selected tab to the callback
    }
  }

  const getButtonStyle = (tab) => ({
    backgroundColor: activeTab === tab ? 'black' : '#E8E8E8',
    color: activeTab === tab ? 'white' : theme.inactiveTextColor,
    width: 120,
    margin: '0 10px',
    padding: '10px 0', // Ensure padding for a better visual effect
  })

  return (
    <XStack padding="$2" mt="$4" ai="center" alignItems="center" width="100%">
      <Button style={getButtonStyle('Todo')} onPress={() => handleTabClick('Todo')}>
        Todo
      </Button>
      <Button style={getButtonStyle('Progress')} onPress={() => handleTabClick('Progress')}>
        Progress
      </Button>
      <Button style={getButtonStyle('Completed')} onPress={() => handleTabClick('Completed')}>
        Completed
      </Button>
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
            backgroundColor="#E8E8E8"
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
