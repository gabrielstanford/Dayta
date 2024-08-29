import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Platform, SafeAreaView, Animated, Easing} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {useState, useEffect, useRef} from 'react'
import FetchDayActivities from '@/Data/FetchDayActivities';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from '@/Types/ActivityTypes';
import { useCustomSet } from '@/Data/CustomSet';
import { useAppContext } from '@/contexts/AppContext';
import RecDescribeModal from '@/components/RecDescribeModal';
import Swiper from 'react-native-deck-swiper';
import LogicModal from '@/components/LogicModal'
import CustomButton from '@/components/CustomButton'

//import firestore from '@react-native-firebase/firestore'

const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

//pass in activities, times
//convert to local time

const decimalToTime = (decimal: number): string => {
  // Extract hours and minutes from the decimal number
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);

  // Format minutes to always be two digits
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Return time in 'H:MM' format
  return `${hours}:${formattedMinutes}`;
};

export default function Recommendations() {
  const [rec1, setRec1] = useState<string>("")
  const {state} = useCustomSet();
  const entertainmentSpeel = `We know that entertaining activities can feel good in the moment, and a bit of it is fine, but in excessive amounts these will have detrimental effects on the health of your dopamine system. In other words, in the long term you will be more sad and stressed if you continue like this. But don't worry, we're here to help!`
  const {justActivities} = useAppContext();
  const {tagDurationSum, avgTimeByTag, sleepSum} = state
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [logicModalVisible, setLogicModalVisible] = useState<boolean>(false);

  const calculateExerciseScore = (light: number, mod: number, vig: number) => {
    const lightScore = light/300;
    const modScore = mod/150;
    const vigScore = vig/75;

    const totalScore = (lightScore+modScore+vigScore)
    return totalScore
  }

  const [cards, setCards] = useState([
    { windDown: "Night-Time Wind Down Routine", recCategory: 'Sleep Hygiene', impactScore: 9, recDetails: 'Based on your entries, we gather that your sleep habits could use some serious improvement. Sleep is one of the most important parts of our health and well-being, and improving your sleep is proven to have numerous incredible benefits. A few simple shifts in your routine will make all the difference. Click below to generate a detailed report on your current habits and an actionable plan to improve!' },
    { windDown: 'Unwind', recCategory: 'Reading', impactScore: 7, recDetails: 'Read a calming book before bed.' },
    { windDown: 'New', recCategory: 'Reading', impactScore: 7, recDetails: 'Read a calming book before bed.' },
    // { windDown: 'Calm', recCategory: 'Breathing', impactScore: 8, recDetails: 'Deep breathing exercises to calm the mind.' },
    // Add more cards as needed
  ]);
  const swiperRef = useRef<any>(null);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.jumpToCardIndex(cardIndex);
    }
  }, [cardIndex]);

  const onSwipedRight = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const onSwipedLeft = () => {
    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1);
    }
  };
  
  const arrowTranslateX = useRef(new Animated.Value(-50)).current; // Start with the arrow off-screen

  const animateArrow = () => {
    Animated.sequence([
      Animated.timing(arrowTranslateX, {
        toValue: 0, // Move the arrow into view
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(arrowTranslateX, {
        toValue: -50, // Move the arrow back out of view
        duration: 800,
        delay: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Loop the animation
      animateArrow();
    });
  };
  useEffect(() => {
    animateArrow();
  }, [cardIndex]);
  const {user} = useAuth();
  useEffect(() => {
    FetchDayActivities(user, 0, justActivities, setTodayActivities, true)
  }, [justActivities])

  console.log('sleep sum: ', sleepSum)

  const renderCard = (card: any) => {
    return (
      <View style={styles.recContainer}>
        <View style={styles.recTitle}>
          <Text style={[styles.recText, { color: 'white' }]}>{card.windDown}</Text>
        </View>
        <View style={styles.recCategory}>
          <Text style={styles.recText}>Category: </Text>
          <Text style={[styles.recText, { color: 'white' }]}>{card.recCategory}</Text>
        </View>
        <View style={styles.recCategory}>
          <Text style={styles.recText}>Impact Score: </Text>
          <Text style={[styles.recText, { color: 'white' }]}>{card.impactScore}/10</Text>
        </View>
        <View style={styles.recCategory}>
          <Text style={styles.recText}>Details: </Text>
          <Text style={[styles.recText, { color: 'white' }]}>{card.recDetails}</Text>
        </View>
        <View style={styles.diveInButtonContainer}>
          <CustomButton title="Dive In" onPress={() => setLogicModalVisible(true)} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.layoutContainer}>
      <RecDescribeModal visible={modalVisible} onClose={() => setModalVisible(false)} speel={entertainmentSpeel} />
      <LogicModal visible={logicModalVisible} onClose={() => setLogicModalVisible(false)} speel={"Filler Text"}/>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText" style={{fontSize: width/12}}>Recommendations</ThemedText>
      </View>
      <SafeAreaView style={{flex: 1}}>
        <Swiper
          ref={swiperRef}
          cards={cards}
          cardIndex={cardIndex}
          renderCard={renderCard}
          onSwipedRight={onSwipedRight}
          onSwipedLeft={onSwipedLeft}
          stackSize={1}
          disableTopSwipe
          disableBottomSwipe
          disableRightSwipe={cardIndex <= 0} // Disable right swipe at the last card
          disableLeftSwipe={cardIndex >= cards.length - 1} // Disable left swipe at the first card
          animateCardOpacity
          backgroundColor="transparent"
          cardHorizontalMargin={0}
          cardVerticalMargin={0}
          useViewOverflow={Platform.OS === 'ios'}
          infinite={false}
          showSecondCard={false}
          key={cardIndex}  // Force re-render on card index change
          stackSeparation={15}
          overlayLabels={{
            left: {
              title: 'Next',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: 'Prev',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      </SafeAreaView>
      <Animated.View style={[styles.arrowContainer, { transform: [{ translateX: arrowTranslateX }] }]}>
      <Text style={styles.arrowText}>→</Text>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    paddingTop: height/18,
    backgroundColor: 'darkcyan',
    position: 'relative', // Container must be relative for absolute positioning of child
  },
  contentContainer: {
    flex: 1,
    paddingBottom: height/11.6, // Space at the bottom to accommodate the button
  },
  titleContainer: {
    alignItems: 'center',
    padding: 10,
  },
  detailsButton: {
    backgroundColor: 'red'
  },
  stepContainer: {
    padding: 8,
    marginBottom: 10,

  },
  // infoButtonContainer: {
  //   marginTop: 'auto',
  //   marginBottom: 10,
  //   alignItems: 'center'
  // },
  diveInButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  recContainer: {
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20
  },
  recTitle: {

    flexDirection: 'row',
    
  },
  recCategory: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  recText: {
    fontSize: 20, color: 'orange', fontStyle: 'italic'
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  arrowText: {
    fontSize: 40,
    color: '#000',
  },
});
