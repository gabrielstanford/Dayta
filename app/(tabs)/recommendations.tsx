import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Platform, SafeAreaView, Animated, Easing} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {useState, useEffect, useRef} from 'react'
import FetchDayActivities from '@/Data/FetchDayActivities';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Card } from '@/Types/ActivityTypes';
import { useCustomSet } from '@/Data/CustomSet';
import { useAppContext } from '@/contexts/AppContext';
import Swiper from 'react-native-deck-swiper';
import LogicModal from '@/components/LogicModal'
import CustomButton from '@/components/CustomButton'
import {PremadeCards} from '@/Data/PremadeCards'

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
  const {state} = useCustomSet();
  const {sleepSum, avgLoggedTimeDaily} = state
  const [logicModalVisible, setLogicModalVisible] = useState<boolean>(false);

  const calculateExerciseScore = (light: number, mod: number, vig: number) => {
    const lightScore = light/300;
    const modScore = mod/150;
    const vigScore = vig/75;

    const totalScore = (lightScore+modScore+vigScore)
    return totalScore
  }

  const [cards, setCards] = useState<Card[]>(PremadeCards);

  const generateCards = () => {

    let customizedCards: Card[] = []
    const wasEnteredSleepDay = (val: any[]) => {
      if(val[1][0]>0) {
        if(val[2][0]>0) {
          return 1
        }
        else {
          return 0
        }
      }
      else {
        return 0
      }

    }
    const numEnteredSleepDays = sleepSum.reduce((accumulator, currentValue) => accumulator + (wasEnteredSleepDay(currentValue)), 0)
    
    if(avgLoggedTimeDaily<8) {
      if (numEnteredSleepDays<=4) {
      const impact = 10
      customizedCards = [{...PremadeCards[0], impactScore: impact, recDetails: `In order to generate meaningful recommendations, we need enough information. This is gathered completely through the journal. Over the last two weeks, you have only logged an average of ${Math.round(avgLoggedTimeDaily/3600)} hours each day. The benchmark to aim for is 8 hours a day. We believe this is realistic and will give us enough to generate real stats and recommendations. The more the merrier though! We additionally see that you have only entered both sleep and wake times for ${numEnteredSleepDays} of the past 12 days. It's very easy and quick to enter this so get in the habit of doing it! For now, recommendations will be general and untailored. Feel free to scroll nonetheless to learn about the most important principles! For detailed suggestions on improving your logging habits, click below!`}, ...PremadeCards]
    }
      else {
      const impact = 8
      customizedCards = [{...PremadeCards[0], impactScore: impact, recDetails: `In order to generate meaningful recommendations, we need enough information. This is gathered completely through the journal. Over the last two weeks, you have only logged an average of ${Math.round(avgLoggedTimeDaily/3600)} hours each day. The benchmark to aim for is 8 hours a day. We believe this is realistic and will give us enough to generate real stats and recommendations. The more the merrier though! Since you have entered adequate data about sleep (great job!), we are able to offer some sleep-related recommendations. Feel free to scroll nonetheless for these, as well as general ones to learn! For detailed suggestions on improving your logging habits, click below!`}, ...PremadeCards]

      }
    }
  
    else {
      //here's where we can get down to the nitty gritty, generating statistics from the day/sleep info and then offering related recs.
      customizedCards = [PremadeCards[1], PremadeCards[2], PremadeCards[3], PremadeCards[4]]
      // customizedCards.sort((a, b) => b.impactScore-a.impactScore)
    }
    
    setCards(customizedCards)
  }

  useEffect(() => {
    generateCards()
  }, [avgLoggedTimeDaily])
  const swiperRef = useRef<any>(null);
  const [cardIndex, setCardIndex] = useState(0);

  const diveInPressed = () => {
    setLogicModalVisible(true);
  }

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
  // useEffect(() => {
  //   FetchDayActivities(user, 0, justActivities, setTodayActivities, true)
  // }, [justActivities])


  const renderCard = (card: any) => {
    return (
      <View style={styles.recContainer}>
        <View style={styles.recTitle}>
        <Text style={styles.recText}>{cardIndex + 1}. </Text>
          <Text style={[styles.recText, { color: 'white' }]}>{card.title}</Text>
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
          <CustomButton title="Dive In" onPress={diveInPressed} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.layoutContainer}>
      <LogicModal visible={logicModalVisible} card={cards[cardIndex]} onClose={() => setLogicModalVisible(false)}/>
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
