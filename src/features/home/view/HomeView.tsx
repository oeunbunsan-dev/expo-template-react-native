import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';

const HomeView = () => {
  return (
    <View>
      <Text>HomeView</Text>
      <Ripple>
        <Text>touch me</Text>
      </Ripple>
    </View>
  )
}

export default HomeView
