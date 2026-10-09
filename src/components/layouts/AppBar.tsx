import { View } from 'react-native'

const AppBar = ({ children } : any) => {
  return (
    <View style={{ width : "100%", height : 60, backgroundColor : "green"}}>
      { children }
    </View>
  )
}

export default AppBar
