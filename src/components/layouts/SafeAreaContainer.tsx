import { SafeAreaView } from 'react-native-safe-area-context'

const SafeAreaContainer = ( { children } : any) => {
  return (
    <SafeAreaView style={{ flex : 1 }}>
      { children }
    </SafeAreaView>
  )
}

export default SafeAreaContainer
