import {Text, View, StyleSheet} from 'react-native'

export const RenderAfternoon = () => {
    return (
        <View>
            {/* Title */}
            <Text style={styles.heading}>Phase 2: Midday Through Evening (Hours 5–13)</Text>

            {/* Subsection */}
            <Text style={styles.subheading}>Use exercise to optimize your energy levels</Text>
            <Text style={styles.paragraph}>
            Exercise helps to regulate blood sugar, balance hormone levels, improve immunity, and
            depending on the type of exercise, can either increase energy levels or support feelings of relaxation.
            </Text>

            {/* Subsection */}
            <Text style={styles.subheading}>Optimize your food and hydration</Text>
            <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>Eat a lower-carb lunch to help avoid an afternoon crash</Text>
            </View>
            <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>
                Go for a short 5–30 minute walk after lunch to increase metabolism and further calibrate your circadian rhythm with light exposure.
            </Text>
            </View>

            {/* Subsection */}
            <Text style={styles.subheading}>Rest and recharge with naps or non-sleep deep rest (NSDR)</Text>
            <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>
                Try to keep naps to 20 minutes or less to avoid sleep inertia. However, if you don’t feel an afternoon dip in energy or you tend to feel groggy after a nap, feel free to avoid them. Naps are not necessary.
            </Text>
            </View>
            <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>
                Use a non-sleep deep rest (NSDR) protocol for 10–30 minutes to increase dopamine levels and mental energy.
            </Text>
            </View>

            {/* Subsection */}
            <Text style={styles.subheading}>Eat dinner and prioritize sunset light exposure</Text>
            <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>
                Eat dinner with some higher-carbohydrate (i.e. starchy but still complex) foods and protein to promote relaxation and sleep.
            </Text>
            </View>
            <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>
                Get light exposure around sunset to reduce the negative effects of light exposure later in the night.
            </Text>
            </View>
        </View>
    );
}
export const RenderMorning = () => {
    return (
      <View >
        <Text style={styles.heading}>Phase 1: Waking and Early Morning (Hours 1–4)</Text>
  
        <Text style={styles.subheading}>Prioritize light exposure each morning</Text>
        <Text style={styles.paragraph}>
          Outdoor light exposure causes a beneficial cortisol peak early in the morning; increases daytime mood, energy, and alertness; and helps you fall asleep more easily at night.
        </Text>
        <Text style={styles.paragraph}>
          A morning walk outdoors can provide you with both light exposure and optic flow, which quiets activity of the amygdala and related circuits and reduces feelings of stress and anxiety all day.
        </Text>
  
        <Text style={styles.subheading}>Delay caffeine and ensure proper hydration</Text>
        <Text style={styles.bulletPoint}>• Delay your caffeine intake by 90–120 minutes after waking to help increase alertness and avoid an afternoon crash.</Text>
        <Text style={styles.bulletPoint}>• If exercising first thing in the morning, feel free to drink caffeine before exercise.</Text>
        <Text style={styles.bulletPoint}>• Aim to drink around 32 ounces (1 liter) of water during this morning period, and add a pinch of sea salt for a source of electrolytes.</Text>
  
        <Text style={styles.subheading}>Use breathing to increase energy</Text>
        <Text style={styles.paragraph}>
          Cyclic hyperventilation shifts the autonomic nervous system towards increased alertness and enhanced focus. It involves rapid inhales and exhales, releasing adrenaline and increasing neural excitability.
        </Text>
        <Text style={styles.paragraph}>To practice:</Text>
        <View style={styles.indent}>
          <Text style={styles.bulletPoint}>• Take a deep inhale through your nose, immediately followed by a deep exhale through your mouth.</Text>
          <Text style={styles.bulletPoint}>• Repeat 20–25 times, then fully exhale until lungs are empty.</Text>
          <Text style={styles.bulletPoint}>• Hold for 15–30 seconds.</Text>
          <Text style={styles.bulletPoint}>• Repeat for up to 5 minutes total.</Text>
        </View>
  
        <Text style={styles.warning}>
          Expect to feel tingly or agitated during the exercise. Over the next few minutes, adrenaline will increase, improving focus and attention.
        </Text>
        <Text style={styles.warning}>
          Use caution if you are prone to panic attacks or have high anxiety. Practice seated in a safe environment—and never near water, as this can cause blacking out, especially when extending breath holds.
        </Text>
  
        <Text style={styles.subheading}>Optimize your productivity</Text>
        <View style={styles.indent}>
          <Text style={styles.bulletPoint}>• Position your computer screen at eye level or above for increased alertness.</Text>
          <Text style={styles.bulletPoint}>• Use binaural beats at 40 hertz if struggling to focus. White noise or silence is also effective.</Text>
        </View>
        <Text style={styles.paragraph}>
          The best time to do hard mental work is typically in the 1–4 hours after waking. Moderate-intensity exercise before deep work can improve focus and productivity.
        </Text>
      </View>
    );
  };

  export const RenderEvening = () => {
    return (
      <View>
        <Text style={styles.heading}>Phase 3: Bedtime and Sleeping (Hours 14–24)</Text>
  
        <Text style={styles.subheading}>Prioritize a consistent sleep schedule</Text>
        <Text style={styles.bulletPoint}>• It is crucial to wake up at the same time (+/- 1 hour) each morning, including days off.</Text>
        <Text style={styles.bulletPoint}>• Sleeping in later on weekends can disrupt your circadian rhythm and make waking on your regular schedule harder.</Text>
  
        <Text style={styles.subheading}>Use breathing to promote relaxation</Text>
        <Text style={styles.paragraph}>
          Physiological sighing rapidly shifts the autonomic nervous system towards a state of increased calm. Even just 1–3 cyclic sighs can be effective. If practiced as a short breathwork routine for five minutes a day, it has been shown to improve sleep, lower resting heart rate, and enhance mood.
        </Text>
        <Text style={styles.paragraph}>To practice:</Text>
        <View style={styles.indent}>
          <Text style={styles.bulletPoint}>• Take a deep inhale followed by a second, 'top-off' inhale to maximally inflate the lungs.</Text>
          <Text style={styles.bulletPoint}>• Release all your air with a full “lungs-to-empty” exhale.</Text>
          <Text style={styles.bulletPoint}>• Repeat 2–3 times.</Text>
        </View>
  
        <Text style={styles.subheading}>Optimize your sleep environment</Text>
        <View style={styles.indent}>
          <Text style={styles.bulletPoint}>• Start dimming the lights shortly after sunset and avoid overhead and bright lights in general.</Text>
          <Text style={styles.bulletPoint}>• Dim computer and phone screens as much as possible, or use a red-hued filter to reduce blue light exposure.</Text>
          <Text style={styles.bulletPoint}>• Cool your bedroom to 1–3 degrees lower than usual.</Text>
          <Text style={styles.bulletPoint}>• Make your room as dark as possible using blackout blinds or an eye mask.</Text>
        </View>
  
        <Text style={styles.subheading}>If you wake up in the middle of the night</Text>
        <Text style={styles.paragraph}>
          Use NSDR (Non-Sleep Deep Rest) to promote relaxation and support falling back asleep quickly.
        </Text>
      </View>
    );
  };
const styles = StyleSheet.create({

    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FF6F00', // Orange color
      },
      subheading: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
        color: '#004D40', // Dark Cyan color
      },
      paragraph: {
        fontSize: 16,
        lineHeight: 22,
        color: '#004D40', // Dark Cyan color
      },
      listItem: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-start',
      },
      bullet: {
        fontSize: 20,
        lineHeight: 22,
        color: '#FF6F00', // Orange color
        marginRight: 10,
      },
      bulletPoint: {
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 2,
        paddingLeft: 10,
        color: '#004D40', // Dark Cyan color
      },
      indent: {
        paddingLeft: 15,
        marginBottom: 10,
      },
      warning: {
        fontSize: 16,
        color: '#FF3D00', // Brighter Orange color for warnings
        marginVertical: 10,
        lineHeight: 22,
      },
  });
